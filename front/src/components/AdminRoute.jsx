import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontFamily: 'var(--font-display)',
        color: 'var(--color-accent)'
      }}>
        VERIFYING SOVEREIGN CREDENTIALS...
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
