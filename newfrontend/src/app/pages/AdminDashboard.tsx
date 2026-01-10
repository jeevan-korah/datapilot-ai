import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Header } from '../components/shared/Header';
import { DatabaseConnection } from '../components/admin/DatabaseConnection';
import { StatsCards } from '../components/admin/StatsCards';
import { EmployeeManagement } from '../components/admin/EmployeeManagement';
import { RoleManagement } from '../components/admin/RoleManagement';
import { employeeService } from '../services/employeeService';
import { roleService } from '../services/roleService';
import { User, Employee, Role } from '../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [databaseTables, setDatabaseTables] = useState<string[]>([]);

  // Load employees and roles on mount
  useEffect(() => {
    const loadedEmployees = employeeService.getEmployees(user.companyName);
    const loadedRoles = roleService.getRoles(user.companyName);
    setEmployees(loadedEmployees);
    setRoles(loadedRoles);
  }, [user.companyName]);

  // Employee handlers
  const handleAddEmployee = (name: string, email: string, role: string) => {
    const newEmployee = employeeService.addEmployee(user.companyName, name, email, role);
    setEmployees([...employees, newEmployee]);
  };

  const handleDeleteEmployee = (id: string) => {
    employeeService.deleteEmployee(user.companyName, id);
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    employeeService.toggleEmployeeStatus(user.companyName, id);
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? { ...emp, status: emp.status === 'active' ? 'inactive' : ('active' as const) }
          : emp
      )
    );
  };

  const handleUpdateRole = (id: string, newRole: string) => {
    employeeService.updateEmployeeRole(user.companyName, id, newRole);
    setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, role: newRole } : emp)));
  };

  // Role handlers
  const handleAddRole = (name: string, permissions: Record<string, boolean>) => {
    const newRole = roleService.addRole(user.companyName, name, permissions);
    setRoles([...roles, newRole]);
  };

  const handleDeleteRole = (id: string) => {
    const success = roleService.deleteRole(user.companyName, id, employees);
    if (success) {
      setRoles(roles.filter((role) => role.id !== id));
    } else {
      alert('Cannot delete role that is assigned to employees');
    }
  };

  // Database handlers
  const handleTablesLoaded = (tables: string[]) => {
    setDatabaseTables(tables);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Admin Dashboard" userName={user.name} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Database Connection - Priority Section */}
          <DatabaseConnection onTablesLoaded={handleTablesLoaded} />

          {/* Stats */}
          <StatsCards employees={employees} />

          {/* Role & Employee Management Tabs */}
          <Tabs defaultValue="employees" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="employees">Employee Management</TabsTrigger>
              <TabsTrigger value="roles">Role Management</TabsTrigger>
            </TabsList>

            <TabsContent value="employees">
              <EmployeeManagement
                employees={employees}
                roles={roles}
                onAddEmployee={handleAddEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                onToggleStatus={handleToggleStatus}
                onUpdateRole={handleUpdateRole}
              />
            </TabsContent>

            <TabsContent value="roles">
              <RoleManagement
                roles={roles}
                databaseTables={databaseTables}
                onAddRole={handleAddRole}
                onDeleteRole={handleDeleteRole}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
