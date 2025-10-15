import jwt from 'jsonwebtoken'
import {SessionRepository} from "../repositories/session.repo";

export interface TokenPayload {
	id: number;
	email: string;
	username: string;
	roles?: string[];
	permissions?: string[];
}

export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export class TokenService {
	constructor(
		private jwtSecret: string,
		private accessTokenExpiry: string,
		private refreshTokenExpiry: string,
		private sessionRepo: SessionRepository
	) {
	}
	
	generateAccessToken(payload: TokenPayload): string {
		// @ts-ignore
		return jwt.sign(payload, this.jwtSecret, {
			expiresIn: this.accessTokenExpiry,
			issuer: 'auth-service',
			algorithm: 'HS512'
		})
	}
	
	generateRefreshToken(payload: { id: number }): string {
		// @ts-ignore
		return jwt.sign(payload, this.jwtSecret, {
			expiresIn: this.refreshTokenExpiry,
			issuer: 'auth-service',
			algorithm: 'HS512'
		})
	}
	
	async generateTokenPair(payload: TokenPayload, ipAddress?: string, userAgent?: any): Promise<TokenPair> {
		const accessToken = this.generateAccessToken(payload);
		const refreshToken = this.generateRefreshToken(payload);
		
		await this.storeRefreshToken(payload.id, refreshToken, ipAddress, userAgent);
		return {
			accessToken, refreshToken
		}
	}
	
	async generatePasswordResetToken(id: number): Promise<string> {
		try {
		
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
	
	async storeRefreshToken(user_id: number, token: string, ipAddress: string | undefined, userAgent: string | undefined): Promise<void> {
		try {
			await this.sessionRepo.storeRefreshToken(user_id, token, ipAddress, userAgent);
		} catch (error: any) {
			throw new Error('storeRefreshToken', error.message);
		}
	}
	
	async verifyAccessToken(token: string): Promise<TokenPayload> {
		try {
			return jwt.verify(token, this.jwtSecret) as TokenPayload;
		} catch (error: any) {
			throw new Error('verifyAccessToken', error.message);
		}
	}
	
	async verifyRefreshToken(token: string): Promise<{ id: number }> {
		try {
			return await this.sessionRepo.verifyRefreshToken(token);
		} catch (e: any) {
			throw new Error('verifyRefreshToken token');
		}
	}
	
	async revokeRefreshToken(token: string): Promise<void> {
		try {
			await this.sessionRepo.revokeRefreshToken(token);
		} catch (error: any) {
			throw new Error('revokeRefreshToken token', error.message);
		}
	}
	
	async revokeAllUserTokens(userId: number): Promise<void> {
		try {
			await this.sessionRepo.revokeAllUserTokens(userId);
		} catch (error: any) {
			throw new Error('revokeAllUserTokens token', error.message);
		}
	}
	
	async verifyPasswordReset(token: string): Promise<void> {
		try {
			await this.sessionRepo.verifyPasswordReset(token);
			
		} catch (error: any) {
			throw new Error('verifyPasswordReset', error.message);
		}
	}
	
	async verifyEmailToken(token: string): Promise<void> {
		try {
			await this.sessionRepo.verifyEmailToken(token);
		} catch (error: any) {
			throw new Error('verifyEmailToken', error.message);
		}
	}
	
	async cleanupExpiredToken(): Promise<void> {
		try {
			await this.sessionRepo.cleanupExpiredToken();
		} catch (error: any) {
			throw new Error('Cleanup expired token', error.message);
		}
	}
}