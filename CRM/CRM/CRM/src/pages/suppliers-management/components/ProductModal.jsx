import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ProductModal = ({ 
  isOpen, 
  onClose, 
  product, 
  supplierId,
  onSave,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    api_name: '',
    dosage_form: '',
    strength: '',
    pack_size: '',
    unit_price_usd: '',
    moq: '',
    lead_time_days: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const dosageFormOptions = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'injection', label: 'Injection' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'cream', label: 'Cream' },
    { value: 'drops', label: 'Drops' },
    { value: 'powder', label: 'Powder' },
    { value: 'ointment', label: 'Ointment' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        api_name: product?.api_name || '',
        dosage_form: product?.dosage_form || '',
        strength: product?.strength || '',
        pack_size: product?.pack_size || '',
        unit_price_usd: product?.unit_price_usd?.toString() || '',
        moq: product?.moq?.toString() || '',
        lead_time_days: product?.lead_time_days?.toString() || '',
        description: product?.description || ''
      });
    } else {
      setFormData({
        api_name: '',
        dosage_form: '',
        strength: '',
        pack_size: '',
        unit_price_usd: '',
        moq: '',
        lead_time_days: '',
        description: ''
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.api_name?.trim()) {
      newErrors.api_name = 'API name is required';
    }

    if (!formData?.dosage_form) {
      newErrors.dosage_form = 'Dosage form is required';
    }

    if (!formData?.strength?.trim()) {
      newErrors.strength = 'Strength is required';
    }

    if (!formData?.pack_size?.trim()) {
      newErrors.pack_size = 'Pack size is required';
    }

    if (!formData?.unit_price_usd?.trim()) {
      newErrors.unit_price_usd = 'Unit price is required';
    } else if (isNaN(parseFloat(formData?.unit_price_usd)) || parseFloat(formData?.unit_price_usd) <= 0) {
      newErrors.unit_price_usd = 'Please enter a valid price';
    }

    if (!formData?.moq?.trim()) {
      newErrors.moq = 'MOQ is required';
    } else if (isNaN(parseInt(formData?.moq)) || parseInt(formData?.moq) <= 0) {
      newErrors.moq = 'Please enter a valid MOQ';
    }

    if (!formData?.lead_time_days?.trim()) {
      newErrors.lead_time_days = 'Lead time is required';
    } else if (isNaN(parseInt(formData?.lead_time_days)) || parseInt(formData?.lead_time_days) < 0) {
      newErrors.lead_time_days = 'Please enter a valid lead time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const productData = {
        ...formData,
        supplier_id: supplierId,
        unit_price_usd: parseFloat(formData?.unit_price_usd),
        moq: parseInt(formData?.moq),
        lead_time_days: parseInt(formData?.lead_time_days)
      };
      onSave(productData);
    }
  };

  const handleClose = () => {
    setFormData({
      api_name: '',
      dosage_form: '',
      strength: '',
      pack_size: '',
      unit_price_usd: '',
      moq: '',
      lead_time_days: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={handleClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface clinical-shadow-lg rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              {product ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-muted transition-clinical"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="API Name"
                type="text"
                placeholder="Enter API name"
                value={formData?.api_name}
                onChange={(e) => handleInputChange('api_name', e?.target?.value)}
                error={errors?.api_name}
                required
              />
              <Select
                label="Dosage Form"
                options={dosageFormOptions}
                value={formData?.dosage_form}
                onChange={(value) => handleInputChange('dosage_form', value)}
                error={errors?.dosage_form}
                placeholder="Select dosage form"
                required
              />
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Strength"
                type="text"
                placeholder="e.g., 500mg, 10ml"
                value={formData?.strength}
                onChange={(e) => handleInputChange('strength', e?.target?.value)}
                error={errors?.strength}
                required
              />
              <Input
                label="Pack Size"
                type="text"
                placeholder="e.g., 10x10, 100ml bottle"
                value={formData?.pack_size}
                onChange={(e) => handleInputChange('pack_size', e?.target?.value)}
                error={errors?.pack_size}
                required
              />
            </div>

            {/* Pricing and Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Unit Price (USD)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData?.unit_price_usd}
                onChange={(e) => handleInputChange('unit_price_usd', e?.target?.value)}
                error={errors?.unit_price_usd}
                required
              />
              <Input
                label="MOQ (Minimum Order Quantity)"
                type="number"
                min="1"
                placeholder="Enter MOQ"
                value={formData?.moq}
                onChange={(e) => handleInputChange('moq', e?.target?.value)}
                error={errors?.moq}
                required
              />
              <Input
                label="Lead Time (Days)"
                type="number"
                min="0"
                placeholder="Enter lead time"
                value={formData?.lead_time_days}
                onChange={(e) => handleInputChange('lead_time_days', e?.target?.value)}
                error={errors?.lead_time_days}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter product description (optional)"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                loading={isLoading}
                iconName="Save"
                iconPosition="left"
              >
                {product ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;