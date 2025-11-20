import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SuppliersTable = ({ 
  suppliers, 
  onSelectSupplier, 
  selectedSupplierId, 
  onEditSupplier, 
  onDeleteSupplier,
  userRole = 'editor',
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSuppliers = React.useMemo(() => {
    let sortableSuppliers = [...suppliers];
    if (sortConfig?.key) {
      sortableSuppliers?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSuppliers;
  }, [suppliers, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-success', text: 'text-success-foreground', label: 'Active' },
      inactive: { bg: 'bg-error', text: 'text-error-foreground', label: 'Inactive' },
      pending: { bg: 'bg-warning', text: 'text-warning-foreground', label: 'Pending' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.bg} ${config?.text}`}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-lg clinical-shadow">
      {/* Table Header with Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filter by status"
              className="w-40"
            />
            {userRole === 'editor' && (
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => onEditSupplier(null)}
              >
                Add Supplier
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <button
                  onClick={() => handleSort('company_name')}
                  className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                >
                  <span>Company</span>
                  {getSortIcon('company_name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <button
                  onClick={() => handleSort('contact_person')}
                  className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                >
                  <span>Contact</span>
                  {getSortIcon('contact_person')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <button
                  onClick={() => handleSort('location')}
                  className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                >
                  <span>Location</span>
                  {getSortIcon('location')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-foreground transition-clinical"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Products
              </th>
              {userRole === 'editor' && (
                <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {sortedSuppliers?.map((supplier) => (
              <tr
                key={supplier?.id}
                onClick={() => onSelectSupplier(supplier?.id)}
                className={`cursor-pointer transition-clinical hover:bg-muted ${
                  selectedSupplierId === supplier?.id ? 'bg-primary bg-opacity-10' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <Icon name="Building2" size={20} className="text-primary" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">{supplier?.company_name}</div>
                      <div className="text-sm text-text-secondary">{supplier?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{supplier?.contact_person}</div>
                  <div className="text-sm text-text-secondary">{supplier?.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{supplier?.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(supplier?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{supplier?.product_count} products</div>
                </td>
                {userRole === 'editor' && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onEditSupplier(supplier);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onDeleteSupplier(supplier?.id);
                        }}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-border">
        {sortedSuppliers?.map((supplier) => (
          <div
            key={supplier?.id}
            onClick={() => onSelectSupplier(supplier?.id)}
            className={`p-4 cursor-pointer transition-clinical hover:bg-muted ${
              selectedSupplierId === supplier?.id ? 'bg-primary bg-opacity-10' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                    <Icon name="Building2" size={20} className="text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {supplier?.company_name}
                  </div>
                  <div className="text-sm text-text-secondary">{supplier?.contact_person}</div>
                  <div className="text-sm text-text-secondary">{supplier?.location}</div>
                  <div className="mt-2 flex items-center space-x-2">
                    {getStatusBadge(supplier?.status)}
                    <span className="text-xs text-text-secondary">
                      {supplier?.product_count} products
                    </span>
                  </div>
                </div>
              </div>
              {userRole === 'editor' && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Edit"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onEditSupplier(supplier);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onDeleteSupplier(supplier?.id);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {sortedSuppliers?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Building2" size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No suppliers found</h3>
          <p className="text-text-secondary mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first supplier.'}
          </p>
          {userRole === 'editor' && !searchTerm && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onEditSupplier(null)}
            >
              Add Supplier
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SuppliersTable;