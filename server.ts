import {AuthServiceWithRBAC} from './app/app';
import Fastify, {FastifyInstance} from "fastify";
import {AppConfig} from "./app/configs/app.config";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";


class Server {
	private app: FastifyInstance =  Fastify({
		logger: {
			transport: {
				target: "@fastify/one-line-logger",
			},
		},
	}).withTypeProvider<TypeBoxTypeProvider>();
	private appService: AuthServiceWithRBAC = new AuthServiceWithRBAC();
	
	
	async start(port: number) {
		try {
			await this.app.listen({port: port, host: '0.0.0.0'});
			await this.appService.initialize();
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	}
	
}

const startServer = new Server();
startServer.start(AppConfig.server.port).then().catch(console.error);
