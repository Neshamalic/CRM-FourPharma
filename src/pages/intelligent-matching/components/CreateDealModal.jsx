import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const STAGE_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'contract', label: 'Contract' },
  { value: 'closed', label: 'Closed' }
];

const CreateDealModal = ({ isOpen, onClose, match, requirement, onCreateDeal }) => {
  const [dealData, setDealData] = useState({
    title: '',
    stage: 'negotiation',
    quantity: 0,
    unit_price_usd: 0,
    total_value_usd: 0,
    close_date: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /** Inicializar datos cuando se abre el modal */
  useEffect(() => {
    if (!isOpen || !match || !requirement) return;

    const quantity = Number(requirement.quantity) || 0;
    const unitPrice = Number(match.unit_price_usd) || 0;

    setDealData({
      title: `${requirement.product_name} - ${match.supplier_name}`,
      stage: 'negotiation',
      quantity,
      unit_price_usd: unitPrice,
      total_value_usd: quantity * unitPrice,
      close_date: '',
      notes: `Deal created from intelligent matching.
Similarity Score: ${match.similarity_score ?? 'N/A'}%
Key advantages: ${match.key_differentiators?.join(', ') || 'N/A'}`
    });
  }, [isOpen, match, requirement]);

  /** Manejo de cambios */
  const handleChange = (field, value) => {
    setDealData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'quantity' || field === 'unit_price_usd') {
        const qty = field === 'quantity' ? Number(value) : prev.quantity;
        const price = field === 'unit_price_usd' ? Number(value) : prev.unit_price_usd;
        updated.total_value_usd = qty * price;
      }

      return updated;
    });
  };

  /** Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: dealData.title,
        stage: dealData.stage.toLowerCase(), // 🔒 CRÍTICO PARA EL CHECK
        status: dealData.stage === 'closed' ? 'closed' : 'open',

        quantity: Number(dealData.quantity),
        unit_price_usd: Number(dealData.unit_price_usd),
        deal_value: Number(dealData.total_value_usd),
        currency: 'USD',

        close_date: dealData.close_date || null,
        notes: dealData.notes,
        source: 'intelligent_matching',
        similarity_score: match?.similarity_score ?? null,

        client_id: requirement.client_id,
        supplier_id: match.supplier_id,
        product_id: match.product_id,
        client_requirement_id: requirement.id
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Create New Deal</h2>
            <p className="text-sm text-text-secondary">
              Created from {match?.similarity_score}% match
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <Input
            label="Deal Name"
            required
            value={dealData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />

          <Select
            label="Stage"
            required
            options={STAGE_OPTIONS}
            value={dealData.stage}
            onChange={(value) => handleChange('stage', value)}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Quantity"
              type="number"
              required
              value={dealData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
            />

            <Input
              label="Unit Price (USD)"
              type="number"
              step="0.01"
              required
              value={dealData.unit_price_usd}
              onChange={(e) => handleChange('unit_price_usd', e.target.value)}
            />

            <Input
              label="Total Value (USD)"
              value={dealData.total_value_usd}
              disabled
            />
          </div>

          <Input
            label="Expected Close Date"
            type="date"
            value={dealData.close_date}
            onChange={(e) => handleChange('close_date', e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              rows={4}
              className="w-full border border-border rounded-lg p-3"
              value={dealData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
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
