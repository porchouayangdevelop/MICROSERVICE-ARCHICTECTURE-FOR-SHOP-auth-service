import {FastifyInstance} from "fastify";
import {AuthController} from "../controllers/auth.controller";
import {
	AuthResponseSchema,
	changePasswordSchema,
	loginSchema,
	logoutSchema,
	refreshTokenSchema,
	registerSchema,
	requestPasswordResetSchema,
	resetPasswordSchema,
	verifyEmailSchema
} from '../schemas/auth.schema'

export async function authRoutes(
	app: FastifyInstance,
	authController: AuthController
) {
	app.post('/auth/register', {
		schema: {
			tags: ['Auth'],
			summary: 'Register a new account',
			body: registerSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	},  authController.register.bind(authController));
	
	app.post('/auth/login', {
		schema: {
			tags: ['Auth'],
			summary: 'Login account access',
			body: loginSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.login.bind(authController));
	
	app.post('/auth/logout', {
		schema: {
			tags: ['Auth'],
			summary: 'Logout account',
			body: logoutSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.logout.bind(authController));
	
	app.post('/auth/refreshToken', {
		schema: {
			tags: ['Auth'],
			summary: 'refresh token',
			body: refreshTokenSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.refreshToken.bind(authController));
	
	app.post('/auth/logoutAll', {
		schema: {
			tags: ['Auth'],
			summary: 'Logout all',
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.logoutAll.bind(authController));
	
	app.post('/auth/changePassword', {
		schema: {
			tags: ['Auth'],
			summary: 'Change password',
			body: changePasswordSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.changePassword.bind(authController));
	
	app.post('/auth/requestPasswordReset', {
		schema: {
			tags: ['Auth'],
			summary: 'requestPasswordReset account',
			body: requestPasswordResetSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.requestPasswordReset.bind(authController));
	
	app.post('/auth/resetPassword', {
		schema: {
			tags: ['Auth'],
			summary: 'resetPassword account',
			body: resetPasswordSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.resetPassword.bind(authController));
	
	app.post('/auth/verifyEmail', {
		schema: {
			tags: ['Auth'],
			summary: 'verifyEmail account',
			body: verifyEmailSchema,
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.verifyEmail.bind(authController));
	
	app.post('/auth/getCurrentUser', {
		schema: {
			tags: ['Auth'],
			summary: 'getCurrentUser account',
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.getCurrentUser.bind(authController));
	
	
	app.post('/auth/getProfile', {
		schema: {
			tags: ['Auth'],
			summary: 'getProfile account',
			response: {
				201: AuthResponseSchema,
				400: AuthResponseSchema,
				500: AuthResponseSchema,
			}
		}
	}, () => authController.getProfile.bind(authController));
	
}