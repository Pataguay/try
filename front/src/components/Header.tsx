import React, { useState } from 'react';
import { Logo } from './Logo';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showAuthButtons?: boolean;
  onCartClick?: () => void;
  cartItemCount?: number;
}

export function Header({ showAuthButtons = true, onCartClick, cartItemCount = 0 }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-400 to-green-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo className="text-white" />
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full pl-4 pr-10 py-2 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-white text-sm">
            <a href="#" className="hover:text-green-100 transition-colors">oferta do dia</a>
            <a href="#" className="hover:text-green-100 transition-colors">melhores avaliados</a>
            <a href="#" className="hover:text-green-100 transition-colors">fale conosco</a>
            
            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-green-600 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center space-x-3 ml-6">
              {user ? (
                <div className="flex items-center space-x-3 text-white">
                  <span className="text-sm">Olá, {user.name}</span>
                  <button
                    onClick={logout}
                    className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <>
                  <button className="text-white hover:text-green-100 transition-colors text-sm">
                    Sign in
                  </button>
                  <button className="bg-white text-green-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-50 transition-colors">
                    Register
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2 rounded-md hover:bg-green-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-green-600 py-4">
            {/* Search Bar - Mobile */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-4 pr-10 py-2 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Navigation Links - Mobile */}
            <div className="space-y-3 text-white">
              <a href="#" className="block hover:text-green-100 transition-colors">oferta do dia</a>
              <a href="#" className="block hover:text-green-100 transition-colors">melhores avaliados</a>
              <a href="#" className="block hover:text-green-100 transition-colors">fale conosco</a>
              
              {/* Cart - Mobile */}
              <button 
                onClick={onCartClick}
                className="flex items-center space-x-2 hover:text-green-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Carrinho ({cartItemCount})</span>
              </button>

              {/* Auth - Mobile */}
              {showAuthButtons && (
                <div className="pt-3 border-t border-green-600">
                  {user ? (
                    <div className="space-y-3">
                      <span className="block">Olá, {user.name}</span>
                      <button
                        onClick={logout}
                        className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button className="block text-left hover:text-green-100 transition-colors">
                        Sign in
                      </button>
                      <button className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-green-50 transition-colors">
                        Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}