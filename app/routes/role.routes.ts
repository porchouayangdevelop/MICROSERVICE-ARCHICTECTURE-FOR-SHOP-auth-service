import {FastifyInstance} from "fastify";
import {RoleController} from "../controllers/role.controller";
import {RBACMiddleware} from "../middlewares/rbac.middleware";
import {authenticate} from "../middlewares/auth.middleware";

export async function roleRoutes(
	app: FastifyInstance,
	roleController: RoleController,
	rbacMiddleware: RBACMiddleware
) {
	// @ts-ignore
	app.get(`/roles`, {
		preHandler: [
			authenticate,
			rbacMiddleware.requirePermissions(['roles.read'])
		]
	}, async () => roleController.getAllRoles.bind(roleController));
	
	
	app.get('/roles/:id', {
		preHandler: [
			authenticate,
			rbacMiddleware.requirePermissions(['roles.read'])
		]
	}, async () => {
		return roleController.getRole.bind(roleController);
	});
	
	// app.get('/roles/:permissions', {
	// 	preHandler: [authenticate, rbacMiddleware.requirePermissions(['roles.read'])]
	// }, () => roleController.getRolePermissions.bind(roleController));
	
	
	app.post('/roles', {
		preHandler: [authenticate, rbacMiddleware.requirePermissions(['roles.create'])]
	}, async () => roleController.createRole.bind(roleController));
	
	
	app.put('/roles/:id', {
		preHandler: [authenticate, rbacMiddleware.requirePermissions(['roles.update'])]
	}, async () => roleController.updateRole.bind(roleController));
	
	app.delete('/roles/:id', {
		preHandler: [authenticate, rbacMiddleware.requirePermissions(['roles.delete'])]
	}, async () => roleController.deleteRole.bind(roleController));
	
	
	app.post('/roles/:id/permissions', {
		preHandler: [authenticate, rbacMiddleware.requirePermissions(['roles.update'])]
	}, () => roleController.assignPermissionToRole.bind(roleController));
	
	app.delete('/roles/:id/permissions/:permissionId', {
		preHandler: [authenticate, rbacMiddleware.requirePermissions(['roles.update'])]
	}, async () => roleController.removePermissionFromRole.bind(roleController));
}