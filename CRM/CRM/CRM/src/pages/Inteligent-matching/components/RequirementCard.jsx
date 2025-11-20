import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequirementCard = ({ requirement, onViewMatches, isExpanded }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-error bg-red-50 border-red-200';
      case 'medium':
        return 'text-warning bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-success bg-green-50 border-green-200';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-success bg-green-50 border-green-200';
      case 'pending':
        return 'text-warning bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-text-secondary bg-gray-50 border-gray-200';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg clinical-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {requirement?.product_name}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(requirement?.priority)}`}>
                {requirement?.priority}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(requirement?.status)}`}>
                {requirement?.status}
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              Client: <span className="font-medium text-foreground">{requirement?.client_name}</span>
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewMatches(requirement?.id)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {isExpanded ? 'Hide Matches' : 'View Matches'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Package" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Specifications</span>
            </div>
            <div className="text-sm">
              <p><span className="font-medium">API:</span> {requirement?.api_name}</p>
              <p><span className="font-medium">Dosage:</span> {requirement?.dosage_form}</p>
              <p><span className="font-medium">Strength:</span> {requirement?.strength}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Hash" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Quantity & Packaging</span>
            </div>
            <div className="text-sm">
              <p><span className="font-medium">Quantity:</span> {requirement?.quantity?.toLocaleString()} units</p>
              <p><span className="font-medium">Pack Size:</span> {requirement?.pack_size}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Timeline</span>
            </div>
            <div className="text-sm">
              <p><span className="font-medium">Required by:</span> {formatDate(requirement?.required_date)}</p>
              <p><span className="font-medium">Budget:</span> ${requirement?.budget_usd?.toLocaleString() || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {requirement?.notes && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-text-secondary">
              <span className="font-medium">Notes:</span> {requirement?.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementCard;