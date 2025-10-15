export interface ServiceConfig {
	name?: string;
	version?: number;
	host: string;
	port: number;
}

export interface DatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

export interface RabbitMQConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	
	exchange?: string;
	queue?: string;
	routingKey?: string;
}

export interface ServerConfig {
	server: ServiceConfig;
	database: DatabaseConfig;
	rabbitMQ?: RabbitMQConfig;
	
	JWT_SECRET_KEY?: string;
	JWT_SECRET_EXPIRATION?: number;
	JWT_REFRESH_SECRET_KEY?: string;
	JWT_REFRESH_EXPIRATION?: number;
	
	EMAIL_FROM?: string;
	SMTP_HOST: string;
	SMTP_PORT?: number;
	SMTP_USER?: string;
	SMTP_SECURE?: string;
	SMTP_PASSWORD?: string;
	
	
}