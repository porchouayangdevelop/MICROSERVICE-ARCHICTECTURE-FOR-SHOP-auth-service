import {FastifyReply, FastifyRequest} from "fastify";


export interface ValidationSchema {
	body?: Record<string, any>;
	params?: Record<string, any>;
	query?: Record<string, any>;
}

export const validate = (schema: ValidationSchema) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			if (schema.body) {
				validateObject(request.body, schema.body, 'body');
			}
			if (schema.params) {
				validateObject(request.params, schema.params, 'params');
			}
			if (schema.query) {
				validateObject(request.query, schema.query, 'query');
			}
		} catch (err: any) {
			reply.code(400).send({
				error: 'Validation Error',
				message: error.message,
			});
		}
	}
}

function validateObject(data: any, schema: Record<string, any>, context: string) {
	for (const [key, rules] of Object.entries(schema)) {
		const value = data?.[key];
		
		if (rules.required && (value === undefined || value === null || value === '')) {
			throw new Error(`${context}.${key} is required`);
		}
		
		if (value !== undefined && value !== null) {
			if (rules.type === 'string' && typeof value !== 'string') {
				throw new Error(`${context}.${key} must be a string`);
			}
			if (rules.type === 'number' && typeof value !== 'number') {
				throw new Error(`${context}.${key} must be a number`);
			}
			if (rules.type === 'boolean' && typeof value !== 'boolean') {
				throw new Error(`${context}.${key} must be a boolean`);
			}
			if (rules.type === 'email' && !isValidEmail(value)) {
				throw new Error(`${context}.${key} must be a valid email`);
			}
			
			if (rules.minLength && value.length < rules.minLength) {
				throw new Error(`${context}.${key} must be at least ${rules.minLength} characters`);
			}
			if (rules.maxLength && value.length > rules.maxLength) {
				throw new Error(`${context}.${key} must not exceed ${rules.maxLength} characters`);
			}
			if (rules.min !== undefined && value < rules.min) {
				throw new Error(`${context}.${key} must be at least ${rules.min}`);
			}
			if (rules.max !== undefined && value > rules.max) {
				throw new Error(`${context}.${key} must not exceed ${rules.max}`);
			}
			if (rules.enum && !rules.enum.includes(value)) {
				throw new Error(`${context}.${key} must be one of: ${rules.enum.join(', ')}`);
			}
		}
	}
}

function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
