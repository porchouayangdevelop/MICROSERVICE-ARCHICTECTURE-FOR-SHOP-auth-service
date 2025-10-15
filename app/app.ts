import Fastify from 'fastify';
import {TypeBoxTypeProvider} from '@fastify/type-provider-typebox';
import {UserRepository} from "./repositories/user.repo";
import {RoleRepository} from "./repositories/role.repo";
import {PermissionRepository} from "./repositories/permission.repo";
import {RBACService} from "./services/rbac.service";
import {RoleController} from "./controllers/role.controller";
import {UserController} from "./controllers/user.controller";
import {PermissionController} from "./controllers/permission.controller";
import {RBACMiddleware} from "./middlewares/rbac.middleware";
import {roleRoutes} from "./routes/role.routes";
import {permissionRoutes} from "./routes/permission.routes";
import {userRoutes} from "./routes/user.routes";

export class AuthServiceWithRBAC {
	private app = Fastify({
		logger: {
			transport: {
				target: "@fastify/one-line-logger",
			},
		},
	}).withTypeProvider<TypeBoxTypeProvider>();
	
	// @ts-ignore
	private userRepo: UserRepository;
	// @ts-ignore
	private roleRepo: RoleRepository;
	// @ts-ignore
	private perRepo: PermissionRepository;
	// @ts-ignore
	private rbacService: RBACService;
	// @ts-ignore
	private roleController: RoleController;
	// @ts-ignore
	private permissionController: PermissionController;
	// @ts-ignore
	private userController: UserController;
	// @ts-ignore
	private rbacMiddleware: RBACMiddleware;
	
	
	async initialize() {
		this.rbacService = new RBACService(this.userRepo, this.roleRepo);
		
		
		this.roleController = new RoleController(this.roleRepo);
		this.permissionController = new PermissionController(this.perRepo);
		this.userController = new UserController(this.userRepo, this.rbacService);
		
		this.rbacMiddleware = new RBACMiddleware(this.rbacService);
		
		await this.registerRoutes();
	}
	
	
	private async registerRoutes() {
		await roleRoutes(this.app, this.roleController, this.rbacMiddleware);
		await permissionRoutes(this.app, this.permissionController, this.rbacMiddleware);
		await userRoutes(this.app, this.userController, this.rbacMiddleware);
	}
	
};