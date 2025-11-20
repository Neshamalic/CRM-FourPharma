import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const OrdersTable = ({ orders = [], onViewOrder, onUpdateStatus, onDeleteOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-warning text-warning-foreground',
      confirmed: 'bg-primary text-primary-foreground',
      processing: 'bg-secondary text-secondary-foreground',
      shipped: 'bg-accent text-accent-foreground',
      delivered: 'bg-success text-success-foreground',
      cancelled: 'bg-destructive text-destructive-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  // Filter and sort orders
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order?.order_number?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      order?.client_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      order?.supplier_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      order?.product_name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesStatus = !statusFilter || order?.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders]?.sort((a, b) => {
    const aValue = a?.[sortConfig?.key];
    const bValue = b?.[sortConfig?.key];
    
    if (sortConfig?.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Pagination
  const totalPages = Math.ceil(sortedOrders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = sortedOrders?.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusUpdate = (orderId, newStatus) => {
    onUpdateStatus(orderId, newStatus);
  };

  if (orders?.length === 0) {
    return (
      <div className="bg-surface rounded-lg clinical-shadow p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full">
            <Icon name="ShoppingCart" size={32} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">No Purchase Orders</h3>
            <p className="text-text-secondary">Create your first purchase order to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg clinical-shadow">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Purchase Orders</h2>
            <p className="text-sm text-text-secondary">
              Manage and track all purchase orders ({filteredOrders?.length} total)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-64">
              <Input
                type="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('order_number')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Order Number</span>
                  <Icon name={getSortIcon('order_number')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('client_name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Client</span>
                  <Icon name={getSortIcon('client_name')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('supplier_name')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Supplier</span>
                  <Icon name={getSortIcon('supplier_name')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('base_amount_usd')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical ml-auto"
                >
                  <span>Amount</span>
                  <Icon name={getSortIcon('base_amount_usd')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('commission_usd')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical ml-auto"
                >
                  <span>Commission</span>
                  <Icon name={getSortIcon('commission_usd')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-clinical"
                >
                  <span>Created</span>
                  <Icon name={getSortIcon('created_at')} size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedOrders?.map((order) => (
              <tr key={order?.id} className="hover:bg-muted transition-clinical">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{order?.order_number}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground">{order?.client_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground">{order?.supplier_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-foreground font-medium">{order?.product_name}</div>
                  <div className="text-sm text-text-secondary">
                    {order?.api_name} • {order?.strength} • {order?.dosage_form}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-medium text-foreground">
                    ${order?.base_amount_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {order?.units} units @ ${order?.unit_price_usd}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-medium text-accent">
                    ${order?.commission_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {(order?.commission_rate * 100)?.toFixed(1)}%
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
                    {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-text-secondary">
                    {new Date(order.created_at)?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewOrder(order)}
                      iconName="Eye"
                    >
                    </Button>
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="MoreVertical"
                      >
                      </Button>
                      <div className="absolute right-0 top-8 w-48 bg-popover border border-border rounded-lg clinical-shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-clinical z-10">
                        <div className="py-1">
                          <button
                            onClick={() => handleStatusUpdate(order?.id, 'confirmed')}
                            className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                          >
                            <Icon name="Check" size={16} className="mr-3" />
                            Mark Confirmed
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order?.id, 'shipped')}
                            className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                          >
                            <Icon name="Truck" size={16} className="mr-3" />
                            Mark Shipped
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(order?.id, 'delivered')}
                            className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-clinical"
                          >
                            <Icon name="CheckCircle" size={16} className="mr-3" />
                            Mark Delivered
                          </button>
                          <div className="border-t border-border my-1"></div>
                          <button
                            onClick={() => onDeleteOrder(order?.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-clinical"
                          >
                            <Icon name="Trash2" size={16} className="mr-3" />
                            Delete Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders?.length)} of {filteredOrders?.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              >
              </Button>
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
              >
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;