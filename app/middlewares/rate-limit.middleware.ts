import rateLimit from '@fastify/rate-limit';
import {FastifyInstance} from "fastify";


export async function registerRateLimit(app: FastifyInstance) {
	
	await app.register(rateLimit, {
		max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
		timeWindow: process.env.RATE_LIMIT_WINDOW || '15 minutes',
		cache: 10000,
		allowList: ['127.0.0.1'],
		redis: process.env.REDIS_URL, // Optional: use Redis for distributed rate limiting
		keyGenerator: (request) => {
			return request.headers['x-forwarded-for'] || request.ip;
		},
		errorResponseBuilder: (request, context) => {
			return {
				statusCode: 429,
				error: 'Too Many Requests',
				message: `Rate limit exceeded, retry in ${context.after}`,
			};
		},
	});
}