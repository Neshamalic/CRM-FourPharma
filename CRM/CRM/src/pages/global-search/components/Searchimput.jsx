import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SearchInput = ({ onSearch, isLoading, searchQuery }) => {
  const [query, setQuery] = useState(searchQuery || '');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query?.trim() !== searchQuery) {
        onSearch(query?.trim());
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch, searchQuery]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="bg-surface p-6 rounded-lg clinical-shadow mb-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Global Product Search</h1>
        <p className="text-text-secondary">
          Search across all suppliers for pharmaceutical products by API, dosage form, strength, or pack size
        </p>
      </div>
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? (
              <Icon name="Loader2" size={20} className="text-text-secondary animate-spin" />
            ) : (
              <Icon name="Search" size={20} className="text-text-secondary" />
            )}
          </div>
          <Input
            type="search"
            placeholder="Search for products (e.g., Paracetamol, Tablet 500mg, Injection 10ml...)"
            value={query}
            onChange={(e) => setQuery(e?.target?.value)}
            disabled={isLoading}
            className="pl-10 pr-10 py-3 text-lg"
          />
          {query && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground transition-clinical"
              disabled={isLoading}
            >
              <Icon name="X" size={20} className="text-text-secondary" />
            </button>
          )}
        </div>
        
        <div className="mt-3 text-sm text-text-secondary text-center">
          <p>Try searching: "Amoxicillin", "Tablet 500mg", "Injection", or "Syrup 100ml"</p>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;