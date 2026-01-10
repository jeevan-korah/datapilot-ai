import { Employee } from '../types';

export const employeeService = {
  // Get employees for a company
  getEmployees: (companyName: string): Employee[] => {
    const savedEmployees = localStorage.getItem(`employees_${companyName}`);
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  },

  // Save employees for a company
  saveEmployees: (companyName: string, employees: Employee[]): void => {
    localStorage.setItem(`employees_${companyName}`, JSON.stringify(employees));
  },

  // Add a new employee
  addEmployee: (
    companyName: string,
    name: string,
    email: string,
    role: string
  ): Employee => {
    const employees = employeeService.getEmployees(companyName);
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name,
      email,
      role,
      status: 'active',
    };
    employees.push(newEmployee);
    employeeService.saveEmployees(companyName, employees);
    return newEmployee;
  },

  // Delete an employee
  deleteEmployee: (companyName: string, id: string): void => {
    const employees = employeeService.getEmployees(companyName);
    const filtered = employees.filter(emp => emp.id !== id);
    employeeService.saveEmployees(companyName, filtered);
  },

  // Toggle employee status
  toggleEmployeeStatus: (companyName: string, id: string): void => {
    const employees = employeeService.getEmployees(companyName);
    const updated = employees.map(emp =>
      emp.id === id
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : emp
    );
    employeeService.saveEmployees(companyName, updated);
  },

  // Update employee role
  updateEmployeeRole: (companyName: string, id: string, newRole: string): void => {
    const employees = employeeService.getEmployees(companyName);
    const updated = employees.map(emp =>
      emp.id === id ? { ...emp, role: newRole } : emp
    );
    employeeService.saveEmployees(companyName, updated);
  },

  // Check if user is an active employee
  isActiveEmployee: (companyName: string, email: string): boolean => {
    const employees = employeeService.getEmployees(companyName);
    return employees.some(emp => emp.email === email && emp.status === 'active');
  },
};
