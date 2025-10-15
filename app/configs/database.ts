import {AppConfig} from "./app.config";
import {createPool, Pool} from "mariadb";

export const pool: Pool = createPool({
	host: AppConfig.database.host,
	port: AppConfig.database.port,
	user: AppConfig.database.user,
	password: AppConfig.database.password,
	database: AppConfig.database.database,
	
	connectionLimit: 10,
	connectTimeout: 50000,
	queryTimeout: 50000,
	socketTimeout: 50000,
	acquireTimeout: 50000,
	charset: 'utf8mb4',
	collation: 'utf8mb4-general-ci',
	maxAllowedPacket: 10,
	trace: true,
	multipleStatements: true,
	
})