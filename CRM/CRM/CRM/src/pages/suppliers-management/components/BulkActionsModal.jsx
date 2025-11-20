import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActionsModal = ({ 
  isOpen, 
  onClose, 
  selectedSuppliers,
  onBulkAction,
  isLoading = false 
}) => {
  const [actionType, setActionType] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [confirmAction, setConfirmAction] = useState(false);

  const actionOptions = [
    { value: 'update_status', label: 'Update Status' },
    { value: 'export', label: 'Export Data' },
    { value: 'delete', label: 'Delete Suppliers' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!actionType || !confirmAction) return;

    const actionData = {
      type: actionType,
      supplierIds: selectedSuppliers,
      ...(actionType === 'update_status' && { status: statusValue })
    };

    onBulkAction(actionData);
  };

  const handleClose = () => {
    setActionType('');
    setStatusValue('');
    setConfirmAction(false);
    onClose();
  };

  const getActionDescription = () => {
    switch (actionType) {
      case 'update_status':
        return `Update the status of ${selectedSuppliers?.length} selected supplier(s) to "${statusOptions?.find(opt => opt?.value === statusValue)?.label || ''}"`;
      case 'export':
        return `Export data for ${selectedSuppliers?.length} selected supplier(s) to CSV format`;
      case 'delete':
        return `Permanently delete ${selectedSuppliers?.length} selected supplier(s) and all their associated products`;
      default:
        return '';
    }
  };

  const isActionDestructive = actionType === 'delete';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={handleClose}></div>

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface clinical-shadow-lg rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Bulk Actions
            </h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-muted transition-clinical"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Selected Count */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedSuppliers?.length} supplier(s) selected
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Action Selection */}
            <Select
              label="Select Action"
              options={actionOptions}
              value={actionType}
              onChange={setActionType}
              placeholder="Choose an action"
              required
            />

            {/* Status Selection (conditional) */}
            {actionType === 'update_status' && (
              <Select
                label="New Status"
                options={statusOptions}
                value={statusValue}
                onChange={setStatusValue}
                placeholder="Select new status"
                required
              />
            )}

            {/* Action Description */}
            {actionType && (
              <div className={`p-4 rounded-lg ${isActionDestructive ? 'bg-error bg-opacity-10 border border-error border-opacity-20' : 'bg-primary bg-opacity-10 border border-primary border-opacity-20'}`}>
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={isActionDestructive ? "AlertTriangle" : "Info"} 
                    size={20} 
                    className={isActionDestructive ? "text-error" : "text-primary"} 
                  />
                  <div>
                    <h4 className={`text-sm font-medium ${isActionDestructive ? 'text-error' : 'text-primary'} mb-1`}>
                      {isActionDestructive ? 'Warning' : 'Action Summary'}
                    </h4>
                    <p className="text-sm text-foreground">
                      {getActionDescription()}
                    </p>
                    {isActionDestructive && (
                      <p className="text-sm text-error mt-2">
                        This action cannot be undone.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation */}
            {actionType && (
              <Checkbox
                label={`I confirm that I want to ${actionType?.replace('_', ' ')} the selected suppliers`}
                checked={confirmAction}
                onChange={(e) => setConfirmAction(e?.target?.checked)}
                required
              />
            )}

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
                variant={isActionDestructive ? "destructive" : "default"}
                loading={isLoading}
                disabled={!actionType || !confirmAction || (actionType === 'update_status' && !statusValue)}
                iconName={actionType === 'export' ? "Download" : actionType === 'delete' ? "Trash2" : "Check"}
                iconPosition="left"
              >
                {actionType === 'export' ? 'Export' : 
                 actionType === 'delete' ? 'Delete' : 
                 actionType === 'update_status' ? 'Update Status' : 'Execute'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsModal;