import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MatchCard = ({ match, onCreateDeal }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success bg-green-50 border-green-200';
    if (score >= 75) return 'text-warning bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-error bg-red-50 border-red-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return 'CheckCircle2';
    if (score >= 75) return 'AlertCircle';
    if (score >= 60) return 'AlertTriangle';
    return 'XCircle';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  return (
    <div className="bg-surface border border-border rounded-lg clinical-shadow hover:clinical-shadow-lg transition-clinical">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h4 className="text-lg font-semibold text-foreground">
                {match?.supplier_name}
              </h4>
              <div className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getScoreColor(match?.similarity_score)}`}>
                <Icon name={getScoreIcon(match?.similarity_score)} size={12} />
                <span>{match?.similarity_score}% Match</span>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              {match?.supplier_location} • {match?.supplier_type}
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => onCreateDeal(match)}
            iconName="Plus"
            iconPosition="left"
          >
            Create Deal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">Product Details</h5>
              <div className="space-y-1 text-sm">
                <p><span className="text-text-secondary">Product:</span> {match?.product_name}</p>
                <p><span className="text-text-secondary">API:</span> {match?.api_name}</p>
                <p><span className="text-text-secondary">Dosage:</span> {match?.dosage_form}</p>
                <p><span className="text-text-secondary">Strength:</span> {match?.strength}</p>
                <p><span className="text-text-secondary">Pack Size:</span> {match?.pack_size}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-foreground mb-2">Commercial Terms</h5>
              <div className="space-y-1 text-sm">
                <p><span className="text-text-secondary">Unit Price:</span> {formatCurrency(match?.unit_price_usd)}</p>
                <p><span className="text-text-secondary">MOQ:</span> {match?.moq?.toLocaleString()} units</p>
                <p><span className="text-text-secondary">Lead Time:</span> {match?.lead_time_days} days</p>
                <p><span className="text-text-secondary">Available:</span> {match?.available_quantity?.toLocaleString()} units</p>
              </div>
            </div>
          </div>
        </div>

        {match?.key_differentiators && match?.key_differentiators?.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <h5 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Icon name="Star" size={14} className="mr-1" />
              Key Advantages
            </h5>
            <ul className="space-y-1">
              {match?.key_differentiators?.map((differentiator, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <Icon name="Check" size={12} className="mr-2 mt-0.5 text-blue-600" />
                  {differentiator}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>{match?.supplier_location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>Updated {match?.last_updated}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Eye">
              View Details
            </Button>
            <Button variant="ghost" size="sm" iconName="MessageSquare">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;