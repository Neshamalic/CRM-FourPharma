import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SupplierModal = ({
  isOpen,
  onClose,
  supplier,
  onSave,
  isLoading
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
    { value: 'pending', label: 'Pending' },
    { value: 'blocked', label: 'Blocked' }
  ];

  useEffect(() => {
    if (supplier) {
      setFormData({
        company_name: supplier.company_name || '',
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        location: supplier.location || '',
        status: supplier.status || 'active',
        website: supplier.website || '',
        notes: supplier.notes || ''
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

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required';
    }

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e?.preventDefault();
    if (!validateForm()) return;

    // onSave viene del parent (index.jsx) y maneja Supabase
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
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
            {/* Supplier Info */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Supplier Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  type="text"
                  value={formData.company_name}
                  onChange={e =>
                    handleInputChange('company_name', e.target.value)
                  }
                  error={errors.company_name}
                  required
                />
                <Input
                  label="Location (Country / City)"
                  type="text"
                  value={formData.location}
                  onChange={e =>
                    handleInputChange('location', e.target.value)
                  }
                  error={errors.location}
                  required
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={value => handleInputChange('status', value)}
                  error={errors.status}
                  required
                />
                <Input
                  label="Website"
                  type="url"
                  value={formData.website}
                  onChange={e =>
                    handleInputChange('website', e.target.value)
                  }
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Person"
                  type="text"
                  value={formData.contact_person}
                  onChange={e =>
                    handleInputChange('contact_person', e.target.value)
                  }
                  error={errors.contact_person}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    handleInputChange('email', e.target.value)
                  }
                  error={errors.email}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e =>
                    handleInputChange('phone', e.target.value)
                  }
                  error={errors.phone}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Notes
              </h3>
              <textarea
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="4"
                placeholder="Add any additional notes about this supplier..."
                value={formData.notes}
                onChange={e =>
                  handleInputChange('notes', e.target.value)
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
          >
            {supplier ? 'Update Supplier' : 'Create Supplier'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupplierModal;
