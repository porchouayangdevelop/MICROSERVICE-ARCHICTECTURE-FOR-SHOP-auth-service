import {RoleRepository} from "../repositories/role.repo";
// import {RBACService} from "../services/rbac.service";
import {FastifyReply, FastifyRequest} from "fastify";
import {Role} from "../types/rbac";

export class RoleController {
	constructor(
		private roleRepo: RoleRepository,
		// private rbacService: RBACService
	) {
	}
	
	async getAllRoles(reply: FastifyReply) {
		const roles = await this.roleRepo.findAll();
		reply.send({data: roles});
	}
	
	async getRole(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
		
		const role = await this.roleRepo.findById(Number(request.params.id));
		if (!role) {
			return reply.code(404).send({error: 'Role not found'});
		}
		reply.send({data: role});
	}
	
	async getRolePermissions(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
		const permissions = await this.roleRepo.getPermissions(Number(request.params.id));
		reply.send({data: permissions});
	}
	
	async createRole(request: FastifyRequest<{ Body: Partial<Role> }>, reply: FastifyReply) {
		const role = await this.roleRepo.create(request.body);
		reply.send({data: role});
	}
	
	async updateRole(request: FastifyRequest<{ Params: { id: number }; Body: Partial<Role> }>, reply: FastifyReply) {
		const role = await this.roleRepo.update(Number(request.params.id), request.body);
		reply.send({data: role});
	}
	
	async deleteRole(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
		await this.roleRepo.delete(Number(request.params.id));
		reply.send({message: 'Deleted'});
	}
	
	async assignPermissionToRole(request: FastifyRequest<{
		Params: { id: number },
		Body: { permission_id: number }
	}>, reply: FastifyReply) {
		await this.roleRepo.assignPermission(Number(request.params.id), request.body.permission_id);
		reply.send({message: 'Permission assigned successfully'});
	}
	
	async removePermissionFromRole(request: FastifyRequest<{
		Params: { id: number, permissionId: number }
	}>, reply: FastifyReply) {
		await this.roleRepo.removePermission(Number(request.params.id), Number(request.params.permissionId));
		reply.send({message: 'Permission removed successfully'});
	}
	
}