import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const OrderForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    client_id: '',
    supplier_id: '',
    product_name: '',
    api_name: '',
    dosage_form: '',
    strength: '',
    pack_size: '',
    units: '',
    unit_price_usd: '',
    other_costs_usd: '0',
    commission_rate: '0.05',
    notes: '',
    expected_delivery_date: ''
  });

  const [calculations, setCalculations] = useState({
    base_amount_usd: 0,
    commission_usd: 0,
    total_amount_usd: 0
  });

  const [errors, setErrors] = useState({});

  // Mock data for dropdowns
  const clients = [
    { value: 'client-1', label: 'MedCorp Pharmaceuticals' },
    { value: 'client-2', label: 'HealthFirst Distribution' },
    { value: 'client-3', label: 'Global Medical Supply' },
    { value: 'client-4', label: 'PharmaTech Solutions' }
  ];

  const suppliers = [
    { value: 'supplier-1', label: 'Apex Pharma Manufacturing' },
    { value: 'supplier-2', label: 'BioMed Industries Ltd' },
    { value: 'supplier-3', label: 'ChemCore Laboratories' },
    { value: 'supplier-4', label: 'DrugSource International' }
  ];

  const dosageForms = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'injection', label: 'Injection' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'cream', label: 'Cream' },
    { value: 'ointment', label: 'Ointment' }
  ];

  // Calculate amounts when relevant fields change
  useEffect(() => {
    const units = parseFloat(formData?.units) || 0;
    const unitPrice = parseFloat(formData?.unit_price_usd) || 0;
    const otherCosts = parseFloat(formData?.other_costs_usd) || 0;
    const commissionRate = parseFloat(formData?.commission_rate) || 0;

    const baseAmount = (units * unitPrice) + otherCosts;
    const commission = baseAmount * commissionRate;
    const totalAmount = baseAmount + commission;

    setCalculations({
      base_amount_usd: baseAmount,
      commission_usd: commission,
      total_amount_usd: totalAmount
    });
  }, [formData?.units, formData?.unit_price_usd, formData?.other_costs_usd, formData?.commission_rate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.client_id) newErrors.client_id = 'Client is required';
    if (!formData?.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData?.product_name) newErrors.product_name = 'Product name is required';
    if (!formData?.api_name) newErrors.api_name = 'API name is required';
    if (!formData?.dosage_form) newErrors.dosage_form = 'Dosage form is required';
    if (!formData?.strength) newErrors.strength = 'Strength is required';
    if (!formData?.pack_size) newErrors.pack_size = 'Pack size is required';
    if (!formData?.units || parseFloat(formData?.units) <= 0) {
      newErrors.units = 'Units must be greater than 0';
    }
    if (!formData?.unit_price_usd || parseFloat(formData?.unit_price_usd) <= 0) {
      newErrors.unit_price_usd = 'Unit price must be greater than 0';
    }
    if (!formData?.expected_delivery_date) {
      newErrors.expected_delivery_date = 'Expected delivery date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const orderData = {
        ...formData,
        ...calculations,
        order_number: `PO-${Date.now()}`,
        status: 'pending',
        created_at: new Date()?.toISOString()
      };
      
      onSubmit(orderData);
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      supplier_id: '',
      product_name: '',
      api_name: '',
      dosage_form: '',
      strength: '',
      pack_size: '',
      units: '',
      unit_price_usd: '',
      other_costs_usd: '0',
      commission_rate: '0.05',
      notes: '',
      expected_delivery_date: ''
    });
    setErrors({});
  };

  return (
    <div className="bg-surface rounded-lg clinical-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="ShoppingCart" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create Purchase Order</h2>
            <p className="text-sm text-text-secondary">Fill in the details to create a new purchase order</p>
          </div>
        </div>
        <Button variant="outline" onClick={resetForm} iconName="RotateCcw" iconPosition="left">
          Reset Form
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Party Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Party Information
            </h3>
            <Select
              label="Client"
              options={clients}
              value={formData?.client_id}
              onChange={(value) => handleInputChange('client_id', value)}
              error={errors?.client_id}
              required
              searchable
              placeholder="Select client"
            />
            <Select
              label="Supplier"
              options={suppliers}
              value={formData?.supplier_id}
              onChange={(value) => handleInputChange('supplier_id', value)}
              error={errors?.supplier_id}
              required
              searchable
              placeholder="Select supplier"
            />
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Product Information
            </h3>
            <Input
              label="Product Name"
              type="text"
              value={formData?.product_name}
              onChange={(e) => handleInputChange('product_name', e?.target?.value)}
              error={errors?.product_name}
              required
              placeholder="Enter product name"
            />
            <Input
              label="API Name"
              type="text"
              value={formData?.api_name}
              onChange={(e) => handleInputChange('api_name', e?.target?.value)}
              error={errors?.api_name}
              required
              placeholder="Enter API name"
            />
          </div>
        </div>

        {/* Product Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Dosage Form"
            options={dosageForms}
            value={formData?.dosage_form}
            onChange={(value) => handleInputChange('dosage_form', value)}
            error={errors?.dosage_form}
            required
            placeholder="Select dosage form"
          />
          <Input
            label="Strength"
            type="text"
            value={formData?.strength}
            onChange={(e) => handleInputChange('strength', e?.target?.value)}
            error={errors?.strength}
            required
            placeholder="e.g., 500mg"
          />
          <Input
            label="Pack Size"
            type="text"
            value={formData?.pack_size}
            onChange={(e) => handleInputChange('pack_size', e?.target?.value)}
            error={errors?.pack_size}
            required
            placeholder="e.g., 10x10 strips"
          />
        </div>

        {/* Pricing Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
            Pricing & Calculations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Units"
              type="number"
              value={formData?.units}
              onChange={(e) => handleInputChange('units', e?.target?.value)}
              error={errors?.units}
              required
              placeholder="Enter quantity"
              min="1"
            />
            <Input
              label="Unit Price (USD)"
              type="number"
              value={formData?.unit_price_usd}
              onChange={(e) => handleInputChange('unit_price_usd', e?.target?.value)}
              error={errors?.unit_price_usd}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <Input
              label="Other Costs (USD)"
              type="number"
              value={formData?.other_costs_usd}
              onChange={(e) => handleInputChange('other_costs_usd', e?.target?.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              description="Shipping, handling, etc."
            />
            <Input
              label="Commission Rate"
              type="number"
              value={formData?.commission_rate}
              onChange={(e) => handleInputChange('commission_rate', e?.target?.value)}
              placeholder="0.05"
              min="0"
              max="1"
              step="0.01"
              description="Default: 5% (0.05)"
            />
          </div>

          {/* Calculation Display */}
          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Automatic Calculations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  ${calculations?.base_amount_usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-text-secondary">Base Amount</div>
                <div className="text-xs text-text-secondary mt-1">
                  (Units × Unit Price + Other Costs)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  ${calculations?.commission_usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-text-secondary">Commission</div>
                <div className="text-xs text-text-secondary mt-1">
                  (Base Amount × Rate)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  ${calculations?.total_amount_usd?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-text-secondary">Total Amount</div>
                <div className="text-xs text-text-secondary mt-1">
                  (Base + Commission)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Input
            label="Expected Delivery Date"
            type="date"
            value={formData?.expected_delivery_date}
            onChange={(e) => handleInputChange('expected_delivery_date', e?.target?.value)}
            error={errors?.expected_delivery_date}
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Notes
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
              placeholder="Additional notes or requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button variant="outline" type="button" onClick={resetForm}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={isLoading}
            iconName="Plus" 
            iconPosition="left"
          >
            Create Purchase Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;