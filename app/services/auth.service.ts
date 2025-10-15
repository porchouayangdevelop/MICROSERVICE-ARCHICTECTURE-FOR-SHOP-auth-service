import {UserRepository} from "../repositories/user.repo";
import {RoleRepository} from "../repositories/role.repo";
import {TokenService} from "./token.service";
import {PasswordService} from "./password.service";
import {AuditService} from "./audit.service";
import {EmailService} from "./email.service";
import {use} from "passport";


export interface RegisterDto {
	email: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
}

export interface LoginDto {
	email: string;
	password: string;
}


export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: number;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		roles: string[];
		permissions: string[];
	}
}

export class AuthService {
	constructor(
		private userRepo: UserRepository,
		private roleRepo: RoleRepository,
		private tokenService: TokenService,
		private passwordService: PasswordService,
		private auditService: AuditService,
		private emailService: EmailService,
	) {
	}
	
	async register(credentials: RegisterDto, ipAddress?: string): Promise<AuthResponse> {
		const [existEmail] = await Promise.all([this.userRepo.findByEmail(credentials.email)]);
		if (existEmail) {
			throw new Error("Email already exist");
		}
		
		const existUser = await this.userRepo.findByUsername(credentials.username);
		if (existUser) {
			throw new Error("Username already exist");
		}
		
		this.passwordService.validatePassword(credentials.password);
		
		const hashedPassword = await this.passwordService.hashPassword(credentials.password);
		
		const user = await this.userRepo.create({
			email: credentials.email,
			username: credentials.username,
			password: hashedPassword,
			first_name: credentials.firstName,
			last_name: credentials.lastName,
		});
		
		const userRole = await this.roleRepo.findByName('user');
		if (userRole) {
			await this.userRepo.assignRole(user?.id, userRole.id, user?.id);
		}
		
		await this.auditService.log({
			userId: user!.id,
			action: 'user_registered',
			resource_type: 'user',
			resource_id: user?.id,
			ip_address: ipAddress,
			performedBy: user?.id
		});
		
		
		const roles = await this.userRepo.getUserRoles(user?.id);
		const permissions = await this.userRepo.getUserPermissions(user?.id);
		
		const token = await this.tokenService.generateTokenPair({
			id: user!.id,
			email: user!.email,
			username: user!.username,
			roles: roles.map((r) => r.name),
			permissions: permissions.map((p) => p.name)
		}, ipAddress, user?.id);
		
		return {
			accessToken: token.accessToken,
			refreshToken: token.refreshToken,
			user: {
				id: user!.id,
				email: user!.email,
				username: user!.username,
				firstName: user!.first_name,
				lastName: user!.last_name,
				roles: roles.map((r) => r.name),
				permissions: permissions.map((p) => p.name)
			},
		};
	};
	
	async login(credentials: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
		const user = await this.userRepo.findByEmail(credentials.email);
		if (!user) {
			throw new Error("Invalid credentials entered");
		}
		
		if (!user.is_active) {
			throw new Error("Account is disabled");
		}
		
		
		const isValidPassword = await this.passwordService.verifyPassword(
			credentials.password,
			user.password,
		);
		
		if (!isValidPassword) {
			await this.auditService.log({
				userId: user.id,
				action: 'login_failed',
				resource_type: 'user',
				resource_id: user.id,
				ip_address: ipAddress,
				performedBy:user.id,
			});
			throw new Error("Invalid credentials entered");
		}
		
		await this.userRepo.updateLastLogin(user.id);
		
		const roles = await this.userRepo.getUserRoles(user.id);
		const permissions = await this.userRepo.getUserPermissions(user.id);
		
		const token = await this.tokenService.generateTokenPair({
			id: user.id,
			email: user.email,
			username: user.username,
			roles: roles.map((r) => r.name),
			permissions: permissions.map((p) => p.name)
		}, ipAddress, userAgent);
		
		await this.auditService.log({
			userId: user.id,
			action: 'login_success',
			resource_type: 'user',
			resource_id: user.id,
			ip_address: ipAddress,
			performedBy: user.id
		});
		return {
			accessToken: token.accessToken,
			refreshToken: token.refreshToken,
			user: {
				id: user.id,
				email: user.email,
				username: user.username,
				firstName: user.first_name,
				lastName: user.last_name,
				roles: roles.map((r) => r.name),
				permissions: permissions.map((p) => p.name)
			}
		}
	}
	
	async refreshToken(refreshToken: string, ipAddress?: string, useAgent?: string): Promise<{
		accessToken: string,
		refreshToken: string
	}> {
		const decoded = await this.tokenService.verifyRefreshToken(refreshToken);
		
		const user = await this.userRepo.findById(decoded.id);
		if (!user) {
			throw new Error("User not found or inactive");
		}
		
		const roles = await this.userRepo.getUserRoles(user.id);
		const permissions = await this.userRepo.getUserPermissions(user.id);
		
		await this.tokenService.revokeRefreshToken(refreshToken);
		
		const token = await this.tokenService.generateTokenPair({
			id: user.id,
			email: user.email,
			username: user.username,
			roles: roles.map((r) => r.name),
			permissions: permissions.map((p) => p.name)
		}, ipAddress, useAgent);
		
		return token;
	}
	
	async logout(userId: number, refreshToken: string, ipAddress?: string): Promise<void> {
		
		await this.tokenService.revokeRefreshToken(refreshToken);
		await this.auditService.log({
			userId: userId,
			action: 'logout',
			resource_type: 'user',
			resource_id: userId,
			ip_address: ipAddress,
			performedBy: userId
		});
	}
	
	async logoutAll(userId: number, ipAddress?: string): Promise<void> {
		await this.tokenService.revokeAllUserTokens(userId);
		
		await this.auditService.log({
			userId: userId,
			action: 'logout_all_sessions',
			resource_type: 'user',
			resource_id: userId,
			ip_address: ipAddress,
			performedBy: userId
		});
	}
	
	async changePassword(
		userId: number,
		oldPassword: string,
		newPassword: string,
		ipAddress?: string,
	): Promise<void> {
		const user = await this.userRepo.findById(userId);
		if (!user) {
			throw new Error("User not found or inactive");
		}
		
		const isValidPassword = await this.passwordService.verifyPassword(
			oldPassword,
			user.password,
		);
		if (!isValidPassword) {
			throw new Error('Current password is incorrect');
		}
		
		this.passwordService.validatePassword(newPassword);
		
		const isSamePassword = await this.passwordService.verifyPassword(newPassword, user.password);
		if (isSamePassword) {
			throw new Error('New password must be different from current password');
		}
		
		const hashedPassword = await this.passwordService.hashPassword(newPassword);
		
		await this.userRepo.updatePassword(userId, hashedPassword);
		
		await this.tokenService.revokeAllUserTokens(userId);
		
		await this.auditService.log({
			userId: userId,
			action: 'password_changed',
			resource_type: 'user',
			resource_id: userId,
			ip_address: ipAddress,
			performedBy: userId
		})
	}
	
	async requestPasswordReset(email: string, ipAddress?: string): Promise<string> {
		const user = await this.userRepo.findByEmail(email);
		if (!user) {
			return 'if the email exists, a password reset link has been sent';
		}
		
		const resetToken = await this.tokenService.generatePasswordResetToken(user.id)
		{
			await this.emailService.sendPasswordResetEmail(user.email, resetToken);
		}
		await this.auditService.log({
			userId: user.id,
			action: 'password_reset_requested',
			resource_type: 'user',
			resource_id: user.id,
			old_value:'',
			new_value:'',
			ip_address: ipAddress
		});
		
		return resetToken;
	}
	
	async resetPassword(
		resetToken: string,
		newPassword: string,
		ipAddress?: string
	): Promise<void> {
		const decoded = await this.tokenService.verifyPasswordReset(resetToken);
		
		this.passwordService.validatePassword(newPassword);
		
		const hashedPassword = await this.passwordService.hashPassword(newPassword);
		
		await this.userRepo.updatePassword(decoded.id, hashedPassword);
		
		await this.tokenService.revokeAllUserTokens(decoded.id);
		
		await this.auditService.log({
			userId: decoded.id,
			action: 'password_reset_completed',
			resource_type: 'user',
			resource_id: decoded.id,
			old_value: '',
			new_value: '',
			ip_address: ipAddress,
			performedBy: decoded.id,
		});
	}
	
	async verifyEmail(token: string): Promise<void> {
		const decoded = await this.tokenService.verifyEmailToken(token);
		
		await this.userRepo.verifyEmail(decoded.userId);
		
		await this.auditService.log({
			userId: decoded.id,
			action: 'email_verified',
			resource_type: 'user',
			resource_id: decoded.id,
			old_value: '',
			new_value: '',
			ip_address: '',
			performedBy: decoded.id,
		});
	}
	
	
	async getCurrentUser(userId: number) {
		const user = await this.userRepo.findById(userId);
		if (!user) {
			throw new Error('User not found or inactive');
		}
		
		const roles = await this.userRepo.getUserRoles(userId);
		const permissions = await this.userRepo.getUserPermissions(userId);
		
		return {
			id: user.id,
			email: user.email,
			username: user.username,
			firstName: user.first_name,
			lastName: user.last_name,
			is_verified: user.is_verified,
			last_login: user.last_login_at,
			roles: roles.map((role) => role.name),
			permissions: permissions.map((permission) => permission.name),
		}
		
	}
	
}