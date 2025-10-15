import {FastifyReply, FastifyRequest} from "fastify";
import jwt from 'jsonwebtoken';
import {AppConfig} from "../configs/app.config";

export interface AuthRequest extends FastifyRequest {
	user?: {
		id: number;
		email: string;
		username: string;
	}
}

export const authenticate = async (request: AuthRequest, reply: FastifyReply) => {
	try {
		const authHeader = request.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return reply.status(401).send({error: "No token provided"});
		}
		
		const token = authHeader.split(' ')[1];
		const decoded = jwt.verify(token, AppConfig.JWT_SECRET_KEY!) as any;
		request.user = {
			id: decoded.id,
			email: decoded.email,
			username: decoded.username,
		};
	} catch (error: any) {
		return reply.status(401).send({error: "Invalid token"});
	}
}