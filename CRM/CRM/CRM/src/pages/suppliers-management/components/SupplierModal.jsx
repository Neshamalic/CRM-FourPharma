import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SupplierModal = ({ 
  isOpen, 
  onClose, 
  supplier, 
  onSave,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    location: '',
    status: 'active',
    website: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  useEffect(() => {
    if (supplier) {
      setFormData({
        company_name: supplier?.company_name || '',
        contact_person: supplier?.contact_person || '',
        email: supplier?.email || '',
        phone: supplier?.phone || '',
        location: supplier?.location || '',
        status: supplier?.status || 'active',
        website: supplier?.website || '',
        notes: supplier?.notes || ''
      });
    } else {
      setFormData({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        location: '',
        status: 'active',
        website: '',
        notes: ''
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.company_name?.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData?.contact_person?.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData?.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      location: '',
      status: 'active',
      website: '',
      notes: ''
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
              {supplier ? 'Edit Supplier' : 'Add New Supplier'}
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                type="text"
                placeholder="Enter company name"
                value={formData?.company_name}
                onChange={(e) => handleInputChange('company_name', e?.target?.value)}
                error={errors?.company_name}
                required
              />
              <Input
                label="Contact Person"
                type="text"
                placeholder="Enter contact person name"
                value={formData?.contact_person}
                onChange={(e) => handleInputChange('contact_person', e?.target?.value)}
                error={errors?.contact_person}
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter phone number"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
              />
            </div>

            {/* Location and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                type="text"
                placeholder="Enter location"
                value={formData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                error={errors?.location}
                required
              />
              <Select
                label="Status"
                options={statusOptions}
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                required
              />
            </div>

            {/* Website */}
            <Input
              label="Website"
              type="url"
              placeholder="Enter website URL (optional)"
              value={formData?.website}
              onChange={(e) => handleInputChange('website', e?.target?.value)}
              error={errors?.website}
            />

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                rows={4}
                placeholder="Enter additional notes (optional)"
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
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
                {supplier ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;