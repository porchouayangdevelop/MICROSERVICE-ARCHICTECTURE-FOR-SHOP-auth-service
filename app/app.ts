import Fastify, {FastifyInstance} from 'fastify';
// import cors from '@fastify/cors';
// import fastifyRateLimit from "@fastify/rate-limit";
// import fastifyHelmet from "@fastify/helmet";
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
import {AppConfig} from "./configs/app.config";
import {SessionRepository} from "./repositories/session.repo";
import {AuditService} from "./services/audit.service";
import {AuthService} from "./services/auth.service";
import {TokenService} from "./services/token.service";
import {PasswordService} from "./services/password.service";
import {EmailService} from "./services/email.service";
import {AuthController} from "./controllers/auth.controller";
import {createTransport} from "nodemailer";
import {authRoutes} from "./routes/auth.routes";

export class AuthServiceWithRBAC {
	private readonly app: FastifyInstance = Fastify({
		logger:
			{
				transport: {
					target: "@fastify/one-line-logger",
					// target: 'pino-pretty',
					// options: {
					// 	colorize: true
					// }
				},
			},
	}).withTypeProvider<TypeBoxTypeProvider>();
	
	
	// register repository
	
	private userRepo!: UserRepository;
	private roleRepo!: RoleRepository;
	private perRepo!: PermissionRepository;
	private sessionRepo!: SessionRepository;
	
	
	// register service
	private rbacService!: RBACService;
	private authService!: AuthService;
	private tokenService!: TokenService;
	private passwordService!: PasswordService;
	private audiService!: AuditService;
	private emailService!: EmailService;
	
	
	// register controller
	private roleController!: RoleController;
	private permissionController!: PermissionController;
	private userController!: UserController;
	private authController!: AuthController;
	
	// register middleware
	private rbacMiddleware!: RBACMiddleware;
	
	async initialize() {
		// initial repo
		this.userRepo = new UserRepository();
		this.roleRepo = new RoleRepository();
		this.perRepo = new PermissionRepository();
		this.sessionRepo = new SessionRepository(AppConfig.JWT_SECRET_KEY!);
		
		// initial service
		this.passwordService = new PasswordService();
		this.audiService = new AuditService();
		
		const mailTransport = createTransport({
			host: AppConfig.SMTP_HOST!,
			port: AppConfig.SMTP_PORT,
			secure: AppConfig.SMTP_SECURE,
			auth: {
				user: AppConfig.SMTP_USER,
				pass: AppConfig.SMTP_PASSWORD
			}
		})
		
		this.emailService = new EmailService(mailTransport);
		this.tokenService = new TokenService(AppConfig.JWT_SECRET_KEY!,
			`${AppConfig.JWT_SECRET_EXPIRATION}`,
			`${AppConfig.JWT_REFRESH_EXPIRATION}`,
			this.sessionRepo);
		this.rbacService = new RBACService(this.userRepo, this.roleRepo);
		this.authService = new AuthService(
			this.userRepo,
			this.roleRepo,
			this.tokenService,
			this.passwordService,
			this.audiService,
			this.emailService
		);
		
		// initial controller
		this.roleController = new RoleController(this.roleRepo);
		this.permissionController = new PermissionController(this.perRepo);
		this.userController = new UserController(this.userRepo, this.rbacService);
		this.authController = new AuthController(this.authService);
		
		
		// initial middleware
		this.rbacMiddleware = new RBACMiddleware(this.rbacService);
		
		await this.registerRoutes();
	}
	
	
	private async registerRoutes() {
		await authRoutes(this.app, this.authController);
		await roleRoutes(this.app, this.roleController, this.rbacMiddleware);
		await permissionRoutes(this.app, this.permissionController, this.rbacMiddleware);
		await userRoutes(this.app, this.userController, this.rbacMiddleware);
	}
	
	
	async start(port: number) {
		try {
			await this.initialize();
			await this.app.listen({port: port, host: '0.0.0.0'});
			
			console.log(`🚀 Server is running on http://${AppConfig.server.host}:${port}`);
			console.log(`📝 API Version: v${AppConfig.server.version}`);
			console.log(`🔐 Auth Service: ${AppConfig.server.name}`);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
	
	async stop() {
		try {
			await this.app.close();
		} catch (e) {
			this.app.log.error(e);
			process.exit(1);
			
		}
	}
	
};