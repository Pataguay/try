import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Plus, Minus, ImageIcon } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

interface EditProductPageProps {
  productId?: string;
  onSave: () => void;
  isNewProduct?: boolean;
}

export function EditProductPage({ productId, onSave, isNewProduct = false }: EditProductPageProps) {
  const { getProductById, updateProduct, deleteProduct, addProduct } = useProducts();
  
  const [product, setProduct] = useState(() => {
    if (isNewProduct) {
      return {
        id: '',
        name: '',
        price: 0,
        description: '',
        category: 'Verduras',
        image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg',
        unit: 'unidade',
        stock: 0
      };
    }
    return productId ? getProductById(productId) : null;
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isNewProduct && productId) {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct);
    }
  }, [productId, getProductById, isNewProduct]);

  if (!isNewProduct && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Produto não encontrado</p>
      </div>
    );
  }

  const handleStockChange = (delta: number) => {
    setProduct(prev => prev ? {
      ...prev,
      stock: Math.max(0, prev.stock + delta)
    } : null);
  };

  const handleChange = (field: string, value: string | number) => {
    setProduct(prev => prev ? {
      ...prev,
      [field]: value
    } : null);
  };

  const handleDelete = async () => {
    if (!productId || isNewProduct) return;
    
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      setIsDeleting(true);
      try {
        deleteProduct(productId);
        onSave();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSave = async () => {
    if (!product) return;
    
    setIsSaving(true);
    try {
      if (isNewProduct) {
        addProduct({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          unit: product.unit,
          stock: product.stock,
          image: product.image
        });
      } else if (productId) {
        updateProduct(productId, {
          name: product.name,
          price: product.price,
          description: product.description,
          unit: product.unit,
          stock: product.stock,
          image: product.image
        });
      }
      onSave();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = ['Verduras', 'Grãos', 'Frutas', 'Legumes', 'Temperos'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            {isNewProduct ? 'Adicionar Novo Produto' : 'Editar Produto'}
          </h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Section */}
            <div className="lg:w-1/3">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 relative group">
                <img 
                  src={product?.image || 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg'} 
                  alt={product?.name || 'Produto'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button className="bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>Alterar foto</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={product?.image || ''}
                  onChange={(e) => handleChange('image', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-2/3 space-y-6">
              {/* Name and Category */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto
                  </label>
                  <input
                    type="text"
                    value={product?.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={product?.category || 'Verduras'}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidade
                  </label>
                  <input
                    type="text"
                    value={product?.unit || ''}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    placeholder="kg, unidade, maço, etc."
                    required
                  />
                </div>
              </div>

              {/* Stock and Price */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estoque
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => handleStockChange(-1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-lg min-w-[3rem] text-center">
                      {product?.stock || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStockChange(1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={product?.price || 0}
                      onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-right"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={product?.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
                  placeholder="Descreva o produto..."
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                {!isNewProduct && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {isDeleting ? 'Deletando...' : 'Deletar Produto'}
                  </button>
                )}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-3 px-8 rounded-lg transition-colors ml-auto"
                >
                  {isSaving ? 'Salvando...' : (isNewProduct ? 'Adicionar Produto' : 'Concluir edição')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}