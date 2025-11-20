import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchResultsTable = ({ results, onCreateDeal, onViewSupplier, isLoading }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedResults = React.useMemo(() => {
    if (!sortConfig?.key) return results;

    return [...results]?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig?.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue)?.toLowerCase();
      const bString = String(bValue)?.toLowerCase();

      if (sortConfig?.direction === 'asc') {
        return aString?.localeCompare(bString);
      } else {
        return bString?.localeCompare(aString);
      }
    });
  }, [results, sortConfig]);

  const SortIcon = ({ column }) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig?.direction === 'asc' ? 
      <Icon name="ArrowUp" size={14} className="text-primary" /> : 
      <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  if (results?.length === 0 && !isLoading) {
    return (
      <div className="bg-surface p-12 rounded-lg clinical-shadow text-center">
        <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-text-secondary mb-4">
          Try adjusting your search terms or filters to find more results.
        </p>
        <div className="text-sm text-text-secondary">
          <p>Search tips:</p>
          <ul className="mt-2 space-y-1">
            <li>• Use generic names (e.g., "Paracetamol" instead of brand names)</li>
            <li>• Try different dosage forms (Tablet, Capsule, Injection)</li>
            <li>• Search by strength (500mg, 10ml, 1g)</li>
            <li>• Use partial matches (e.g., "Amoxi" for Amoxicillin)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg clinical-shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('supplier_name')}
                  className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-clinical"
                >
                  <span>Supplier</span>
                  <SortIcon column="supplier_name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('product_name')}
                  className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-clinical"
                >
                  <span>Product</span>
                  <SortIcon column="product_name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('unit_price_usd')}
                  className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-clinical"
                >
                  <span>Price (USD)</span>
                  <SortIcon column="unit_price_usd" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('moq')}
                  className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-clinical"
                >
                  <span>MOQ</span>
                  <SortIcon column="moq" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('lead_time_days')}
                  className="flex items-center space-x-2 font-semibold text-foreground hover:text-primary transition-clinical"
                >
                  <span>Lead Time</span>
                  <SortIcon column="lead_time_days" />
                </button>
              </th>
              <th className="px-6 py-4 text-center">
                <span className="font-semibold text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedResults?.map((product) => (
              <tr key={product?.id} className="hover:bg-muted hover:bg-opacity-50 transition-clinical">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{product?.supplier_name}</div>
                    <div className="text-sm text-text-secondary">{product?.supplier_location}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{product?.product_name}</div>
                    <div className="text-sm text-text-secondary">
                      {product?.dosage_form} • {product?.strength} • {product?.pack_size}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-foreground">
                    ${product?.unit_price_usd?.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-foreground">
                    {product?.moq?.toLocaleString()} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-foreground">
                    {product?.lead_time_days} days
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewSupplier(product?.supplier_id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Plus"
                      onClick={() => onCreateDeal(product)}
                    >
                      Deal
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedResults?.map((product) => (
          <div key={product?.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{product?.product_name}</h3>
                <p className="text-sm text-text-secondary">
                  {product?.dosage_form} • {product?.strength} • {product?.pack_size}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-foreground">
                  ${product?.unit_price_usd?.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-text-secondary">Supplier:</span>
                <div className="font-medium text-foreground">{product?.supplier_name}</div>
                <div className="text-text-secondary">{product?.supplier_location}</div>
              </div>
              <div>
                <span className="text-text-secondary">MOQ:</span>
                <div className="font-medium text-foreground">{product?.moq?.toLocaleString()} units</div>
                <span className="text-text-secondary">Lead Time:</span>
                <div className="font-medium text-foreground">{product?.lead_time_days} days</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
                fullWidth
                onClick={() => onViewSupplier(product?.supplier_id)}
              >
                View Supplier
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Plus"
                fullWidth
                onClick={() => onCreateDeal(product)}
              >
                Create Deal
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsTable;