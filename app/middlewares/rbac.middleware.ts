import {RBACService} from "../services/rbac.service";
import {AuthRequest} from "./auth.middleware";
import {FastifyReply} from "fastify";

export class RBACMiddleware {
	constructor(private rbacService: RBACService) {
	}
	
	// Require specific roles
	requiredRoles(roles: string[]) {
		return async (request: AuthRequest, reply: FastifyReply) => {
			if (!request.user) {
				return reply.status(401).send({error: 'Authentication required'});
			}
			
			const hasRole = await this.rbacService.hasAnyRole(request.user.id, roles);
			if (!hasRole) {
				return reply.status(403).send({
					error: 'Forbidden',
					message: `Requires one of roles: ${roles.join(', ')}`
				});
			}
		}
	}
	
	// Require all specified roles
	requiredAllRoles(roles: string[]) {
		return async (request: AuthRequest, reply: FastifyReply) => {
			if (!request.user) {
				return reply.code(401).send({error: 'Authentication required'});
			}
			
			const hasAllRole = await this.rbacService.hasAllRoles(request.user.id, roles);
			if (!hasAllRole) {
				return reply.code(403).send({
					error: 'Forbidden',
					message: `Requires all roles: ${roles.join(', ')}`,
				});
			}
		}
	}
	
	// Require specific permissions
	requirePermissions(permissions: string[]) {
		return async (request: AuthRequest, reply: FastifyReply) => {
			if (!request.user) {
				return reply.code(401).send({error: 'Authentication required'});
			}
			
			const hasPermission = await this.rbacService.hasAnyPermission(request.user.id, permissions);
			if (!hasPermission) {
				return reply.code(403).send({
					error: 'Forbidden',
					message: `Requires one of permissions: ${permissions.join(', ')}`,
				});
			}
		}
	}
	
	// Require all specified permissions
	requireAllPermissions(permissions: string[]) {
		return async (request: AuthRequest, reply: FastifyReply) => {
			if (!request.user) {
				return reply.code(401).send({error: 'Authentication required'});
			}
			
			const hasAllPermission = await this.rbacService.hasAllPermissions(request.user.id, permissions);
			if (!hasAllPermission) {
				return reply.code(403).send({
					error: 'Forbidden',
					message: `Requires all permissions: ${permissions.join(', ')}`,
				});
			}
		}
	}
	
	
	// Require resource action permission
	requireResourceAction(resource: string, action: string) {
		return async (request: AuthRequest, reply: FastifyReply) => {
			if (!request.user) {
				return reply.code(401).send({error: 'Authentication required'});
			}
			
			const canPerform = await this.rbacService.canPerform(request.user.id, resource, action);
			if (!canPerform) {
				return reply.code(403).send({
					error: 'Forbidden',
					message: `Requires permission: ${resource}.${action}`,
				});
			}
		}
	}
	
	// Require minimum role level
	requireLevel(minLevel: number) {
		return async (request: AuthRequest, reply: FastifyReply) => {
			if (!request.user) {
				return reply.code(401).send({error: 'Authentication required'});
			}
			
			const userLevel = await this.rbacService.getUserLevel(request.user.id);
			if (userLevel < minLevel) {
				return reply.code(403).send({
					error: 'Forbidden',
					message: `Requires minimum role level: ${minLevel}`,
				});
			}
		};
	}
}