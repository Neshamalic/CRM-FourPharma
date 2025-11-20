import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ClientsTable = ({ 
  clients, 
  onSelectClient, 
  selectedClientId, 
  onEditClient, 
  onDeleteClient, 
  userRole = 'editor' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('company_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const filteredAndSortedClients = clients?.filter(client => {
      const matchesSearch = client?.company_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           client?.contact_person?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           client?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client?.status === statusFilter;
      return matchesSearch && matchesStatus;
    })?.sort((a, b) => {
      const aValue = a?.[sortField];
      const bValue = b?.[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string') {
        return aValue?.localeCompare(bValue) * direction;
      }
      return (aValue - bValue) * direction;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Pending' },
      suspended: { color: 'bg-destructive text-destructive-foreground', label: 'Suspended' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.inactive;
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

  return (
    <div className="bg-surface rounded-lg clinical-shadow">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filter by status"
              className="w-40"
            />
            {userRole === 'editor' && (
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => onEditClient(null)}
              >
                Add Client
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('company_name')}
                  className="flex items-center space-x-1 hover:text-primary transition-clinical"
                >
                  <span>Company</span>
                  <Icon 
                    name={sortField === 'company_name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Contact Person</th>
              <th className="text-left p-4 font-medium text-foreground">Email</th>
              <th className="text-left p-4 font-medium text-foreground">Phone</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-primary transition-clinical"
                >
                  <span>Status</span>
                  <Icon 
                    name={sortField === 'status' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center space-x-1 hover:text-primary transition-clinical"
                >
                  <span>Created</span>
                  <Icon 
                    name={sortField === 'created_at' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="text-right p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedClients?.map((client) => (
              <tr
                key={client?.id}
                onClick={() => onSelectClient(client)}
                className={`hover:bg-muted cursor-pointer transition-clinical ${
                  selectedClientId === client?.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Building2" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{client?.company_name}</div>
                      <div className="text-sm text-text-secondary">{client?.industry}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-foreground">{client?.contact_person}</div>
                  <div className="text-sm text-text-secondary">{client?.position}</div>
                </td>
                <td className="p-4 text-foreground">{client?.email}</td>
                <td className="p-4 text-foreground">{client?.phone}</td>
                <td className="p-4">{getStatusBadge(client?.status)}</td>
                <td className="p-4 text-text-secondary">{formatDate(client?.created_at)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onSelectClient(client);
                      }}
                    >
                      View
                    </Button>
                    {userRole === 'editor' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Edit"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onEditClient(client);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onDeleteClient(client?.id);
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedClients?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No clients found</h3>
          <p className="text-text-secondary mb-4">
            {searchTerm || statusFilter !== 'all' ?'Try adjusting your search or filter criteria.' :'Get started by adding your first client.'}
          </p>
          {userRole === 'editor' && (
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onEditClient(null)}
            >
              Add First Client
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientsTable;