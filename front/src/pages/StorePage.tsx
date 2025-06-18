import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CategoryGrid } from '../components/CategoryIcons';
import { ProductCard } from '../components/ProductCard';
import { useProducts, Product } from '../contexts/ProductContext';

export function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState('Verduras');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const { getProductsByCategory } = useProducts();

  const products = getProductsByCategory(selectedCategory);
  const cartItemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const handleAddToCart = (product: Product) => {
    console.log('Produto adicionado ao carrinho:', product);
  };

  const handleCartClick = () => {
    console.log('Abrir carrinho:', cart);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCartClick={handleCartClick}
        cartItemCount={cartItemCount}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Selection */}
        <CategoryGrid 
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              cartQuantity={cart[product.id] || 0}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}