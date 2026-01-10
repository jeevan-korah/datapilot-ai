import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Employee, Role } from '../../types';

interface EmployeeManagementProps {
  employees: Employee[];
  roles: Role[];
  onAddEmployee: (name: string, email: string, role: string) => void;
  onDeleteEmployee: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdateRole: (id: string, newRole: string) => void;
}

export function EmployeeManagement({
  employees,
  roles,
  onAddEmployee,
  onDeleteEmployee,
  onToggleStatus,
  onUpdateRole,
}: EmployeeManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '' });
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string>('');

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.role) {
      onAddEmployee(newEmployee.name, newEmployee.email, newEmployee.role);
      setNewEmployee({ name: '', email: '', role: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleStartEditRole = (id: string, currentRole: string) => {
    setEditingEmployeeId(id);
    setEditingRole(currentRole);
  };

  const handleSaveRole = (id: string) => {
    onUpdateRole(id, editingRole);
    setEditingEmployeeId(null);
    setEditingRole('');
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setEditingRole('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Employees</CardTitle>
            <CardDescription className="text-xs">Manage your team members and their roles</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Enter the details of the new employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="emp-name">Name</Label>
                  <Input
                    id="emp-name"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    placeholder="Employee name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emp-email">Email</Label>
                  <Input
                    id="emp-email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="employee@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emp-role">Role</Label>
                  <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}>
                    <SelectTrigger id="emp-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddEmployee} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Employee
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400">
                  No employees added yet
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="text-sm">{employee.name}</TableCell>
                  <TableCell className="text-sm">{employee.email}</TableCell>
                  <TableCell>
                    {editingEmployeeId === employee.id ? (
                      <div className="flex items-center gap-2">
                        <Select value={editingRole} onValueChange={setEditingRole}>
                          <SelectTrigger className="w-[140px] h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleSaveRole(employee.id)}
                          className="h-8 px-2"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-8 px-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{employee.role}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEditRole(employee.id, employee.role)}
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === 'active' ? 'default' : 'secondary'}
                      className="cursor-pointer text-xs"
                      onClick={() => onToggleStatus(employee.id)}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
