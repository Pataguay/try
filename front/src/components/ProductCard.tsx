import React from 'react';
import { Plus, Minus, Edit3 } from 'lucide-react';
import { Product } from '../contexts/ProductContext';

interface ProductCardProps {
  product: Product;
  isEditable?: boolean;
  onEdit?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  cartQuantity?: number;
  onQuantityChange?: (productId: string, newQuantity: number) => void;
}

export function ProductCard({ 
  product, 
  isEditable = false, 
  onEdit, 
  onAddToCart,
  cartQuantity = 0,
  onQuantityChange
}: ProductCardProps) {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, cartQuantity + delta);
    onQuantityChange?.(product.id, newQuantity);
  };

  const handleAddToCart = () => {
    if (cartQuantity === 0) {
      onQuantityChange?.(product.id, 1);
    }
    onAddToCart?.(product);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="aspect-square bg-gray-200 overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Estoque baixo
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
          <p className="text-green-600 font-bold text-xl">
            R$ {product.price.toFixed(2)}
            <span className="text-sm text-gray-500 font-normal ml-1">/{product.unit}</span>
          </p>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          {isEditable ? (
            <button
              onClick={() => onEdit?.(product.id)}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar produto</span>
            </button>
          ) : (
            <div className="flex items-center space-x-3 w-full">
              {cartQuantity > 0 ? (
                <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-green-100 rounded-md transition-colors"
                  >
                    <Minus className="w-4 h-4 text-green-600" />
                  </button>
                  <span className="font-medium text-green-700 min-w-[2rem] text-center">
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-green-100 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
                >
                  Adicionar ao carrinho
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}