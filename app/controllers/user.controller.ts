import {UserRepository} from "../repositories/user.repo";
import {RBACService} from "../services/rbac.service";
import {FastifyReply, FastifyRequest} from "fastify";
import {AuthRequest} from "../middlewares/auth.middleware";


export class UserController {
	constructor(
		private userRepo: UserRepository,
		private rbacService: RBACService
	) {
	}
	
	async getUserRoles(request: AuthRequest & FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
		const userId = Number(request.params.id);
		
		if (request.user!.id !== userId) {
			const canRead = await this.rbacService.hasPermission(request.user!.id, 'users.read');
			if (!canRead) {
				return reply.code(403).send({error: 'Forbidden'});
			}
			
			const roles = await this.userRepo.getUserRoles(userId);
			reply.send({data: roles});
		}
	}
	
	async getUserPermissions(request: AuthRequest & FastifyRequest<{ Params: { id: number } }>,
													 reply: FastifyReply) {
		const userId = Number(request.params.id);
		if (request.user!.id !== userId) {
			const canRead = await this.rbacService.hasPermission(request.user!.id, 'users.read');
			if (!canRead) {
				return reply.code(403).send({error: 'Forbidden'});
			}
		}
		
		const pers = await this.userRepo.getUserPermissions(userId);
		reply.send({data: pers});
	}
	
	async assignRole(request: AuthRequest & FastifyRequest<{
										 Params: { id: number };
										 Body: { role_id: number; expires_at?: string };
									 }>,
									 reply: FastifyReply) {
		const userId = Number(request.params.id);
		const expiresAt = request.body.expires_at ? new Date(request.body.expires_at) : null;
		
		await this.rbacService.assignRoleToUser(
			userId,
			request.body.role_id,
			request.user!.id,
			expiresAt
		);
		
		reply.send({message: 'Role assigned successfully'})
	}
	
	
	async removeRole(request: AuthRequest & FastifyRequest<{
		Params: { id: number, roleId: number }
	}>, reply: FastifyReply) {
		await this.rbacService.removeRoleFromUser(Number(request.params.id), Number(request.params.roleId), request.user!.id);
		reply.send({message: 'Role removed  successfully'})
	}
	
	
	async grantPermission(request: AuthRequest & FastifyRequest<{
		Params: { id: number };
		Body: { permission_id: number, expires_at?: string }
	}>, reply: FastifyReply) {
		const userId = Number(request.params.id);
		const expiresAt = request.body.expires_at ? new Date(request.body.expires_at) : null;
		
		await this.rbacService.grantPermissionToUser(userId, request.body.permission_id, request.user!.id, expiresAt);
		reply.send({message: 'Permission granted successfully'})
	}
	
	async revokePermission(request: AuthRequest & FastifyRequest<{
		Params: { id: number, permissionId: number }
	}>, reply: FastifyReply) {
		await this.rbacService.revokePermissionFromUser(Number(request.params.id), Number(request.params.permissionId), request.user!.id);
		reply.send({message: 'Permission revoked successfully'})
	}
	
	async getUserContext(request: AuthRequest, reply: FastifyReply) {
		const context = await this.rbacService.getUserContext(request.user!.id);
		reply.send({data: context});
	}
	
}