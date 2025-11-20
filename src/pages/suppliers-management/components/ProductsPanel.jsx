import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProductsPanel = ({ 
  supplier, 
  products, 
  onEditProduct, 
  onDeleteProduct,
  userRole = 'editor',
  isLoading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dosageFilter, setDosageFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const dosageOptions = [
    { value: 'all', label: 'All Dosage Forms' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'injection', label: 'Injection' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'cream', label: 'Cream' },
    { value: 'drops', label: 'Drops' }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProducts = React.useMemo(() => {
    let filtered = products?.filter(product => {
      const matchesSearch = product?.api_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          product?.strength?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          product?.pack_size?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesDosage = dosageFilter === 'all' || product?.dosage_form === dosageFilter;
      return matchesSearch && matchesDosage;
    });

    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, dosageFilter, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  if (!supplier) {
    return (
      <div className="bg-surface rounded-lg clinical-shadow p-8 text-center">
        <Icon name="Package" size={48} className="mx-auto text-text-secondary mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Select a Supplier</h3>
        <p className="text-text-secondary">
          Choose a supplier from the table to view their product catalog.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg clinical-shadow">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {supplier?.company_name} Products
            </h3>
            <p className="text-sm text-text-secondary">
              {filteredProducts?.length} of {products?.length} products
            </p>
          </div>
          {userRole === 'editor' && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onEditProduct(null, supplier?.id)}
            >
              Add Product
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <Select
            options={dosageOptions}
            value={dosageFilter}
            onChange={setDosageFilter}
            placeholder="Filter by dosage form"
            className="w-48"
          />
        </div>
      </div>
      {/* Products Content */}
      {isLoading ? (
        <div className="p-8 text-center">
          <Icon name="Loader2" size={32} className="mx-auto text-primary animate-spin mb-4" />
          <p className="text-text-secondary">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('api_name')}
                      className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                    >
                      <span>API Name</span>
                      {getSortIcon('api_name')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('dosage_form')}
                      className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                    >
                      <span>Form</span>
                      {getSortIcon('dosage_form')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('strength')}
                      className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                    >
                      <span>Strength</span>
                      {getSortIcon('strength')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Pack Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('unit_price_usd')}
                      className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                    >
                      <span>Price</span>
                      {getSortIcon('unit_price_usd')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    MOQ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Lead Time
                  </th>
                  {userRole === 'editor' && (
                    <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {filteredProducts?.map((product) => (
                  <tr key={product?.id} className="hover:bg-muted transition-clinical">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-foreground">{product?.api_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary bg-opacity-10 text-secondary">
                        {product?.dosage_form}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">{product?.strength}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">{product?.pack_size}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-foreground">
                        {formatCurrency(product?.unit_price_usd)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">{product?.moq?.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">{product?.lead_time_days} days</div>
                    </td>
                    {userRole === 'editor' && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Edit"
                            onClick={() => onEditProduct(product, supplier?.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            onClick={() => onDeleteProduct(product?.id)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-border">
            {filteredProducts?.map((product) => (
              <div key={product?.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">
                      {product?.api_name}
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary bg-opacity-10 text-secondary">
                        {product?.dosage_form}
                      </span>
                      <span className="text-xs text-text-secondary">{product?.strength}</span>
                    </div>
                  </div>
                  {userRole === 'editor' && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEditProduct(product, supplier?.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => onDeleteProduct(product?.id)}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-secondary">Pack Size:</span>
                    <div className="font-medium text-foreground">{product?.pack_size}</div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Price:</span>
                    <div className="font-medium text-foreground">
                      {formatCurrency(product?.unit_price_usd)}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-secondary">MOQ:</span>
                    <div className="font-medium text-foreground">{product?.moq?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-text-secondary">Lead Time:</span>
                    <div className="font-medium text-foreground">{product?.lead_time_days} days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts?.length === 0 && (
            <div className="p-8 text-center">
              <Icon name="Package" size={48} className="mx-auto text-text-secondary mb-4" />
              <h4 className="text-lg font-medium text-foreground mb-2">No products found</h4>
              <p className="text-text-secondary mb-4">
                {searchTerm || dosageFilter !== 'all' ?'Try adjusting your search or filter criteria.' :'This supplier has no products in their catalog yet.'
                }
              </p>
              {userRole === 'editor' && !searchTerm && dosageFilter === 'all' && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => onEditProduct(null, supplier?.id)}
                >
                  Add Product
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsPanel;