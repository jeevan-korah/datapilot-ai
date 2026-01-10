import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Database, Save, Edit, RefreshCw } from 'lucide-react';
import { databaseService } from '../../services/databaseService';

interface DatabaseConnectionProps {
  onTablesLoaded: (tables: string[]) => void;
}

export function DatabaseConnection({ onTablesLoaded }: DatabaseConnectionProps) {
  const [dbConnectionString, setDbConnectionString] = useState('');
  const [savedConnectionString, setSavedConnectionString] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isEditingConnection, setIsEditingConnection] = useState(false);

  useEffect(() => {
    const saved = databaseService.getConnectionString();
    if (saved) {
      setSavedConnectionString(saved);
      setIsDbConnected(true);
      fetchTables(saved);
    }
  }, []);

  const fetchTables = async (connectionString: string) => {
    const tables = await databaseService.fetchDatabaseTables(connectionString);
    onTablesLoaded(tables);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    const testString = isEditingConnection ? dbConnectionString : savedConnectionString;
    const success = await databaseService.testConnection(testString);
    setIsTesting(false);
    if (success) {
      setIsDbConnected(true);
      await fetchTables(testString);
      alert('Database connection successful!');
    }
  };

  const handleSaveConnection = async () => {
    if (dbConnectionString) {
      databaseService.saveConnectionString(dbConnectionString);
      setSavedConnectionString(dbConnectionString);
      setIsEditingConnection(false);
      setIsDbConnected(true);
      await fetchTables(dbConnectionString);
      alert('Database connection string saved!');
    }
  };

  const handleUpdateConnection = () => {
    setIsEditingConnection(true);
    setDbConnectionString(savedConnectionString);
  };

  const handleCancelEdit = () => {
    setIsEditingConnection(false);
    setDbConnectionString('');
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Database className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base">Database Connection</CardTitle>
            <CardDescription className="text-xs">Configure your database connection string</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!savedConnectionString || isEditingConnection ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="db-connection">Connection String</Label>
              <Input
                id="db-connection"
                type="password"
                value={dbConnectionString}
                onChange={(e) => setDbConnectionString(e.target.value)}
                placeholder="e.g., postgresql://user:password@host:port/database"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Enter your database connection string (PostgreSQL, MySQL, MongoDB, etc.)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleTestConnection}
                disabled={!dbConnectionString || isTesting}
                variant="outline"
                className="flex-1"
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button
                onClick={handleSaveConnection}
                disabled={!dbConnectionString}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Connection
              </Button>
              {isEditingConnection && (
                <Button onClick={handleCancelEdit} variant="ghost">
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Connection Status</Label>
              <div className="flex items-center gap-2 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Database connected successfully</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <span className="font-mono">••••••••••••••••••••••••••••</span>
                <span className="text-xs text-gray-400">(Connection string saved)</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleTestConnection}
                disabled={isTesting}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
              <Button
                onClick={handleUpdateConnection}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Connection String
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
