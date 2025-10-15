import {pool} from "../configs/database";
import type {Permission, Role} from "../types/rbac";

export class RoleRepository {
	
	async findAll(): Promise<Role[]> {
		const con = await pool.getConnection();
		try {
			return await con.query(`select *
                              from roles
                              order by level DESC`);
		} finally {
			if (con) await con.release();
		}
	}
	
	async findById(id: number): Promise<Role | null> {
		const con = await pool.getConnection();
		try {
			const [rows] = await con.query(`select *
                                      from roles
                                      where id = ?`, [id]);
			return rows[0] || null;
		} finally {
			if (con) await con.release();
		}
	}
	
	async findByName(name: string): Promise<Role | null> {
		const con = await pool.getConnection();
		try {
			const [rows] = await con.query(`select *
                                      from roles
                                      where name = ?`, [name]);
			return rows[0] || null;
		} finally {
			if (con) await con.release();
		}
	}
	
	async create(role: Partial<Role>): Promise<Role | null> {
		const con = await pool.getConnection();
		try {
			const result = await con.query(`insert into roles(name, display_name, description, level)
                                      values (?, ?, ?,
                                              ?)`, [role.name, role.display_name, role.description, role.level || 0]);
			return this.findById(result.insertId);
		} finally {
			if (con) await con.release();
		}
	}
	
	async update(id: number, role: Partial<Role>): Promise<Role | null> {
		const con = await pool.getConnection();
		try {
			await con.query(`update roles
                       set display_name = ?,
                           description  = ?,
                           level        = ?
                       where id = ?`, [role.display_name, role.display_name, role.level, id]);
			return this.findById(id);
		} finally {
			if (con) await con.release();
		}
	}
	
	async delete(id: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query(`delete
                       from roles
                       where id = ?
                         and is_system = FALSE`, [id]);
		} finally {
			if (con) await con.release();
		}
	}
	
	async getPermissions(roleId: number): Promise<Permission[]> {
		const con = await pool.getConnection();
		try {
			return await con.query(`select p.*
                              from permission p
                                       join role_permissions rp on p.id = rp.permission_id
                              where rp.role_id = ?`, [roleId]);
		} finally {
			if (con) await con.release();
		}
	}
	
	async assignPermission(roleId: number, permissionId: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query(`insert into role_permission (role_id, permission_id)
                       values (?, ?)`, [roleId, permissionId]);
		} finally {
			if (con) await con.release();
		}
	}
	
	async removePermission(roleId: number, permissionId: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query('delete from role_permissions where role_id = ? and permission_id = ?', [roleId, permissionId]);
		} finally {
			if (con) await con.release();
		}
	}
}