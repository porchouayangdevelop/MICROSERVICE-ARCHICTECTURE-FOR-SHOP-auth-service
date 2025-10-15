/**
 * migrations/001_create_rbac_tables.sql
 *
 * -- Users table
 * CREATE TABLE users (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   email VARCHAR(255) UNIQUE NOT NULL,
 *   username VARCHAR(100) UNIQUE NOT NULL,
 *   password VARCHAR(255) NOT NULL,
 *   first_name VARCHAR(100),
 *   last_name VARCHAR(100),
 *   is_active BOOLEAN DEFAULT TRUE,
 *   is_verified BOOLEAN DEFAULT FALSE,
 *   last_login_at TIMESTAMP NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   INDEX idx_email (email),
 *   INDEX idx_username (username),
 *   INDEX idx_active (is_active)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- Roles table
 * CREATE TABLE roles (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   name VARCHAR(100) UNIQUE NOT NULL,
 *   display_name VARCHAR(255) NOT NULL,
 *   description TEXT,
 *   level INT DEFAULT 0,
 *   is_system BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   INDEX idx_name (name),
 *   INDEX idx_level (level)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- Permissions table
 * CREATE TABLE permissions (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   name VARCHAR(100) UNIQUE NOT NULL,
 *   display_name VARCHAR(255) NOT NULL,
 *   description TEXT,
 *   resource VARCHAR(100) NOT NULL,
 *   action VARCHAR(50) NOT NULL,
 *   is_system BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   INDEX idx_name (name),
 *   INDEX idx_resource_action (resource, action)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- User-Role relationship (Many-to-Many)
 * CREATE TABLE user_roles (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   role_id INT NOT NULL,
 *   assigned_by INT,
 *   assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   expires_at TIMESTAMP NULL,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 *   FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
 *   FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
 *   UNIQUE KEY unique_user_role (user_id, role_id),
 *   INDEX idx_user (user_id),
 *   INDEX idx_role (role_id),
 *   INDEX idx_expires (expires_at)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- Role-Permission relationship (Many-to-Many)
 * CREATE TABLE role_permissions (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   role_id INT NOT NULL,
 *   permission_id INT NOT NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
 *   FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
 *   UNIQUE KEY unique_role_permission (role_id, permission_id),
 *   INDEX idx_role (role_id),
 *   INDEX idx_permission (permission_id)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- User-Permission relationship (Direct permissions, Many-to-Many)
 * CREATE TABLE user_permissions (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   permission_id INT NOT NULL,
 *   granted_by INT,
 *   granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   expires_at TIMESTAMP NULL,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 *   FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
 *   FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
 *   UNIQUE KEY unique_user_permission (user_id, permission_id),
 *   INDEX idx_user (user_id),
 *   INDEX idx_permission (permission_id),
 *   INDEX idx_expires (expires_at)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- Sessions table
 * CREATE TABLE sessions (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT NOT NULL,
 *   refresh_token VARCHAR(512) UNIQUE NOT NULL,
 *   ip_address VARCHAR(45),
 *   user_agent TEXT,
 *   expires_at TIMESTAMP NOT NULL,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 *   INDEX idx_user (user_id),
 *   INDEX idx_token (refresh_token),
 *   INDEX idx_expires (expires_at)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 *
 * -- Audit log for RBAC changes
 * CREATE TABLE rbac_audit_log (
 *   id INT PRIMARY KEY AUTO_INCREMENT,
 *   user_id INT,
 *   action VARCHAR(50) NOT NULL,
 *   resource_type VARCHAR(50) NOT NULL,
 *   resource_id INT,
 *   old_value TEXT,
 *   new_value TEXT,
 *   ip_address VARCHAR(45),
 *   performed_by INT,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
 *   FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
 *   INDEX idx_user (user_id),
 *   INDEX idx_action (action),
 *   INDEX idx_resource (resource_type, resource_id),
 *   INDEX idx_created (created_at)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 */

// ============================================================================
// DEFAULT ROLES & PERMISSIONS SEED
// ============================================================================