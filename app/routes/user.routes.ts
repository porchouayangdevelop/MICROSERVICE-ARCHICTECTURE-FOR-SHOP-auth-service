import {FastifyInstance} from "fastify";
import {UserController} from "../controllers/user.controller";
import {RBACMiddleware} from "../middlewares/rbac.middleware";
import {authenticate} from "../middlewares/auth.middleware";


export async function userRoutes(
	app: FastifyInstance,
	userController: UserController,
	rbacMiddleware: RBACMiddleware
) {
	
	app.get('/users', {
		preHandler: [authenticate]
	}, () => userController.getUserRoles.bind(userController))
	
	
	app.get('/users/:id/permissions', {
		preHandler: [authenticate]
	}, () => userController.getUserPermissions.bind(userController));
	
	app.post('/users/:id/roles', {
		preHandler: [
			authenticate,
			rbacMiddleware.requirePermissions(['roles.assign'])]
	}, () => userController.assignRole.bind(userController));
	
	app.delete('/users/:id/roles/:roleId', {
		preHandler: [
			authenticate,
			rbacMiddleware.requirePermissions(['roles.assign'])]
	}, () => userController.removeRole.bind(userController));
	
	app.post('/users/:id/permissions', {
		preHandler: [
			authenticate,
			rbacMiddleware.requirePermissions(['permissions.grant'])]
	}, () => userController.grantPermission.bind(userController));
	
	
	app.delete('/users/:id/permissions/:permissionId', {
		preHandler: [
			authenticate,
			rbacMiddleware.requirePermissions(['permissions.grant'])
		]
	}, () => userController.revokePermission.bind(userController));
	
	
	app.get('/me/context', {
		preHandler: [authenticate]
	}, () => userController.getUserContext.bind(userController));
	
}