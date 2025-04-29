
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import DynamicForm from '@/components/DynamicForm';
import { User } from '@/types/form';
import { Toaster } from "sonner";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Dynamic Student Forms
        </h1>
        
        {user ? (
          <DynamicForm user={user} onLogout={handleLogout} />
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Index;
