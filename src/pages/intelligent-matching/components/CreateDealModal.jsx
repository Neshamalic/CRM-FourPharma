import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateDealModal = ({ isOpen, onClose, match, requirement, onCreateDeal }) => {
  const [dealData, setDealData] = useState({
    deal_name: `${requirement?.product_name} - ${match?.supplier_name}`,
    stage: 'negotiation',
    value_usd: match?.unit_price_usd * requirement?.quantity || 0,
    quantity: requirement?.quantity || 0,
    unit_price_usd: match?.unit_price_usd || 0,
    expected_close_date: '',
    notes: `Deal created from intelligent matching.\nSimilarity Score: ${match?.similarity_score}%\nKey advantages: ${match?.key_differentiators?.join(', ') || 'N/A'}`
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' }
  ];

  const handleInputChange = (field, value) => {
    setDealData(prev => ({
      ...prev,
      [field]: value
    }));

    // Recalculate total value when quantity or unit price changes
    if (field === 'quantity' || field === 'unit_price_usd') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : dealData?.quantity;
      const unitPrice = field === 'unit_price_usd' ? parseFloat(value) || 0 : dealData?.unit_price_usd;
      setDealData(prev => ({
        ...prev,
        value_usd: quantity * unitPrice
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const newDeal = {
        id: `deal_${Date.now()}`,
        ...dealData,
        client_id: requirement?.client_id,
        supplier_id: match?.supplier_id,
        product_id: match?.product_id,
        requirement_id: requirement?.id,
        match_score: match?.similarity_score,
        created_date: new Date()?.toISOString(),
        last_updated: new Date()?.toISOString()
      };

      await onCreateDeal(newDeal);
      onClose();
    } catch (error) {
      console.error('Error creating deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Create New Deal</h2>
              <p className="text-sm text-text-secondary mt-1">
                Creating deal from {match?.similarity_score}% match
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-clinical"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Match Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Match Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="text-blue-700">Client:</span> {requirement?.client_name}</p>
                <p><span className="text-blue-700">Product:</span> {requirement?.product_name}</p>
                <p><span className="text-blue-700">Required Qty:</span> {requirement?.quantity?.toLocaleString()} units</p>
              </div>
              <div>
                <p><span className="text-blue-700">Supplier:</span> {match?.supplier_name}</p>
                <p><span className="text-blue-700">Unit Price:</span> {formatCurrency(match?.unit_price_usd)}</p>
                <p><span className="text-blue-700">Match Score:</span> {match?.similarity_score}%</p>
              </div>
            </div>
          </div>

          {/* Deal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Deal Name"
              type="text"
              required
              value={dealData?.deal_name}
              onChange={(e) => handleInputChange('deal_name', e?.target?.value)}
              placeholder="Enter deal name"
            />

            <Select
              label="Stage"
              required
              options={stageOptions}
              value={dealData?.stage}
              onChange={(value) => handleInputChange('stage', value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Quantity"
              type="number"
              required
              value={dealData?.quantity}
              onChange={(e) => handleInputChange('quantity', e?.target?.value)}
              placeholder="Enter quantity"
            />

            <Input
              label="Unit Price (USD)"
              type="number"
              step="0.01"
              required
              value={dealData?.unit_price_usd}
              onChange={(e) => handleInputChange('unit_price_usd', e?.target?.value)}
              placeholder="Enter unit price"
            />

            <Input
              label="Total Value (USD)"
              type="number"
              step="0.01"
              value={dealData?.value_usd}
              onChange={(e) => handleInputChange('value_usd', e?.target?.value)}
              placeholder="Calculated automatically"
              description={`Total: ${formatCurrency(dealData?.value_usd)}`}
            />
          </div>

          <Input
            label="Expected Close Date"
            type="date"
            value={dealData?.expected_close_date}
            onChange={(e) => handleInputChange('expected_close_date', e?.target?.value)}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes
            </label>
            <textarea
              rows={4}
              value={dealData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Add any additional notes about this deal..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              iconName="Plus"
              iconPosition="left"
            >
              Create Deal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDealModal;
