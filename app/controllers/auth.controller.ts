import {FastifyReply, FastifyRequest} from "fastify";
import {AuthService} from "../services/auth.service";
import {ApiResponse} from '../utils/response'
import {AuthRequest} from "../middlewares/auth.middleware";

export interface AutRequest extends FastifyRequest {
	user?: {
		id: number;
		email: string;
		username: string;
	}
}

export class AuthController {
	
	constructor(private authService: AuthService) {
	
	}
	
	async register(request: FastifyRequest<{
		Body: {
			email: string;
			username: string;
			password: string;
			firstName: string;
			lastName: string;
		}
	}>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			const result = await this.authService.register(request.body, ipAddress);
			
			reply.status(201).send(ApiResponse.success(result, 'User Registered successfully'));
		} catch (err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
				.send(ApiResponse.error(err.message, 400))
		}
	}
	
	async login(request: FastifyRequest<{
		Body: {
			email: string;
			password: string;
		}
	}>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			const userAgent = request.headers['user-agent'];
			const result = await this.authService.login(request.body, ipAddress, userAgent);
			reply.status(200).send(ApiResponse.success(result, 'User Login Successfully'));
		} catch (error: any) {
			console.log(ApiResponse.error(error.message, 400))
			reply.status(400)
				.send(ApiResponse.error(error.message, 400))
		}
	}
	
	async refreshToken(request: FastifyRequest<{
		Body: {
			refreshToken: string;
		}
	}>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			const userAgent = request.headers['user-agent'];
			const result = await this.authService.refreshToken(
				request.body.refreshToken, ipAddress, userAgent
			);
			console.log(ApiResponse.success(result, 'login successfully'));
			
			reply.status(200).send(ApiResponse.success(result, 'Refresh Token Successfully'));
		} catch (err: any) {
			console.log(ApiResponse.error(err.message, 400))
			reply.status(400)
				.send(ApiResponse.error(err.message, 400))
		}
	}
	
	async logout(request: AuthRequest & FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			await this.authService.logout(
				request.user!.id,
				request.body.refreshToken,
				ipAddress
			)
			reply.send(ApiResponse.success(null, 'Logout successfully'));
		} catch (error: any) {
			console.log(ApiResponse.error(error.message, 500));
			reply.status(400)
				.send(ApiResponse.error(error.message, 400));
		}
	}
	
	async logoutAll(request: AuthRequest & FastifyRequest<{}>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			await this.authService.logoutAll(request.user!.id, ipAddress);
			reply.send(ApiResponse.success(null, 'Logged out from all sessions'));
		} catch (err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
				.send(ApiResponse.error(err.message, 400));
		}
	}
	
	async changePassword(request: AuthRequest & FastifyRequest<{
		Body: {
			oldPassword: string;
			newPassword: string;
		}
	}>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			await this.authService.changePassword(
				request.user!.id,
				request.body.oldPassword,
				request.body.newPassword,
				ipAddress,
			);
			reply.status(200).send(ApiResponse.success(null, 'Password changed successfully'));
		} catch (error: any) {
			console.log(ApiResponse.error(error.message, 500));
			reply.status(400)
				.send(ApiResponse.error(error.message, 400));
		}
	}
	
	async requestPasswordReset(request: FastifyRequest<{
		Body: {
			email: string;
		}
	}>, reply: FastifyReply) {
		try {
			const ipAddress = request.ip;
			const result = await this.authService.requestPasswordReset(
				request.body.email,
				ipAddress
			);
			
			reply.status(200).send(ApiResponse.success({resetToken: result}, 'Password reset instructions sent'));
		} catch (err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
				.send(ApiResponse.error(err.message, 400));
		}
	}
	
	async resetPassword(request: FastifyRequest<{
		Body:{token:string,newPassword:string}
	}>, reply: FastifyReply) {
		try{
			const ipAddress = request.ip;
			await this.authService.resetPassword(request.body.token,request.body.newPassword,ipAddress);
			
			reply.send(ApiResponse.success(null, 'Password reset successfully'));
		}catch(err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
			.send(ApiResponse.error(err.message, 400));
		}
	}
	
	async verifyEmail(request: FastifyRequest<{Querystring:{
		token:string,
		}}>, reply: FastifyReply) {
		try{
			await this.authService.verifyEmail(request.query.token);
			reply.status(200).send(ApiResponse.success(null, 'Verify email verification'));
		}catch(err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
			.send(ApiResponse.error(err.message, 400));
		}
	}
	
	async getCurrentUser(request:AuthRequest & FastifyRequest<{}>, reply: FastifyReply) {
		try {
			const user = await this.authService.getCurrentUser(request.user!.id);
			reply.status(200).send(ApiResponse.success(user));
		}catch(err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
			.send(ApiResponse.error(err.message, 400));
		}
	}
	async getProfile(request:AuthRequest & FastifyRequest<{}>, reply: FastifyReply) {
		try{
			const user = await this.authService.getCurrentUser(request.user!.id);
			reply.status(200).send(ApiResponse.success(user));
		}catch(err: any) {
			console.log(ApiResponse.error(err, 500));
			reply.status(400)
			.send(ApiResponse.error(err.message, 400));
		}
	}
}