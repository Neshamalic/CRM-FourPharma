import React, { useState, useEffect } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClientFormModal = ({
  isOpen,
  onClose,
  client,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    industry: '',
    company_size: '',
    status: 'active',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ];

  const companySizeOptions = [
    { value: 'startup', label: 'Startup (1-10 employees)' },
    { value: 'small', label: 'Small (11-50 employees)' },
    { value: 'medium', label: 'Medium (51-200 employees)' },
    { value: 'large', label: 'Large (201-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' },
  ];

  const industryOptions = [
    { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
    { value: 'biotechnology', label: 'Biotechnology' },
    { value: 'medical_devices', label: 'Medical Devices' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'research', label: 'Research & Development' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'distribution', label: 'Distribution' },
    { value: 'other', label: 'Other' },
  ];

  // Carga inicial del formulario (crear vs editar)
  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client?.company_name || '',
        contact_person: client?.contact_person || '',
        position: client?.position || '',
        email: client?.email || '',
        phone: client?.phone || '',
        address: client?.address || '',
        city: client?.city || '',
        state: client?.state || '',
        country: client?.country || '',
        postal_code: client?.postal_code || '',
        industry: client?.industry || '',
        company_size: client?.company_size || '',
        status: client?.status || 'active',
        notes: client?.notes || '',
      });
    } else {
      setFormData({
        company_name: '',
        contact_person: '',
        position: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        industry: '',
        company_size: '',
        status: 'active',
        notes: '',
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData?.industry) {
      newErrors.industry = 'Industry is required';
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
      // onSave se encarga de hacer insert/update en Supabase
      // y de cerrar el modal desde el componente padre
      await onSave(formData);
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-surface rounded-lg clinical-shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Company Name"
                  type="text"
                  value={formData?.company_name}
                  onChange={(e) =>
                    handleInputChange('company_name', e?.target?.value)
                  }
                  error={errors?.company_name}
                  required
                />
                <Select
                  label="Industry"
                  options={industryOptions}
                  value={formData?.industry}
                  onChange={(value) =>
                    handleInputChange('industry', value)
                  }
                  error={errors?.industry}
                  required
                />
                <Select
                  label="Company Size"
                  options={companySizeOptions}
                  value={formData?.company_size}
                  onChange={(value) =>
                    handleInputChange('company_size', value)
                  }
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  value={formData?.status}
                  onChange={(value) =>
                    handleInputChange('status', value)
                  }
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Person"
                  type="text"
                  value={formData?.contact_person}
                  onChange={(e) =>
                    handleInputChange('contact_person', e?.target?.value)
                  }
                  error={errors?.contact_person}
                  required
                />
                <Input
                  label="Position"
                  type="text"
                  value={formData?.position}
                  onChange={(e) =>
                    handleInputChange('position', e?.target?.value)
                  }
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData?.email}
                  onChange={(e) =>
                    handleInputChange('email', e?.target?.value)
                  }
                  error={errors?.email}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData?.phone}
                  onChange={(e) =>
                    handleInputChange('phone', e?.target?.value)
                  }
                  error={errors?.phone}
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Address Information
              </h3>
              <div className="space-y-4">
                <Input
                  label="Address"
                  type="text"
                  value={formData?.address}
                  onChange={(e) =>
                    handleInputChange('address', e?.target?.value)
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    type="text"
                    value={formData?.city}
                    onChange={(e) =>
                      handleInputChange('city', e?.target?.value)
                    }
                  />
                  <Input
                    label="State"
                    type="text"
                    value={formData?.state}
                    onChange={(e) =>
                      handleInputChange('state', e?.target?.value)
                    }
                  />
                  <Input
                    label="Country"
                    type="text"
                    value={formData?.country}
                    onChange={(e) =>
                      handleInputChange('country', e?.target?.value)
                    }
                  />
                </div>
                <Input
                  label="Postal Code"
                  type="text"
                  value={formData?.postal_code}
                  onChange={(e) =>
                    handleInputChange('postal_code', e?.target?.value)
                  }
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <h3 className="text-lg font-medium text-foreground mb-4">
                Additional Notes
              </h3>
              <textarea
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="4"
                placeholder="Add any additional notes about this client..."
                value={formData?.notes}
                onChange={(e) =>
                  handleInputChange('notes', e?.target?.value)
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-border">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              type="submit"
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              {client ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
