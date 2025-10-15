import {ServerConfig} from "../types";

import {config} from 'dotenv';

config({
	path: process.env.NODE_ENV === 'production' ? '.env.prd' : '.env',
})

const AppConfig: ServerConfig = {
	server: {
		host: process.env.host as string,
		port: Number(process.env.PORT),
		version: 1,
		name: 'auth'
	},
	database: {
		host: process.env.DB_HOST as string,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USER as string,
		password: process.env.DB_PASSWORD as string,
		database: process.env.DB_NAME as string,
	},
	rabbitMQ: {
		host: process.env.RABBITMQ_HOST as string,
		port: Number(process.env.RABBITMQ_PORT),
		user: process.env.RABBITMQ_USER as string,
		password: process.env.RABBITMQ_PASSWORD as string,
	},
	
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
	JWT_SECRET_EXPIRATION: Number(process.env.JWT_SECRET_EXPIRATION),
	JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY as string,
	JWT_REFRESH_EXPIRATION: Number(process.env.JWT_REFRESH_EXPIRATION),
	
	EMAIL_FROM: process.env.EMAIL_FROM as string,
	SMTP_HOST: process.env.SMTP_HOST as string,
	SMTP_PORT: Number(process.env.SMTP_PORT),
	SMTP_SECURE: process.env.SMTP_SECURE || 'true' as string,
	SMTP_USER: process.env.SMTP_USER as string,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD
}


export {AppConfig}