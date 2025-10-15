import {UserRepository} from "../repositories/user.repo";
// import {PermissionRepository} from "../repositories/permission.repo";
import {RoleRepository} from "../repositories/role.repo";
import {RBACContext} from "../types/rbac";


export class RBACService {
	constructor(private userRepo: UserRepository,
							private roleRepo: RoleRepository,
							// private perRepo: PermissionRepository
	) {
	}
	
	// Check if user has any of the specified roles
	async hasRole(userId: number, roleName: string): Promise<boolean> {
		const roles = await this.userRepo.getUserRoles(userId);
		return roles.some((role) => role.name === roleName);
	}
	
	// Check if user has all specified roles
	async hasAnyRole(userId: number, roleNames: string[]): Promise<boolean> {
		const roles = await this.userRepo.getUserRoles(userId);
		const userRoleNames = roles.map((role) => role.name);
		return roleNames.some((name) => userRoleNames.includes(name));
	}
	
	// Check if user has a specific permission
	async hasAllRoles(userId: number, roleNames: string[]): Promise<boolean> {
		const roles = await this.userRepo.getUserRoles(userId);
		const userRoleNames = roles.map((role) => role.name);
		return roleNames.every((name) => userRoleNames.includes(name));
	}
	
	// Check if user has any of the specified permissions
	async hasPermission(userId: number, permissionName: string): Promise<boolean> {
		const permissions = await this.userRepo.getUserPermissions(userId);
		return permissions.some((perm) => perm.name === permissionName);
	}
	
	// Check if user has any of the specified permissions
	async hasAnyPermission(userId: number, permissionNames: string[]): Promise<boolean> {
		const permissions = await this.userRepo.getUserPermissions(userId);
		const userPermNames = permissions.map((p) => p.name);
		return permissionNames.some((name) => userPermNames.includes(name));
	}
	
	// Check if user has all specified permissions
	async hasAllPermissions(userId: number, permissionNames: string[]): Promise<boolean> {
		const permissions = await this.userRepo.getUserPermissions(userId);
		const userPermNames = permissions.map((permission) => permission.name);
		return permissionNames.every((name) => userPermNames.includes(name));
	}
	
	// Check if user can perform action on resource
	async canPerform(userId: number, resources: string, action: string): Promise<boolean> {
		const permissionName = `${resources}.${action}`;
		return this.hasPermission(userId, permissionName);
	}
	
	// Get user's role hierarchy level
	async getUserLevel(userId: number): Promise<number> {
		const roles = await this.userRepo.getUserRoles(userId);
		if (roles.length === 0) return 0;
		return Math.max(...roles.map((r) => r.level));
	}
	
	// Check if user can manage another user (based on role level)
	async canManageUser(manageId: number, targetUserId: number): Promise<boolean> {
		const mLevel = await this.getUserLevel(manageId);
		const targetLevel = await this.getUserLevel(targetUserId);
		return mLevel > targetLevel;
	}
	
	// Get full RBAC context for user
	async getUserContext(userId: number): Promise<RBACContext> {
		const roles = await this.userRepo.getUserRoles(userId);
		const permissions = await this.userRepo.getUserPermissions(userId);
		return {
			userId,
			roles,
			permissions
		}
	}
	
	// Assign role with validation
	async assignRoleToUser(userId: number, roleId: number, assignedBy: number, expiresAt: Date | null = null): Promise<void> {
		const canAssign = await this.hasPermission(assignedBy, 'roles.assign');
		if (!canAssign) {
			throw new Error(`Insufficient permission to assign role for ${assignedBy}`);
		}
		
		const assignerLevel = await this.getUserLevel(assignedBy);
		const role = await this.roleRepo.findById(roleId);
		if (!role || role.level >= assignerLevel) {
			throw new Error(`${role} Cannot assign role with equal or higher level`);
		}
		
		await this.userRepo.assignRole(userId, roleId, assignedBy, expiresAt);
	}
	
	
	// Remove role with validation
	async removeRoleFromUser(userId: number, roleId: number, removedBy: number): Promise<void> {
		const canAssign = await this.hasPermission(removedBy, 'roles.assign');
		if (!canAssign) {
			throw new Error(`Insufficient permissions to remove roles for ${removedBy}`);
		}
		
		const removerLevel = await this.getUserLevel(removedBy);
		const role = await this.roleRepo.findById(roleId);
		if (!role || role.level >= removerLevel) {
			throw new Error(`${role} Cannot assign role with equal or higher level`);
		}
		
		await this.userRepo.removeRole(userId, roleId);
	}
	
	
	// Grant permission with validation
	async grantPermissionToUser(
		userId: number,
		permissionId: number,
		grantedBy: number,
		expiresAt: Date | null = null
	): Promise<void> {
		const canGrant = await this.hasPermission(grantedBy, 'permissions.grant');
		if (!canGrant) {
			throw new Error('Insufficient permissions to grant permissions');
		}
		
		await this.userRepo.grantPermission(userId, permissionId, grantedBy, expiresAt);
	}
	
	// Revoke permission with validation
	async revokePermissionFromUser(
		userId: number,
		permissionId: number,
		revokedBy: number
	): Promise<void> {
		const canGrant = await this.hasPermission(revokedBy, 'permissions.grant');
		if (!canGrant) {
			throw new Error('Insufficient permissions to revoke  permissions');
		}
		
		await this.userRepo.revokePermission(userId, permissionId)
	}
	
}