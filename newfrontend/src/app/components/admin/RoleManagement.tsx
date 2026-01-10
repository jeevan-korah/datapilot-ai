import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, Trash2, ShieldCheck, Database } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Role } from '../../types';

interface RoleManagementProps {
  roles: Role[];
  databaseTables: string[];
  onAddRole: (name: string, permissions: Record<string, boolean>) => void;
  onDeleteRole: (id: string) => void;
}

export function RoleManagement({
  roles,
  databaseTables,
  onAddRole,
  onDeleteRole,
}: RoleManagementProps) {
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    permissions: {} as Record<string, boolean>,
  });

  // Initialize permissions when dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (open && databaseTables.length > 0) {
      const initialPermissions = databaseTables.reduce((acc, table) => {
        acc[table] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setNewRole({ name: '', permissions: initialPermissions });
    }
    setIsAddRoleDialogOpen(open);
  };

  const handleAddRole = () => {
    if (newRole.name) {
      onAddRole(newRole.name, newRole.permissions);
      setNewRole({
        name: '',
        permissions: {},
      });
      setIsAddRoleDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Roles & Table Access</CardTitle>
            <CardDescription className="text-xs">Define which database tables each role can access</CardDescription>
          </div>
          <Dialog open={isAddRoleDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={databaseTables.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>Define role name and table access permissions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input
                    id="role-name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="e.g., Developer, Manager"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Database Table Access</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                    {databaseTables.map((table) => (
                      <div key={table} className="flex items-center space-x-2">
                        <Checkbox
                          id={`table-${table}`}
                          checked={newRole.permissions[table] || false}
                          onCheckedChange={(checked) =>
                            setNewRole({
                              ...newRole,
                              permissions: { ...newRole.permissions, [table]: checked as boolean },
                            })
                          }
                        />
                        <label htmlFor={`table-${table}`} className="text-sm cursor-pointer font-mono">
                          {table}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddRole} className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Role
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {databaseTables.length === 0 ? (
          <div className="text-center text-gray-400 py-8 border rounded-lg bg-gray-50">
            <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Connect to a database first to manage table access</p>
          </div>
        ) : (
          <div className="space-y-3">
            {roles.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No roles created yet</div>
            ) : (
              roles.map((role) => (
                <div key={role.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                        <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                      <h3 className="text-sm font-medium">{role.name}</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteRole(role.id)}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(role.permissions).map(
                      ([table, hasAccess]) =>
                        hasAccess && (
                          <Badge key={table} variant="secondary" className="text-xs font-mono">
                            {table}
                          </Badge>
                        )
                    )}
                    {Object.values(role.permissions).every((v) => !v) && (
                      <span className="text-xs text-gray-400">No table access</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
