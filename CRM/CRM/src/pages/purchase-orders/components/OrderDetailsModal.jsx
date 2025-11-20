import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !order) return null;

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

  const statusActions = [
    { status: 'confirmed', label: 'Confirm Order', icon: 'Check' },
    { status: 'processing', label: 'Start Processing', icon: 'Clock' },
    { status: 'shipped', label: 'Mark as Shipped', icon: 'Truck' },
    { status: 'delivered', label: 'Mark as Delivered', icon: 'CheckCircle' },
    { status: 'cancelled', label: 'Cancel Order', icon: 'X', variant: 'destructive' }
  ];

  const availableActions = statusActions?.filter(action => action?.status !== order?.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="ShoppingCart" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Purchase Order Details</h2>
              <p className="text-sm text-text-secondary">{order?.order_number}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} iconName="X" />
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-text-secondary">Status:</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order?.status)}`}>
                {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
              </span>
            </div>
            
            {availableActions?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableActions?.slice(0, 3)?.map((action) => (
                  <Button
                    key={action?.status}
                    variant={action?.variant || 'outline'}
                    size="sm"
                    onClick={() => {
                      onUpdateStatus(order?.id, action?.status);
                      onClose();
                    }}
                    iconName={action?.icon}
                    iconPosition="left"
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Party Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Party Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Client</label>
                  <div className="text-foreground">{order?.client_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Supplier</label>
                  <div className="text-foreground">{order?.supplier_name}</div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
                Product Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Product Name</label>
                  <div className="text-foreground font-medium">{order?.product_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">API Name</label>
                  <div className="text-foreground">{order?.api_name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Dosage Form</label>
                    <div className="text-foreground">{order?.dosage_form}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Strength</label>
                    <div className="text-foreground">{order?.strength}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Pack Size</label>
                    <div className="text-foreground">{order?.pack_size}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Financial Details
            </h3>
            <div className="bg-muted rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Units</label>
                  <div className="text-lg font-semibold text-foreground">
                    {order?.units?.toLocaleString('en-US')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Unit Price</label>
                  <div className="text-lg font-semibold text-foreground">
                    ${order?.unit_price_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Other Costs</label>
                  <div className="text-lg font-semibold text-foreground">
                    ${order?.other_costs_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Commission Rate</label>
                  <div className="text-lg font-semibold text-foreground">
                    {(order?.commission_rate * 100)?.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  ${order?.base_amount_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-text-secondary">Base Amount</div>
                <div className="text-xs text-text-secondary mt-1">
                  (Units × Unit Price + Other Costs)
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent">
                  ${order?.commission_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-text-secondary">Commission</div>
                <div className="text-xs text-text-secondary mt-1">
                  (Base Amount × Rate)
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">
                  ${order?.total_amount_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-text-secondary">Total Amount</div>
                <div className="text-xs text-text-secondary mt-1">
                  (Base + Commission)
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">Expected Delivery Date</label>
              <div className="text-foreground">
                {new Date(order.expected_delivery_date)?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Created Date</label>
              <div className="text-foreground">
                {new Date(order.created_at)?.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          {/* Notes */}
          {order?.notes && (
            <div>
              <label className="text-sm font-medium text-text-secondary">Notes</label>
              <div className="mt-1 p-3 bg-muted rounded-lg text-foreground">
                {order?.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button iconName="Download" iconPosition="left">
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;