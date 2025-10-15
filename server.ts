import {AuthServiceWithRBAC} from './app/app';
import {AppConfig} from "./app/configs/app.config";


const server = new AuthServiceWithRBAC();

server.start(AppConfig.server.port).then().then(async () => {

}).catch(err => {
	console.error(err);
	process.exit(1);
})


const gracefulShutdown = async (signal:string) => {
	console.log(`\n${signal} received, shutting down gracefully...`);
	await server.stop();
	process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});