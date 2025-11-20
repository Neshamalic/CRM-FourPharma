import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClientRequirements = ({ 
  client, 
  requirements, 
  onEditRequirement, 
  onDeleteRequirement, 
  onNavigateToMatching,
  userRole = 'editor' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'fulfilled', label: 'Fulfilled' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const filteredRequirements = requirements?.filter(req => {
    const matchesSearch = req?.product_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         req?.api_name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { color: 'bg-primary text-primary-foreground', label: 'Open' },
      in_progress: { color: 'bg-warning text-warning-foreground', label: 'In Progress' },
      fulfilled: { color: 'bg-success text-success-foreground', label: 'Fulfilled' },
      cancelled: { color: 'bg-destructive text-destructive-foreground', label: 'Cancelled' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.open;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { color: 'bg-destructive text-destructive-foreground', label: 'High' },
      medium: { color: 'bg-warning text-warning-foreground', label: 'Medium' },
      low: { color: 'bg-muted text-muted-foreground', label: 'Low' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  if (!client) {
    return (
      <div className="bg-surface rounded-lg clinical-shadow p-12 text-center">
        <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Select a Client</h3>
        <p className="text-text-secondary">
          Choose a client from the table to view their requirements and manage procurement needs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg clinical-shadow">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{client?.company_name}</h2>
              <p className="text-text-secondary">{client?.contact_person} • {client?.email}</p>
            </div>
          </div>
          {userRole === 'editor' && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onEditRequirement(null)}
            >
              Add Requirement
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
            className="w-40"
          />
        </div>
      </div>
      {/* Requirements List */}
      <div className="p-6">
        {filteredRequirements?.length > 0 ? (
          <div className="space-y-4">
            {filteredRequirements?.map((requirement) => (
              <div
                key={requirement?.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-clinical"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-foreground">{requirement?.product_name}</h3>
                      {getStatusBadge(requirement?.status)}
                      {getPriorityBadge(requirement?.priority)}
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      API: {requirement?.api_name} • {requirement?.dosage_form} • {requirement?.strength}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-text-secondary">Quantity:</span>
                        <div className="font-medium text-foreground">
                          {requirement?.quantity?.toLocaleString()} {requirement?.unit}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Budget:</span>
                        <div className="font-medium text-foreground">
                          {formatCurrency(requirement?.budget_usd)}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Deadline:</span>
                        <div className="font-medium text-foreground">
                          {formatDate(requirement?.deadline)}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Created:</span>
                        <div className="font-medium text-foreground">
                          {formatDate(requirement?.created_at)}
                        </div>
                      </div>
                    </div>
                    {requirement?.notes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-foreground">{requirement?.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Zap"
                    iconPosition="left"
                    onClick={() => onNavigateToMatching(requirement)}
                  >
                    Find Matches
                  </Button>
                  
                  {userRole === 'editor' && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onEditRequirement(requirement)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => onDeleteRequirement(requirement?.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No requirements found</h3>
            <p className="text-text-secondary mb-4">
              {searchTerm || statusFilter !== 'all' ?'Try adjusting your search or filter criteria.' 
                : `${client?.company_name} doesn't have any requirements yet.`}
            </p>
            {userRole === 'editor' && (
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => onEditRequirement(null)}
              >
                Add First Requirement
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRequirements;