import {FastifyInstance} from "fastify";
import {PermissionController} from "../controllers/permission.controller";
import {RBACMiddleware} from "../middlewares/rbac.middleware";
import {authenticate} from "../middlewares/auth.middleware";

export async function permissionRoutes(
	app:FastifyInstance,
	perController:PermissionController,
	rbacMiddleware:RBACMiddleware){
	
	app.get('/permissions',{
		preHandler:[authenticate, rbacMiddleware.requirePermissions(['permissions.read'])]
	},()=>perController.getAllPermissions.bind(perController));
	
	app.get('/permissions/:id',{
		preHandler:[authenticate, rbacMiddleware.requirePermissions(['permissions.read'])]
	},()=>perController.getPermission.bind(perController));
	
	app.get('/permissions/resource/;resource',{
		preHandler:[authenticate, rbacMiddleware.requirePermissions(['permissions.read'])]
	},()=>perController.getPermissionsByResource.bind(perController));
	
	app.post('/permissions',{
		preHandler:[authenticate, rbacMiddleware.requirePermissions(['permissions.create'])]
	},()=>perController.createPermission.bind(perController));
	
	app.put('/permissions/:id',{
		preHandler:[authenticate, rbacMiddleware.requirePermissions(['permissions.update'])]
	},()=>perController.updatePermission.bind(perController));
	
	app.delete('/permissions/:id',{
		preHandler:[authenticate, rbacMiddleware.requirePermissions(['permissions.delete'])]
	},()=>perController.deletePermission.bind(perController));
}