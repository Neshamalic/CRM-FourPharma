import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RequirementFormModal = ({ 
  isOpen, 
  onClose, 
  requirement, 
  clientId,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    product_name: '',
    api_name: '',
    dosage_form: '',
    strength: '',
    quantity: '',
    unit: '',
    budget_usd: '',
    deadline: '',
    priority: 'medium',
    status: 'open',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const dosageFormOptions = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'injection', label: 'Injection' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'cream', label: 'Cream' },
    { value: 'ointment', label: 'Ointment' },
    { value: 'drops', label: 'Drops' },
    { value: 'powder', label: 'Powder' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'other', label: 'Other' }
  ];

  const unitOptions = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'bottles', label: 'Bottles' },
    { value: 'vials', label: 'Vials' },
    { value: 'boxes', label: 'Boxes' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'grams', label: 'Grams' },
    { value: 'liters', label: 'Liters' },
    { value: 'ml', label: 'Milliliters' }
  ];

  useEffect(() => {
    if (requirement) {
      setFormData({
        product_name: requirement?.product_name || '',
        api_name: requirement?.api_name || '',
        dosage_form: requirement?.dosage_form || '',
        strength: requirement?.strength || '',
        quantity: requirement?.quantity?.toString() || '',
        unit: requirement?.unit || '',
        budget_usd: requirement?.budget_usd?.toString() || '',
        deadline: requirement?.deadline ? requirement?.deadline?.split('T')?.[0] : '',
        priority: requirement?.priority || 'medium',
        status: requirement?.status || 'open',
        notes: requirement?.notes || ''
      });
    } else {
      setFormData({
        product_name: '',
        api_name: '',
        dosage_form: '',
        strength: '',
        quantity: '',
        unit: '',
        budget_usd: '',
        deadline: '',
        priority: 'medium',
        status: 'open',
        notes: ''
      });
    }
    setErrors({});
  }, [requirement, isOpen]);

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

    if (!formData?.product_name?.trim()) {
      newErrors.product_name = 'Product name is required';
    }

    if (!formData?.api_name?.trim()) {
      newErrors.api_name = 'API name is required';
    }

    if (!formData?.dosage_form) {
      newErrors.dosage_form = 'Dosage form is required';
    }

    if (!formData?.strength?.trim()) {
      newErrors.strength = 'Strength is required';
    }

    if (!formData?.quantity || isNaN(formData?.quantity) || parseFloat(formData?.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }

    if (!formData?.unit) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData?.budget_usd || isNaN(formData?.budget_usd) || parseFloat(formData?.budget_usd) <= 0) {
      newErrors.budget_usd = 'Please enter a valid budget amount';
    }

    if (!formData?.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const requirementData = {
        ...formData,
        client_id: clientId,
        quantity: parseFloat(formData?.quantity),
        budget_usd: parseFloat(formData?.budget_usd),
        deadline: new Date(formData.deadline)?.toISOString()
      };
      
      await onSave(requirementData);
      onClose();
    } catch (error) {
      console.error('Error saving requirement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {requirement ? 'Edit Requirement' : 'Add New Requirement'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Product Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  type="text"
                  value={formData?.product_name}
                  onChange={(e) => handleInputChange('product_name', e?.target?.value)}
                  error={errors?.product_name}
                  required
                  placeholder="e.g., Paracetamol Tablets"
                />
                <Input
                  label="API Name"
                  type="text"
                  value={formData?.api_name}
                  onChange={(e) => handleInputChange('api_name', e?.target?.value)}
                  error={errors?.api_name}
                  required
                  placeholder="e.g., Paracetamol"
                />
                <Select
                  label="Dosage Form"
                  options={dosageFormOptions}
                  value={formData?.dosage_form}
                  onChange={(value) => handleInputChange('dosage_form', value)}
                  error={errors?.dosage_form}
                  required
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
              </div>
            </div>

            {/* Quantity & Budget */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Quantity & Budget</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Quantity"
                  type="number"
                  value={formData?.quantity}
                  onChange={(e) => handleInputChange('quantity', e?.target?.value)}
                  error={errors?.quantity}
                  required
                  min="1"
                  step="1"
                />
                <Select
                  label="Unit"
                  options={unitOptions}
                  value={formData?.unit}
                  onChange={(value) => handleInputChange('unit', value)}
                  error={errors?.unit}
                  required
                />
                <Input
                  label="Budget (USD)"
                  type="number"
                  value={formData?.budget_usd}
                  onChange={(e) => handleInputChange('budget_usd', e?.target?.value)}
                  error={errors?.budget_usd}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Timeline & Priority */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Timeline & Priority</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Deadline"
                  type="date"
                  value={formData?.deadline}
                  onChange={(e) => handleInputChange('deadline', e?.target?.value)}
                  error={errors?.deadline}
                  required
                />
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={formData?.priority}
                  onChange={(value) => handleInputChange('priority', value)}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) => handleInputChange('status', value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">Additional Notes</h3>
              <textarea
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="4"
                placeholder="Add any specific requirements, quality standards, or additional information..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
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
          >
            {requirement ? 'Update Requirement' : 'Create Requirement'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequirementFormModal;