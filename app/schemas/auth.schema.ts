import {Static, Type} from '@sinclair/typebox';

export const authSchema = Type.Object({
	tags: Type.Any(),
	summary: Type.String(),
	body: Type.Any(),
	response: Type.Any(),
})


export const registerSchema = Type.Object({
	email: Type.String({format: "email"}),
	username: Type.String(),
	password: Type.String(),
	firstName: Type.String(),
	lastName: Type.String(),
})

export const loginSchema = Type.Object({
	email: Type.String({format: "email"}),
	password: Type.String(),
});

export const refreshTokenSchema = Type.Object({
	refreshToken: Type.String(),
});

export const logoutSchema = Type.Object({
	refreshToken: Type.String(),
});

export const changePasswordSchema = Type.Object({
	oldPassword: Type.String(),
	newPassword: Type.String(),
});

export const requestPasswordResetSchema = Type.Object({
	email: Type.String({format: "email"}),
});

export const resetPasswordSchema = Type.Object({
	token: Type.String(),
	newPassword: Type.String(),
});

export const verifyEmailSchema = Type.Object({
	token: Type.String(),
});

export const AuthResponseSchema = Type.Object({
	success: Type.Boolean(),
	message: Type.String(),
	data: Type.Any(),
	timestamp: Type.Any()
});

export type registerBody = Static<typeof registerSchema>;
export type loginBody = Static<typeof loginSchema>;
export type refreshBody = Static<typeof refreshTokenSchema>;
export type logoutBody = Static<typeof logoutSchema>;
export type changePasswordBody = Static<typeof changePasswordSchema>;
export type changePasswordResetBody = Static<typeof changePasswordSchema>;
export type requestPasswordResetBody = Static<typeof requestPasswordResetSchema>;
export type resetPasswordBody = Static<typeof resetPasswordSchema>;
export type verifyEmailBody = Static<typeof verifyEmailSchema>;
export type AuthResponse = Static<typeof AuthResponseSchema>;
