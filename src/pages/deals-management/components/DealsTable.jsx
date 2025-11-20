import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DealsTable = ({ deals, onEdit, onView, onDelete, userRole = 'editor' }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'bg-blue-100 text-blue-800',
      'Negotiation': 'bg-yellow-100 text-yellow-800',
      'Contract': 'bg-purple-100 text-purple-800',
      'Closed': 'bg-green-100 text-green-800'
    };
    return colors?.[stage] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'text-red-600',
      'Medium': 'text-yellow-600',
      'Low': 'text-green-600'
    };
    return colors?.[priority] || 'text-gray-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedDeals = React.useMemo(() => {
    let sortableDeals = [...deals];
    if (sortConfig?.key) {
      sortableDeals?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableDeals;
  }, [deals, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  if (deals?.length === 0) {
    return (
      <div className="bg-surface rounded-lg clinical-shadow p-8">
        <div className="text-center">
          <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Deals Found</h3>
          <p className="text-text-secondary mb-4">
            Start by creating deals from your intelligent matches or add new deals manually.
          </p>
          {userRole === 'editor' && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/intelligent-matching'}
              iconName="Plus"
              iconPosition="left"
            >
              Create from Matches
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg clinical-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('client_name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Client</span>
                  {getSortIcon('client_name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('supplier_name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Supplier</span>
                  {getSortIcon('supplier_name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Product</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('deal_value')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Deal Value</span>
                  {getSortIcon('deal_value')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('stage')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Stage</span>
                  {getSortIcon('stage')}
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <span className="text-sm font-medium text-foreground">Priority</span>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('last_activity')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Last Activity</span>
                  {getSortIcon('last_activity')}
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedDeals?.map((deal) => (
              <tr key={deal?.id} className="hover:bg-muted transition-clinical">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{deal?.client_name}</div>
                    <div className="text-sm text-text-secondary">{deal?.client_contact}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{deal?.supplier_name}</div>
                    <div className="text-sm text-text-secondary">{deal?.supplier_contact}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-foreground">{deal?.product_name}</div>
                    <div className="text-sm text-text-secondary">
                      {deal?.dosage_form} • {deal?.strength} • {deal?.pack_size}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-foreground">{formatCurrency(deal?.deal_value)}</div>
                    {deal?.commission_rate && (
                      <div className="text-sm text-accent">
                        {formatCurrency(deal?.deal_value * deal?.commission_rate)} commission
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(deal?.stage)}`}>
                    {deal?.stage}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${getPriorityColor(deal?.priority)}`}>
                    {deal?.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    {deal?.last_activity ? formatDate(deal?.last_activity) : 'No activity'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(deal)}
                      className="p-1 rounded hover:bg-muted transition-clinical"
                      title="View Details"
                    >
                      <Icon name="Eye" size={16} className="text-text-secondary" />
                    </button>
                    {userRole === 'editor' && (
                      <>
                        <button
                          onClick={() => onEdit(deal)}
                          className="p-1 rounded hover:bg-muted transition-clinical"
                          title="Edit Deal"
                        >
                          <Icon name="Edit" size={16} className="text-text-secondary" />
                        </button>
                        <button
                          onClick={() => onDelete(deal)}
                          className="p-1 rounded hover:bg-muted transition-clinical"
                          title="Delete Deal"
                        >
                          <Icon name="Trash2" size={16} className="text-destructive" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealsTable;