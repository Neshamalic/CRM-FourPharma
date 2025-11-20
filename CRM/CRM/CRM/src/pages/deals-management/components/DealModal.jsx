import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DealModal = ({ isOpen, onClose, deal, onSave, mode = 'view', userRole = 'editor' }) => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_contact: '',
    supplier_name: '',
    supplier_contact: '',
    product_name: '',
    dosage_form: '',
    strength: '',
    pack_size: '',
    deal_value: '',
    commission_rate: 0.05,
    stage: 'Lead',
    priority: 'Medium',
    expected_close_date: '',
    next_action: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const stageOptions = [
    { value: 'Lead', label: 'Lead' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Closed', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: 'High', label: 'High Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'Low', label: 'Low Priority' }
  ];

  useEffect(() => {
    if (deal) {
      setFormData({
        client_name: deal?.client_name || '',
        client_contact: deal?.client_contact || '',
        supplier_name: deal?.supplier_name || '',
        supplier_contact: deal?.supplier_contact || '',
        product_name: deal?.product_name || '',
        dosage_form: deal?.dosage_form || '',
        strength: deal?.strength || '',
        pack_size: deal?.pack_size || '',
        deal_value: deal?.deal_value || '',
        commission_rate: deal?.commission_rate || 0.05,
        stage: deal?.stage || 'Lead',
        priority: deal?.priority || 'Medium',
        expected_close_date: deal?.expected_close_date ? deal?.expected_close_date?.split('T')?.[0] : '',
        next_action: deal?.next_action || '',
        notes: deal?.notes || ''
      });
    } else {
      setFormData({
        client_name: '',
        client_contact: '',
        supplier_name: '',
        supplier_contact: '',
        product_name: '',
        dosage_form: '',
        strength: '',
        pack_size: '',
        deal_value: '',
        commission_rate: 0.05,
        stage: 'Lead',
        priority: 'Medium',
        expected_close_date: '',
        next_action: '',
        notes: ''
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.client_name?.trim()) {
      newErrors.client_name = 'Client name is required';
    }
    if (!formData?.supplier_name?.trim()) {
      newErrors.supplier_name = 'Supplier name is required';
    }
    if (!formData?.product_name?.trim()) {
      newErrors.product_name = 'Product name is required';
    }
    if (!formData?.deal_value || formData?.deal_value <= 0) {
      newErrors.deal_value = 'Deal value must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const dealData = {
        ...formData,
        deal_value: parseFloat(formData?.deal_value),
        commission_rate: parseFloat(formData?.commission_rate),
        expected_close_date: formData?.expected_close_date || null
      };

      await onSave(dealData);
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const calculateCommission = () => {
    const value = parseFloat(formData?.deal_value) || 0;
    const rate = parseFloat(formData?.commission_rate) || 0;
    return value * rate;
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view' || userRole === 'viewer';
  const modalTitle = mode === 'create' ? 'Create New Deal' : mode === 'edit' ? 'Edit Deal' : 'Deal Details';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-clinical"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client & Supplier Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Client Information</h3>
                <Input
                  label="Client Name"
                  type="text"
                  value={formData?.client_name}
                  onChange={(e) => handleInputChange('client_name', e?.target?.value)}
                  error={errors?.client_name}
                  disabled={isReadOnly}
                  required
                />
                <Input
                  label="Client Contact"
                  type="text"
                  value={formData?.client_contact}
                  onChange={(e) => handleInputChange('client_contact', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="Email or phone"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Supplier Information</h3>
                <Input
                  label="Supplier Name"
                  type="text"
                  value={formData?.supplier_name}
                  onChange={(e) => handleInputChange('supplier_name', e?.target?.value)}
                  error={errors?.supplier_name}
                  disabled={isReadOnly}
                  required
                />
                <Input
                  label="Supplier Contact"
                  type="text"
                  value={formData?.supplier_contact}
                  onChange={(e) => handleInputChange('supplier_contact', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="Email or phone"
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  type="text"
                  value={formData?.product_name}
                  onChange={(e) => handleInputChange('product_name', e?.target?.value)}
                  error={errors?.product_name}
                  disabled={isReadOnly}
                  required
                />
                <Input
                  label="Dosage Form"
                  type="text"
                  value={formData?.dosage_form}
                  onChange={(e) => handleInputChange('dosage_form', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., Tablet, Capsule"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Strength"
                  type="text"
                  value={formData?.strength}
                  onChange={(e) => handleInputChange('strength', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., 500mg"
                />
                <Input
                  label="Pack Size"
                  type="text"
                  value={formData?.pack_size}
                  onChange={(e) => handleInputChange('pack_size', e?.target?.value)}
                  disabled={isReadOnly}
                  placeholder="e.g., 100 tablets"
                />
              </div>
            </div>

            {/* Deal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Deal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Deal Value (USD)"
                  type="number"
                  value={formData?.deal_value}
                  onChange={(e) => handleInputChange('deal_value', e?.target?.value)}
                  error={errors?.deal_value}
                  disabled={isReadOnly}
                  required
                  min="0"
                  step="0.01"
                />
                <Input
                  label="Commission Rate"
                  type="number"
                  value={formData?.commission_rate}
                  onChange={(e) => handleInputChange('commission_rate', e?.target?.value)}
                  disabled={isReadOnly}
                  min="0"
                  max="1"
                  step="0.001"
                  description="Decimal format (0.05 = 5%)"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Estimated Commission
                  </label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="text-lg font-semibold text-accent">
                      {formatCurrency(calculateCommission())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Status & Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Stage"
                  options={stageOptions}
                  value={formData?.stage}
                  onChange={(value) => handleInputChange('stage', value)}
                  disabled={isReadOnly}
                />
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={formData?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                  disabled={isReadOnly}
                />
                <Input
                  label="Expected Close Date"
                  type="date"
                  value={formData?.expected_close_date}
                  onChange={(e) => handleInputChange('expected_close_date', e?.target?.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Additional Information</h3>
              <Input
                label="Next Action"
                type="text"
                value={formData?.next_action}
                onChange={(e) => handleInputChange('next_action', e?.target?.value)}
                disabled={isReadOnly}
                placeholder="What's the next step?"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Notes
                </label>
                <textarea
                  value={formData?.notes}
                  onChange={(e) => handleInputChange('notes', e?.target?.value)}
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
                  placeholder="Additional notes about this deal..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {mode === 'create' ? 'Create Deal' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealModal;