import {pool} from "../configs/database";
import type {Permission, Role, User} from "../types/rbac";

export class UserRepository {
	
	async findByUsername(username: string): Promise<User | null> {
		let con = await pool.getConnection();
		try {
			const [rows] = await con.query('select *from users where username = ?', [username]);
			return rows || null;
		} catch (error: any) {
			throw error.message;
		} finally {
			await con.release();
		}
	}
	
	async findByEmail(email: string): Promise<User | null> {
		const con = await pool.getConnection();
		try {
			const [rows] = await con.query('select *from users where email = ?', [email]);
			return rows || null;
		} catch (error: any) {
			throw error;
		} finally {
			if (con) await con.release();
		}
	}
	
	async findById(id: number): Promise<User | null> {
		const con = await pool.getConnection();
		try {
			const [rows] = await con.query('select * from users where id= ?', [id]);
			return rows[0] || null;
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async verifyEmail(email: string): Promise<User | null> {
		let conn = await pool.getConnection();
		try {
			const [rows] = await conn.query('select * from users where email = ?', [email]);
			return rows[0] || null;
		} catch (error: any) {
			throw error.message;
		} finally {
			await conn.release();
		}
	}
	
	async create(user: Partial<User>): Promise<User | null> {
		const con = await pool.getConnection();
		try {
			const result = await con.query('insert into users (email,username,password,first_name,last_name) values (?,?,?,?,?)',
				[
					user.email,
					user.username,
					user.password,
					user.first_name,
					user.last_name,
				]);
			return this.findById(result.insertId);
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async update(id: number, user: Partial<User>): Promise<User | null> {
		const con = await pool.getConnection();
		try {
			await con.query('update users set first_name =?,last_name = ?, updateed_at = NOW() where id = ?', [user.first_name, user.last_name, id]);
			return this.findById(id);
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async updateLastLogin(id: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query('update users set last_login_at = NOW() where id = ?', [id]);
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async getUserRoles(userId: number | undefined): Promise<Role[]> {
		const con = await pool.getConnection();
		try {
			return await con.query(`SELECT r.*
                              FROM roles r
                                       JOIN user_roles ur ON r.id = ur.role_id
                              WHERE ur.user_id = ?
                                AND (ur.expires_at IS NULL OR ur.expires_at > NOW())`, [userId]);
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async getUserPermissions(userId: number | undefined): Promise<Permission[]> {
		const con = await pool.getConnection();
		try {
			return await con.query(`SELECT DISTINCT p.*
                              FROM permissions p
                              WHERE p.id IN (
                                  -- Permissions from roles
                                  SELECT rp.permission_id
                                  FROM role_permissions rp
                                           JOIN user_roles ur ON rp.role_id = ur.role_id
                                  WHERE ur.user_id = ?
                                    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())

                                  UNION

                                  -- Direct user permissions
                                  SELECT up.permission_id
                                  FROM user_permissions up
                                  WHERE up.user_id = ?
                                    AND (up.expires_at IS NULL OR up.expires_at > NOW()))`, [userId, userId]);
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async assignRole(userId: number | undefined, roleId: number, assignedBy: number | undefined, expiresAt: Date | null = null): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query('INSERT INTO user_roles (user_id, role_id, assigned_by, expires_at) VALUES (?, ?, ?, ?)', [userId, roleId, assignedBy, expiresAt])
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	async removeRole(userId: number, roleId: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [
				userId,
				roleId,
			]);
		} catch (error: any) {
			throw error.message;
		} finally {
			if (con) await con.release();
		}
	}
	
	// Grant direct permission to user
	async grantPermission(
		userId: number,
		permissionId: number,
		grantedBy: number,
		expiresAt: Date | null = null
	): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query(
				'INSERT INTO user_permissions (user_id, permission_id, granted_by, expires_at) VALUES (?, ?, ?, ?)',
				[userId, permissionId, grantedBy, expiresAt]
			);
		} catch (error: any) {
			throw error.message;
		} finally {
			await con.release();
		}
	}
	
	// Revoke direct permission from user
	async revokePermission(userId: number, permissionId: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query(
				'DELETE FROM user_permissions WHERE user_id = ? AND permission_id = ?',
				[userId, permissionId]
			);
		} catch (error: any) {
			throw error.message;
		} finally {
			await con.release();
		}
	}
	
	async updatePassword(id: number, hashedPassword: string): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query('Update users set password =? where id = ?', [hashedPassword, id]);
		} catch (err: any) {
			console.error(err);
			throw err.message;
		} finally {
			await conn.release();
		}
		
	}
}