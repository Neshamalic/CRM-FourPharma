import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

/**
 * IMPORTANT:
 * Supabase constraint allows ONLY:
 * 'lead' | 'negotiation' | 'contract' | 'closed'
 */
const STAGE_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'contract', label: 'Contract' },
  { value: 'closed', label: 'Closed' }
];

const CreateDealModal = ({ isOpen, onClose, match, requirement, onCreateDeal }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dealData, setDealData] = useState({
    title: '',
    stage: 'negotiation',
    quantity: 0,
    unit_price_usd: 0,
    value_usd: 0,
    close_date: '',
    notes: ''
  });

  /**
   * Initialize data when modal opens
   */
  useEffect(() => {
    if (!isOpen || !match || !requirement) return;

    const quantity = Number(requirement.quantity || 0);
    const unitPrice = Number(match.unit_price_usd || 0);

    setDealData({
      title: `${requirement.product_name} - ${match.supplier_name}`,
      stage: 'negotiation',
      quantity,
      unit_price_usd: unitPrice,
      value_usd: quantity * unitPrice,
      close_date: '',
      notes: `Deal created from intelligent matching.
Similarity Score: ${match.similarity_score ?? 'N/A'}%
Key advantages: ${match.key_differentiators?.join(', ') || 'N/A'}`
    });
  }, [isOpen, match, requirement]);

  /**
   * Handle input changes + auto-recalculate value
   */
  const handleInputChange = (field, value) => {
    setDealData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === 'quantity' || field === 'unit_price_usd') {
        const qty = field === 'quantity' ? Number(value) : Number(prev.quantity);
        const price = field === 'unit_price_usd' ? Number(value) : Number(prev.unit_price_usd);
        updated.value_usd = qty * price;
      }

      return updated;
    });
  };

  /**
   * Submit deal → Supabase
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        /* ===== Core deal ===== */
        title: dealData.title,
        stage: dealData.stage,
        status: dealData.stage === 'closed' ? 'closed' : 'open',
        priority: 'medium',

        quantity: Number(dealData.quantity),
        unit_price_usd: Number(dealData.unit_price_usd),
        value_usd: Number(dealData.value_usd),

        close_date: dealData.close_date || null,
        expected_close_date: dealData.close_date || null,
        notes: dealData.notes,

        /* ===== Relations ===== */
        client_id: requirement.client_id,
        supplier_id: match.supplier_id,
        product_id: match.product_id,
        client_requirement_id: requirement.id,

        /* ===== Snapshot (reporting) ===== */
        client_name: requirement.client_name,
        supplier_name: match.supplier_name,
        product_name: requirement.product_name,
        dosage_form: match.dosage_form || null,
        strength: match.strength || null,
        pack_size: match.pack_size || null,

        /* ===== Matching ===== */
        similarity_score: match.similarity_score,

        /* ===== Metadata ===== */
        source: 'intelligent_matching'
      };

      await onCreateDeal(payload);
      onClose();
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Error creating deal. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
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

        {/* Form */}
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
            options={STAGE_OPTIONS}
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

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows={4}
              className="w-full border border-border rounded-lg p-3"
              value={dealData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
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
