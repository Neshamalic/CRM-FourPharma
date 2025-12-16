import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const normalizeStage = (stage) =>
  stage?.toLowerCase()?.replace(/\s+/g, '_');

const CreateDealModal = ({ isOpen, onClose, match, requirement, onCreateDeal }) => {
  const [dealData, setDealData] = useState({
    title: `${requirement?.product_name} - ${match?.supplier_name}`,
    stage: 'negotiation',
    quantity: requirement?.quantity || 0,
    unit_price_usd: match?.unit_price_usd || 0,
    value_usd: (match?.unit_price_usd || 0) * (requirement?.quantity || 0),
    close_date: '',
    notes: `Deal created from intelligent matching.
Similarity Score: ${match?.similarity_score ?? 'N/A'}%
Key advantages: ${match?.key_differentiators?.join(', ') || 'N/A'}`
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const stageOptions = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'contract', label: 'Contract' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' }
  ];

  const handleInputChange = (field, value) => {
    setDealData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'quantity' || field === 'unit_price_usd') {
        const qty = field === 'quantity' ? Number(value) : prev.quantity;
        const price = field === 'unit_price_usd' ? Number(value) : prev.unit_price_usd;
        updated.value_usd = qty * price;
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: dealData.title,
        stage: normalizeStage(dealData.stage),
        quantity: Number(dealData.quantity),
        unit_price_usd: Number(dealData.unit_price_usd),
        total_value_usd: Number(dealData.value_usd),
        close_date: dealData.close_date || null,
        notes: dealData.notes,

        client_id: requirement?.client_id,
        supplier_id: match?.supplier_id,
        product_id: match?.product_id,
        client_requirement_id: requirement?.id,
        match_score: match?.similarity_score
      };

      await onCreateDeal(payload);
      onClose();
    } catch (error) {
      console.error('Error creating deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Deal</h2>
            <p className="text-sm text-text-secondary">
              Creating deal from {match?.similarity_score}% match
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Deal Name"
            required
            value={dealData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />

          <Select
            label="Stage"
            required
            options={stageOptions}
            value={dealData.stage}
            onChange={(value) => handleInputChange('stage', value)}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Quantity"
              type="number"
              required
              value={dealData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
            />
            <Input
              label="Unit Price (USD)"
              type="number"
              step="0.01"
              required
              value={dealData.unit_price_usd}
              onChange={(e) => handleInputChange('unit_price_usd', e.target.value)}
            />
            <Input
              label="Total Value (USD)"
              value={dealData.value_usd}
              disabled
            />
          </div>

          <Input
            label="Expected Close Date"
            type="date"
            value={dealData.close_date}
            onChange={(e) => handleInputChange('close_date', e.target.value)}
          />

          <textarea
            rows={4}
            className="w-full border border-border rounded-lg p-3"
            value={dealData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} iconName="Plus">
              Create Deal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDealModal;
