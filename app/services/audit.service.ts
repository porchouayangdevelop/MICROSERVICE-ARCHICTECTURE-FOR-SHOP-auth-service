import {pool} from "../configs/database";

export interface AuditLogEntry {
	userId: number ;
	action: any;
	resource_type: any;
	resource_id: any;
	old_value?: any;
	new_value?: any;
	ip_address?: string;
	performedBy?: any;
}

export class AuditService {
	async log(entry: AuditLogEntry): Promise<void> {
		let conn = await pool.getConnection();
		try {
			await conn.query(`INSERT INTO rbac_audit_log
                        (user_id, action, resource_type, resource_id, old_value, new_value, ip_address, performed_by)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
				entry.userId,
				entry.action,
				entry.resource_type,
				entry.resource_id,
				entry.old_value,
				entry.new_value,
				entry.ip_address,
				entry.performedBy,
			])
		} catch (e: any) {
			throw e.message;
		} finally {
			if (conn) await conn.release();
		}
	}
	
	async getAuditLogs(filters: {
		userId?: string;
		action?: string;
		resourceType?: string;
		startDate?: Date;
		endDate?: Date;
		limit?: number;
	}): Promise<any[]> {
		let conn = await pool.getConnection();
		try {
			let sql = 'select * from rbac_audit_log where 1 = 1';
			const params: any[] = [];
			
			if (filters.userId) {
				sql += 'and user_id = ?';
				params.push(filters.userId);
			}
			if (filters.action) {
				sql += 'and action = ?';
				params.push(filters.action);
			}
			if (filters.resourceType) {
				sql += 'and resource_type = ?';
				params.push(filters.resourceType);
			}
			
			if (filters.startDate) {
				sql += 'and created_at >= ?';
				params.push(filters.startDate);
			}
			
			if (filters.endDate) {
				sql += 'and created_at <= ?';
				params.push(filters.endDate);
			}
			sql += 'ORDER BY created_at DESC LIMIT ?';
			params.push(filters.limit || 100);
			return await conn.query(sql, params)
		} catch (err: any) {
			throw err;
		} finally {
			await conn.release();
		}
		
	}
	
}