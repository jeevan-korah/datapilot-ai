import { useState, useEffect } from 'react';
import { Header } from '../components/shared/Header';
import { NaturalLanguageQuery } from '../components/user/NaturalLanguageQuery';
import { QueryOutput } from '../components/user/QueryOutput';
import { QueryHistory } from '../components/user/QueryHistory';
import { AccessDenied } from '../components/user/AccessDenied';
import { employeeService } from '../services/employeeService';
import { queryService } from '../services/queryService';
import { User, Message, QueryHistoryItem } from '../types';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  companyName: string;
}

export function UserDashboard({ user, onLogout, companyName }: UserDashboardProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentOutput, setCurrentOutput] = useState<Message | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [isCheckingEmployee, setIsCheckingEmployee] = useState(true);

  // Check if user is registered as an employee
  useEffect(() => {
    const checkEmployeeStatus = () => {
      const isActive = employeeService.isActiveEmployee(companyName, user.email);
      setIsEmployee(isActive);
      setIsCheckingEmployee(false);
    };

    checkEmployeeStatus();
  }, [user.email, companyName]);

  const handleSubmitQuery = async () => {
    if (!input.trim()) return;

    // Add to query history
    const historyItem: QueryHistoryItem = {
      id: Date.now().toString(),
      query: input,
      timestamp: new Date(),
    };
    setQueryHistory((prev) => [historyItem, ...prev]);

    setIsLoading(true);

    // Execute query
    const response = await queryService.executeQuery(input);
    setCurrentOutput(response);
    setIsLoading(false);
    setInput('');
  };

  const handleSelectQuery = (query: string) => {
    setInput(query);
  };

  // Loading state
  if (isCheckingEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Checking access...</p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!isEmployee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Employee Dashboard" userName={user.name} onLogout={onLogout} />
        <AccessDenied email={user.email} companyName={user.companyName} />
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Employee Dashboard" userName={user.name} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <NaturalLanguageQuery
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmitQuery}
            />
            <QueryOutput isLoading={isLoading} output={currentOutput} />
          </div>

          {/* Right Column - Query History */}
          <div className="lg:col-span-1">
            <QueryHistory history={queryHistory} onSelectQuery={handleSelectQuery} />
          </div>
        </div>
      </main>
    </div>
  );
}
