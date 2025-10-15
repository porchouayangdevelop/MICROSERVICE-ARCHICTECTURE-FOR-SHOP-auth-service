seeds/default_roles_permissions.sql
 *
 * -- Insert default roles
 * INSERT INTO roles (name, display_name, description, level, is_system) VALUES
 * ('super_admin', 'Super Administrator', 'Full system access', 100, TRUE),
 * ('admin', 'Administrator', 'Administrative access', 90, TRUE),
 * ('manager', 'Manager', 'Management access', 70, TRUE),
 * ('staff', 'Staff Member', 'Staff level access', 50, TRUE),
 * ('user', 'Regular User', 'Basic user access', 10, TRUE),
 * ('guest', 'Guest', 'Limited guest access', 1, TRUE);
 *
* -- Insert default permissions
 * INSERT INTO permissions (name, display_name, description, resource, action, is_system) VALUES
 * -- User management
 * ('users.create', 'Create Users', 'Can create new users', 'users', 'create', TRUE),
 * ('users.read', 'Read Users', 'Can view user details', 'users', 'read', TRUE),
 * ('users.update', 'Update Users', 'Can update user information', 'users', 'update', TRUE),
 * ('users.delete', 'Delete Users', 'Can delete users', 'users', 'delete', TRUE),
 * ('users.list', 'List Users', 'Can list all users', 'users', 'list', TRUE),
 *
 * -- Role management
 * ('roles.create', 'Create Roles', 'Can create new roles', 'roles', 'create', TRUE),
 * ('roles.read', 'Read Roles', 'Can view role details', 'roles', 'read', TRUE),
 * ('roles.update', 'Update Roles', 'Can update roles', 'roles', 'update', TRUE),
 * ('roles.delete', 'Delete Roles', 'Can delete roles', 'roles', 'delete', TRUE),
 * ('roles.assign', 'Assign Roles', 'Can assign roles to users', 'roles', 'assign', TRUE),
 *
 * -- Permission management
 * ('permissions.create', 'Create Permissions', 'Can create permissions', 'permissions', 'create', TRUE),
 * ('permissions.read', 'Read Permissions', 'Can view permissions', 'permissions', 'read', TRUE),
 * ('permissions.update', 'Update Permissions', 'Can update permissions', 'permissions', 'update', TRUE),
 * ('permissions.delete', 'Delete Permissions', 'Can delete permissions', 'permissions', 'delete', TRUE),
 * ('permissions.grant', 'Grant Permissions', 'Can grant permissions', 'permissions', 'grant', TRUE),
 *
 * -- Product management
 * ('products.create', 'Create Products', 'Can create products', 'products', 'create', TRUE),
 * ('products.read', 'Read Products', 'Can view products', 'products', 'read', TRUE),
 * ('products.update', 'Update Products', 'Can update products', 'products', 'update', TRUE),
 * ('products.delete', 'Delete Products', 'Can delete products', 'products', 'delete', TRUE),
 *
 * -- Order management
 * ('orders.create', 'Create Orders', 'Can create orders', 'orders', 'create', TRUE),
 * ('orders.read', 'Read Orders', 'Can view orders', 'orders', 'read', TRUE),
 * ('orders.update', 'Update Orders', 'Can update orders', 'orders', 'update', TRUE),
 * ('orders.cancel', 'Cancel Orders', 'Can cancel orders', 'orders', 'cancel', TRUE),
 * ('orders.manage', 'Manage All Orders', 'Can manage all orders', 'orders', 'manage', TRUE),
 *
 * -- Booking management
 * ('bookings.create', 'Create Bookings', 'Can create bookings', 'bookings', 'create', TRUE),
 * ('bookings.read', 'Read Bookings', 'Can view bookings', 'bookings', 'read', TRUE),
 * ('bookings.update', 'Update Bookings', 'Can update bookings', 'bookings', 'update', TRUE),
 * ('bookings.cancel', 'Cancel Bookings', 'Can cancel bookings', 'bookings', 'cancel', TRUE),
 *
 * -- Report access
 * ('reports.sales', 'Sales Reports', 'Can view sales reports', 'reports', 'read', TRUE),
 * ('reports.inventory', 'Inventory Reports', 'Can view inventory reports', 'reports', 'read', TRUE),
 * ('reports.analytics', 'Analytics Reports', 'Can view analytics', 'reports', 'read', TRUE);
 *
* -- Assign permissions to Super Admin (all permissions)
 * INSERT INTO role_permissions (role_id, permission_id)
 * SELECT 1, id FROM permissions;
*
* -- Assign permissions to Admin
 * INSERT INTO role_permissions (role_id, permission_id)
 * SELECT 2, id FROM permissions WHERE name NOT LIKE 'permissions.%';
*
* -- Assign permissions to Manager
 * INSERT INTO role_permissions (role_id, permission_id)
 * SELECT 3, id FROM permissions WHERE
    *   name IN ('users.read', 'users.list', 'products.create', 'products.read',
 *            'products.update', 'orders.read', 'orders.manage', 'bookings.read',
 *            'bookings.update', 'reports.sales', 'reports.inventory');
*
* -- Assign permissions to Staff
 * INSERT INTO role_permissions (role_id, permission_id)
 * SELECT 4, id FROM permissions WHERE
    *   name IN ('products.read', 'orders.read', 'orders.update',
 *            'bookings.read', 'bookings.update');
*
* -- Assign permissions to User
 * INSERT INTO role_permissions (role_id, permission_id)
 * SELECT 5, id FROM permissions WHERE
    *   name IN ('products.read', 'orders.create', 'orders.read',
 *            'bookings.create', 'bookings.read', 'bookings.cancel');
*
* -- Assign permissions to Guest
 * INSERT INTO role_permissions (role_id, permission_id)
 * SELECT 6, id FROM permissions WHERE name = 'products.read';
*/

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
