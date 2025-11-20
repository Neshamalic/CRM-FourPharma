import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DealCard = ({ deal, onStageChange, onEdit, onView, userRole = 'editor' }) => {
  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'bg-blue-100 text-blue-800 border-blue-200',
      'Negotiation': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Contract': 'bg-purple-100 text-purple-800 border-purple-200',
      'Closed': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors?.[stage] || 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleStageChange = (newStage) => {
    if (userRole === 'editor') {
      onStageChange(deal?.id, newStage);
    }
  };

  return (
    <div className="bg-surface p-4 rounded-lg clinical-shadow border border-border hover:clinical-shadow-lg transition-clinical">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
            {deal?.client_name} × {deal?.supplier_name}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(deal?.stage)}`}>
              {deal?.stage}
            </span>
            <span className={`text-xs font-medium ${getPriorityColor(deal?.priority)}`}>
              {deal?.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onView(deal)}
            className="p-1 rounded hover:bg-muted transition-clinical"
            title="View Details"
          >
            <Icon name="Eye" size={14} className="text-text-secondary" />
          </button>
          {userRole === 'editor' && (
            <button
              onClick={() => onEdit(deal)}
              className="p-1 rounded hover:bg-muted transition-clinical"
              title="Edit Deal"
            >
              <Icon name="Edit" size={14} className="text-text-secondary" />
            </button>
          )}
        </div>
      </div>
      {/* Product Info */}
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground mb-1 line-clamp-1">
          {deal?.product_name}
        </p>
        <p className="text-xs text-text-secondary line-clamp-1">
          {deal?.dosage_form} • {deal?.strength} • {deal?.pack_size}
        </p>
      </div>
      {/* Deal Value */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Deal Value</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(deal?.deal_value)}
          </span>
        </div>
        {deal?.commission_rate && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-text-secondary">Commission</span>
            <span className="text-xs text-accent">
              {formatCurrency(deal?.deal_value * deal?.commission_rate)} ({(deal?.commission_rate * 100)?.toFixed(1)}%)
            </span>
          </div>
        )}
      </div>
      {/* Timeline */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Created</span>
          <span className="text-foreground">{formatDate(deal?.created_at)}</span>
        </div>
        {deal?.expected_close_date && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Expected Close</span>
            <span className="text-foreground">{formatDate(deal?.expected_close_date)}</span>
          </div>
        )}
        {deal?.last_activity && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Last Activity</span>
            <span className="text-foreground">{formatDate(deal?.last_activity)}</span>
          </div>
        )}
      </div>
      {/* Next Action */}
      {deal?.next_action && (
        <div className="mb-3">
          <p className="text-xs text-text-secondary mb-1">Next Action</p>
          <p className="text-xs text-foreground line-clamp-2">{deal?.next_action}</p>
        </div>
      )}
      {/* Stage Actions */}
      {userRole === 'editor' && (
        <div className="flex items-center space-x-1">
          {deal?.stage !== 'Lead' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleStageChange('Lead')}
              className="text-xs"
            >
              Lead
            </Button>
          )}
          {deal?.stage !== 'Negotiation' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleStageChange('Negotiation')}
              className="text-xs"
            >
              Negotiate
            </Button>
          )}
          {deal?.stage !== 'Contract' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleStageChange('Contract')}
              className="text-xs"
            >
              Contract
            </Button>
          )}
          {deal?.stage !== 'Closed' && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => handleStageChange('Closed')}
              className="text-xs"
            >
              Close
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DealCard;