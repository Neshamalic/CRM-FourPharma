import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductModal = ({
  isOpen,
  onClose,
  product,
  supplierId,
  onSave,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    supplier_id: '',
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

  useEffect(() => {
    if (product) {
      setFormData({
        supplier_id: product.supplier_id || supplierId || '',
        api_name: product.api_name || '',
        dosage_form: product.dosage_form || '',
        strength: product.strength || '',
        pack_size: product.pack_size || '',
        unit_price_usd:
          product.unit_price_usd !== null &&
          product.unit_price_usd !== undefined
            ? product.unit_price_usd
            : '',
        moq:
          product.moq !== null && product.moq !== undefined
            ? product.moq
            : '',
        lead_time_days:
          product.lead_time_days !== null &&
          product.lead_time_days !== undefined
            ? product.lead_time_days
            : '',
        description: product.description || ''
      });
    } else {
      setFormData({
        supplier_id: supplierId || '',
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
  }, [product, supplierId, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier_id) {
      newErrors.supplier_id = 'Supplier is required';
    }

    if (!formData.api_name.trim()) {
      newErrors.api_name = 'API name is required';
    }

    if (!formData.dosage_form.trim()) {
      newErrors.dosage_form = 'Dosage form is required';
    }

    if (!formData.strength.trim()) {
      newErrors.strength = 'Strength is required';
    }

    if (!formData.pack_size.trim()) {
      newErrors.pack_size = 'Pack size is required';
    }

    if (formData.unit_price_usd === '' || formData.unit_price_usd === null) {
      newErrors.unit_price_usd = 'Unit price is required';
    } else if (Number(formData.unit_price_usd) < 0) {
      newErrors.unit_price_usd = 'Unit price must be 0 or greater';
    }

    if (formData.moq !== '' && Number(formData.moq) < 0) {
      newErrors.moq = 'MOQ must be 0 or greater';
    }

    if (
      formData.lead_time_days !== '' &&
      Number(formData.lead_time_days) < 0
    ) {
      newErrors.lead_time_days = 'Lead time must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!validateForm()) return;

    // Normalizar numéricos
    const payload = {
      ...formData,
      supplier_id: formData.supplier_id || supplierId,
      unit_price_usd:
        formData.unit_price_usd === ''
          ? null
          : Number(formData.unit_price_usd),
      moq:
        formData.moq === '' || formData.moq === null
          ? null
          : Number(formData.moq),
      lead_time_days:
        formData.lead_time_days === '' ||
        formData.lead_time_days === null
          ? null
          : Number(formData.lead_time_days)
    };

    await onSave(payload);
  };

  if (!isOpen) return null;

  const supplierWarning =
    !supplierId && !formData.supplier_id
      ? 'You must select a supplier before adding products.'
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            disabled={isLoading}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-6">
            {supplierWarning && (
              <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm mb-2">
                {supplierWarning}
              </div>
            )}

            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Product Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="API Name"
                  type="text"
                  value={formData.api_name}
                  onChange={e =>
                    handleInputChange('api_name', e.target.value)
                  }
                  error={errors.api_name}
                  required
                />
                <Input
                  label="Dosage Form"
                  type="text"
                  value={formData.dosage_form}
                  onChange={e =>
                    handleInputChange('dosage_form', e.target.value)
                  }
                  error={errors.dosage_form}
                  required
                />
                <Input
                  label="Strength"
                  type="text"
                  value={formData.strength}
                  onChange={e =>
                    handleInputChange('strength', e.target.value)
                  }
                  error={errors.strength}
                  required
                />
                <Input
                  label="Pack Size"
                  type="text"
                  value={formData.pack_size}
                  onChange={e =>
                    handleInputChange('pack_size', e.target.value)
                  }
                  error={errors.pack_size}
                  required
                />
              </div>
            </div>

            {/* Commercial Info */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Commercial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Unit Price (USD)"
                  type="number"
                  step="0.01"
                  value={formData.unit_price_usd}
                  onChange={e =>
                    handleInputChange('unit_price_usd', e.target.value)
                  }
                  error={errors.unit_price_usd}
                  required
                />
                <Input
                  label="MOQ"
                  type="number"
                  value={formData.moq}
                  onChange={e =>
                    handleInputChange('moq', e.target.value)
                  }
                  error={errors.moq}
                />
                <Input
                  label="Lead Time (days)"
                  type="number"
                  value={formData.lead_time_days}
                  onChange={e =>
                    handleInputChange('lead_time_days', e.target.value)
                  }
                  error={errors.lead_time_days}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Description
              </h3>
              <textarea
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="4"
                placeholder="Add a short description for this product..."
                value={formData.description}
                onChange={e =>
                  handleInputChange('description', e.target.value)
                }
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            disabled={!!supplierWarning || isLoading}
          >
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
