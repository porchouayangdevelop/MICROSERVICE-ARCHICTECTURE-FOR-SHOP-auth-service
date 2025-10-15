import {pool} from "../configs/database";
import jwt from "jsonwebtoken";

export class SessionRepository {
	constructor(private jwtSecret: string) {
	}
	
	async storeRefreshToken(userId: number, token: string, ipAddress?: string, userAgent?: string): Promise<void> {
		let conn = await pool.getConnection();
		try {
			const decoded = jwt.decode(token) as any;
			const expiry = new Date(decoded.exp * 1000);
			await conn.query('INSERT INTO sessions (user_id, refresh_token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)', [
				userId,
				token,
				ipAddress,
				userAgent,
				expiry
			]);
		} catch (error: any) {
			throw error.message;
		} finally {
			await conn.release();
		}
	}
	
	async verifyRefreshToken(token: string): Promise<{ id: number }> {
		let conn = await pool.getConnection();
		try {
			const decoded = jwt.verify(token, this.jwtSecret) as { id: number };
			const [rows] = await conn.query('SELECT * FROM sessions WHERE refresh_token = ? AND expires_at > NOW()', [token]);
			
			if (!rows || rows.length === 0) {
				throw new Error('Refresh token not found or expired');
			}
			return decoded;
		} catch (e: any) {
			throw new Error('Invalid or expired refresh token');
		} finally {
			await conn.release();
		}
	}
	
	async revokeRefreshToken(token: string): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query('DELETE FROM sessions WHERE refresh_token = ?', [token]);
		} finally {
			await conn.release();
		}
	}
	
	async revokeAllUserTokens(userId: number): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query('DELETE FROM sessions WHERE user_id = ?', [userId]);
		} finally {
			await conn.release();
		}
	}
	
	async verifyPasswordReset(token: string): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query('select *from sessions WHERE token = ?', [token]);
		
		} catch (error: any) {
			throw new Error(error.message);
		} finally {
			await conn.release();
		}
		
	}
	
	async verifyEmailToken(token: string): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query('select * from sessions WHERE token = ?', [token]);
		} catch (error: any) {
			throw new Error(error.message);
		} finally {
			await conn.release();
		}
	}
	
	async cleanupExpiredToken(): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query('DELETE FROM sessions WHERE expires_at < NOW()')
		} finally {
			await conn.release();
		}
	}
	
}