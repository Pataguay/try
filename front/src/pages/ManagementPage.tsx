import React, { useState } from 'react';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { Plus } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

interface ManagementPageProps {
  onEditProduct: (productId: string) => void;
  onAddProduct: () => void;
}

export function ManagementPage({ onEditProduct, onAddProduct }: ManagementPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('Verduras');
  const { getProductsByCategory } = useProducts();
  
  const categories = ['Verduras', 'Grãos', 'Frutas', 'Legumes', 'Temperos'];
  const products = getProductsByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
            Gerenciamento de loja
          </h1>
          
          <button
            onClick={onAddProduct}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Adicionar Produto</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-green-100 rounded-lg p-1 mb-8 inline-flex">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-green-700 hover:bg-green-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Todos os produtos da categoria
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isEditable={true}
              onEdit={onEditProduct}
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