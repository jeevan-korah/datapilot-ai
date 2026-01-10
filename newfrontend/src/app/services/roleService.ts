import { Role, Employee } from '../types';

export const roleService = {
  // Get roles for a company (could be stored in localStorage)
  getRoles: (companyName: string): Role[] => {
    const savedRoles = localStorage.getItem(`roles_${companyName}`);
    if (savedRoles) {
      return JSON.parse(savedRoles);
    }
    // Default roles
    return [
      {
        id: '1',
        name: 'Developer',
        permissions: {
          users: true,
          customers: true,
          orders: true,
          products: true,
          invoices: false,
          payments: false,
          reports: true,
          analytics: true,
          employees: false,
          departments: false,
        },
      },
      {
        id: '2',
        name: 'Designer',
        permissions: {
          users: true,
          customers: true,
          orders: false,
          products: true,
          invoices: false,
          payments: false,
          reports: true,
          analytics: false,
          employees: false,
          departments: false,
        },
      },
      {
        id: '3',
        name: 'Manager',
        permissions: {
          users: true,
          customers: true,
          orders: true,
          products: true,
          invoices: true,
          payments: true,
          reports: true,
          analytics: true,
          employees: true,
          departments: true,
        },
      },
    ];
  },

  // Save roles for a company
  saveRoles: (companyName: string, roles: Role[]): void => {
    localStorage.setItem(`roles_${companyName}`, JSON.stringify(roles));
  },

  // Add a new role
  addRole: (companyName: string, name: string, permissions: Record<string, boolean>): Role => {
    const roles = roleService.getRoles(companyName);
    const newRole: Role = {
      id: Date.now().toString(),
      name,
      permissions,
    };
    roles.push(newRole);
    roleService.saveRoles(companyName, roles);
    return newRole;
  },

  // Delete a role
  deleteRole: (companyName: string, id: string, employees: Employee[]): boolean => {
    const roles = roleService.getRoles(companyName);
    const roleToDelete = roles.find(r => r.id === id);
    
    // Check if any employee has this role
    if (roleToDelete && employees.some(emp => emp.role === roleToDelete.name)) {
      return false; // Cannot delete
    }
    
    const filtered = roles.filter(role => role.id !== id);
    roleService.saveRoles(companyName, filtered);
    return true;
  },

  // Initialize role permissions based on database tables
  initializeRolePermissions: (tables: string[]): Record<string, boolean> => {
    return tables.reduce((acc, table) => {
      acc[table] = false;
      return acc;
    }, {} as Record<string, boolean>);
  },
};
