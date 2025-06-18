import React from 'react';
import { User, Sprout } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative bg-green-100 rounded-lg p-2">
        <User className="w-8 h-8 text-green-800" />
        <Sprout className="w-4 h-4 text-green-600 absolute -bottom-0.5 -right-0.5" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-green-800">ZÉ DA HORTA</span>
        </div>
      )}
    </div>
  );
}