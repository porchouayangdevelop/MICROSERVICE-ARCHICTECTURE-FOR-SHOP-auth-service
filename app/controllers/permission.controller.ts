import {PermissionRepository} from "../repositories/permission.repo";
import {FastifyReply, FastifyRequest} from "fastify";
import type {Permission} from "../types/rbac";

export class PermissionController {
	constructor(
		private perRepo: PermissionRepository
	) {
	}
	
	// @ts-ignore
	async getAllPermissions(request: FastifyRequest, reply: FastifyReply) {
		const pers = await this.perRepo.findAll();
		reply.send({data: pers});
	}
	
	async getPermission(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
		const per = await this.perRepo.findById(Number(request.params.id));
		if (!per) {
			return reply.code(404).send({error: 'Permission not found'});
		}
		reply.send({data: per});
	}
	
	async getPermissionsByResource(request: FastifyRequest<{ Params: { resource: string } }>, reply: FastifyReply) {
		const pers = await this.perRepo.findByResource(request.params.resource);
		reply.send({data: pers});
	}
	
	async createPermission(request: FastifyRequest<{ Body: Partial<Permission> }>, reply: FastifyReply) {
		const per = await this.perRepo.create(request.body);
		reply.status(201).send({data: per});
	}
	
	async updatePermission(request: FastifyRequest<{
		Params: { id: number };
		Body: Partial<Permission>
	}>, reply: FastifyReply) {
		const per = await this.perRepo.update(request.params.id, request.body);
		reply.send({data: per});
	}
	
	async deletePermission(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
		await this.perRepo.delete(request.params.id);
		reply.code(204).send({message: 'deleted'})
	}
	
	
}