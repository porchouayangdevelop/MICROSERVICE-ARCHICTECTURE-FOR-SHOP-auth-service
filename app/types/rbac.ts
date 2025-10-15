export interface Role {
	id: number;
	name: string;
	display_name: string;
	description: string;
	level: number;
	is_system: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface Permission {
	id: number;
	name: string;
	display_name: string;
	description: string;
	resource: string;
	action: string;
	is_system: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface User {
	id: number;
	email: string;
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	is_active: boolean;
	is_verified: boolean;
	last_verified: Date;
	last_login_at: Date | null;
	created_at: Date | null;
	updated_at: Date | null;
	roles?: Role[];
	permissions?: Permission[];
}

export interface UserRole {
	id: number;
	user_id: number;
	role_id: number;
	assigned_by: number;
	assigned_at: Date;
	expires_date: Date;
}

export interface UserPermission {
	id: number;
	user_id: number;
	permission_id: number;
	granted_by: number;
	granted_at: Date;
	expires_date: Date;
}

export interface RBACContext {
	userId: number;
	roles: Role[];
	permissions: Permission[];
}

export interface Clients {
	id: number;
	client_id: number;
	client_name: string;
	client_type: string;
	client_user_id: number;
	client_user_name: string;
	client_secret: string;
	created_at: Date;
	updated_at: Date;
}