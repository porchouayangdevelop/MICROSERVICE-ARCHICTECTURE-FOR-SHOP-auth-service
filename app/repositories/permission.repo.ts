import {pool} from "../configs/database";
import type {Permission} from "../types/rbac";

export class PermissionRepository {
	async findAll(): Promise<Permission[]> {
		const con = await pool.getConnection();
		try {
			return await con.query(`select *
                              from permissions
                              order by resource, action`);
		} finally {
			if (con) await con.release();
		}
	}
	
	async findById(id: number): Promise<Permission | null> {
		const con = await pool.getConnection();
		try {
			const [rows] = await con.query(`select *
                                      from permissions
                                      where id = ?`, [id]);
			return rows[0] || null;
		} finally {
			if (con) await con.release();
		}
	}
	
	async findByName(name: string): Promise<Permission | null> {
		const con = await pool.getConnection();
		try {
			const [rows] = await con.query(`select *
                                      from permissions
                                      where name = ?`, [name]);
			return rows[0] || null;
		} finally {
			if (con) await con.release();
		}
	}
	
	async findByResource(resource: string): Promise<Permission[]> {
		const con = await pool.getConnection();
		try {
			return await con.query(`select *
                              from permissions
                              where resource = ?`, [resource]);
		} finally {
			if (con) await con.release();
		}
	}
	
	async create(permission: Partial<Permission>): Promise<Permission | null> {
		const con = await pool.getConnection();
		try {
			const result = await con.query('insert into permissions (name,display_name,description,resource,action) values (?,?,?,?,?)',
				[permission.name,
					permission.display_name,
					permission.description,
					permission.resource,
					permission.action
				])
			return this.findById(result.insertId);
		} finally {
			if (con) await con.release();
		}
	}
	
	async update(id: number, permission: Partial<Permission>): Promise<Permission | null> {
		const con = await pool.getConnection();
		try {
			await con.query('update permissions set display_name = ?, description = ? where id = ?', [permission.display_name, permission.description, id]);
			return this.findById(id);
		} finally {
			if (con) await con.release();
		}
	}
	
	async delete(id: number): Promise<void> {
		const con = await pool.getConnection();
		try {
			await con.query('delete from permissions where id = ? and is_system =FALSE', [id]);
		} finally {
			if (con) await con.release();
		}
	}
}