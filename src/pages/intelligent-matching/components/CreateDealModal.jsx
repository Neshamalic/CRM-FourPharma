import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateDealModal = ({ isOpen, onClose, match, requirement, onCreateDeal }) => {
  const stageOptions = useMemo(
    () => [
      { value: 'Lead', label: 'Lead' },
      { value: 'Negotiation', label: 'Negotiation' },
      { value: 'Contract', label: 'Contract' },
      { value: 'Closed', label: 'Closed' }
    ],
    []
  );

  const computedDefaultValue = useMemo(() => {
    const unit = Number(match?.unit_price_usd ?? 0);
    const qty = Number(requirement?.quantity ?? 0);
    const total = unit * qty;
    return Number.isFinite(total) ? total : 0;
  }, [match, requirement]);

  const [formValues, setFormValues] = useState({
    title: '',
    stage: 'Negotiation',
    dealValue: 0,
    probability: 60,
    expectedCloseDate: '',
    internalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Reset del formulario cada vez que abres el modal o cambia el match/requirement
  useEffect(() => {
    if (!isOpen) return;

    const productName = requirement?.product_name || requirement?.api_name || 'Product';
    const supplierName = match?.supplier_name || 'Supplier';

    setFormValues({
      title: `${productName} - ${supplierName}`,
      stage: 'Negotiation',
      dealValue: computedDefaultValue,
      probability: 60,
      expectedCloseDate: '',
      internalNotes: `Deal created from intelligent matching.
Similarity Score: ${match?.similarity_score ?? 'N/A'}%
Key advantages: ${(match?.key_differentiators || [])?.join(', ') || 'N/A'}`
    });

    setErrors({});
    setIsSaving(false);
  }, [isOpen, match, requirement, computedDefaultValue]);

  const setField = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formValues?.title?.trim()) nextErrors.title = 'Title is required';

    if (!formValues?.stage) nextErrors.stage = 'Stage is required';

    const dealValueNum = Number(formValues?.dealValue);
    if (!Number.isFinite(dealValueNum) || dealValueNum <= 0) {
      nextErrors.dealValue = 'Deal value must be greater than 0';
    }

    const probNum = Number(formValues?.probability);
    if (!Number.isFinite(probNum) || probNum < 0 || probNum > 100) {
      nextErrors.probability = 'Probability must be between 0 and 100';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validate()) return;
    if (!onCreateDeal) return;

    setIsSaving(true);
    try {
      // IMPORTANTE: estos nombres de campos son los que espera handleDealCreated()
      await onCreateDeal({
        title: formValues.title.trim(),
        stage: formValues.stage,
        dealValue: Number(formValues.dealValue),
        probability: Number(formValues.probability),
        expectedCloseDate: formValues.expectedCloseDate || null,
        internalNotes: formValues.internalNotes || ''
      });
      // El padre (IntelligentMatching) ya cierra el modal en success
    } catch (err) {
      console.error('CreateDealModal submit error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create Deal</h2>
            <p className="text-sm text-text-secondary mt-1">
              From match: <span className="font-medium">{match?.supplier_name || '—'}</span>
            </p>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input
            label="Title"
            value={formValues.title}
            onChange={(e) => setField('title', e?.target?.value)}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Stage"
              options={stageOptions}
              value={formValues.stage}
              onChange={(v) => setField('stage', v)}
              error={errors.stage}
              required
            />

            <Input
              label="Probability (%)"
              type="number"
              min="0"
              max="100"
              value={formValues.probability}
              onChange={(e) => setField('probability', e?.target?.value)}
              error={errors.probability}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Deal Value (USD)"
              type="number"
              min="0"
              step="0.01"
              value={formValues.dealValue}
              onChange={(e) => setField('dealValue', e?.target?.value)}
              error={errors.dealValue}
              required
            />

            <Input
              label="Expected Close Date"
              type="date"
              value={formValues.expectedCloseDate || ''}
              onChange={(e) => setField('expectedCloseDate', e?.target?.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Internal Notes
            </label>
            <textarea
              className="w-full min-h-[110px] p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              value={formValues.internalNotes}
              onChange={(e) => setField('internalNotes', e?.target?.value)}
              placeholder="Notes for internal tracking..."
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              loading={isSaving}
              iconName="Save"
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
