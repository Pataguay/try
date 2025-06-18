import React from 'react';
import { Leaf, Wheat, Apple, Carrot, Flower2 } from 'lucide-react';

const categoryIcons = {
  'Verduras': Leaf,
  'Grãos': Wheat,
  'Frutas': Apple,
  'Legumes': Carrot,
  'Temperos': Flower2
};

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = "w-6 h-6" }: CategoryIconProps) {
  const Icon = categoryIcons[category as keyof typeof categoryIcons] || Leaf;
  return <Icon className={className} />;
}

export function CategoryGrid({ selectedCategory, onCategorySelect }: {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}) {
  const categories = ['Verduras', 'Grãos', 'Frutas', 'Legumes', 'Temperos'];

  return (
    <div className="grid grid-cols-5 gap-4 mb-8">
      {categories.map((category) => {
        const Icon = categoryIcons[category as keyof typeof categoryIcons];
        const isSelected = selectedCategory === category;
        
        return (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105
              ${isSelected 
                ? 'border-green-500 bg-green-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`
                p-3 rounded-full transition-colors
                ${isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <Icon className="w-8 h-8" />
              </div>
              <span className={`
                text-sm font-medium transition-colors
                ${isSelected ? 'text-green-700' : 'text-gray-700'}
              `}>
                {category}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}