import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AddExpense from './pages/AddExpense';
import ExpensesHistory from './pages/ExpensesHistory';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { GroupProvider } from './context/GroupContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <GroupProvider>
          <SettingsProvider>
            <Router>
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="groups" element={<Groups />} />
                  <Route path="groups/:id" element={<GroupDetails />} />
                  <Route path="add-expense" element={<AddExpense />} />
                  <Route path="expenses" element={<ExpensesHistory />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </SettingsProvider>
        </GroupProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}

export default App;
