import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StorePage } from './pages/StorePage';
import { ManagementPage } from './pages/ManagementPage';
import { EditProductPage } from './pages/EditProductPage';

type AppState = 'login' | 'register' | 'store' | 'management' | 'edit' | 'add';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppState>('login');
  const [editingProductId, setEditingProductId] = useState<string>('');

  // Handle navigation based on authentication and user type
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.type === 'cliente') {
        setCurrentPage('store');
      } else if (user.type === 'vendedor') {
        setCurrentPage('management');
      }
    } else {
      setCurrentPage('login');
    }
  }, [isAuthenticated, user]);

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
    setCurrentPage('edit');
  };

  const handleAddProduct = () => {
    setEditingProductId('');
    setCurrentPage('add');
  };

  const handleSaveProduct = () => {
    setCurrentPage('management');
    setEditingProductId('');
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onShowRegister={() => setCurrentPage('register')} />;
      
      case 'register':
        return <RegisterPage onShowLogin={() => setCurrentPage('login')} />;
      
      case 'store':
        return <StorePage />;
      
      case 'management':
        return (
          <ManagementPage 
            onEditProduct={handleEditProduct}
            onAddProduct={handleAddProduct}
          />
        );
      
      case 'edit':
        return (
          <EditProductPage 
            productId={editingProductId} 
            onSave={handleSaveProduct}
            isNewProduct={false}
          />
        );
      
      case 'add':
        return (
          <EditProductPage 
            onSave={handleSaveProduct}
            isNewProduct={true}
          />
        );
      
      default:
        return <LoginPage onShowRegister={() => setCurrentPage('register')} />;
    }
  };

  return renderCurrentPage();
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <AppContent />
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;