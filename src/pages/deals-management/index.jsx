import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DealsTable from './components/DealsTable';
import KanbanBoard from './components/KanbanBoard';
import DealModal from './components/DealModal';
import DealsFilters from './components/DealsFilters';
import DealsStats from './components/DealsStats';

const DealsManagement = () => {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'create'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('editor'); // 'editor' or 'viewer'
  const [filters, setFilters] = useState({
    search: '',
    stage: '',
    priority: '',
    minValue: '',
    maxValue: '',
    startDate: '',
    endDate: ''
  });

  // Mock deals data
  const mockDeals = [
    {
      id: '1',
      client_name: 'MedCorp Pharmaceuticals',
      client_contact: 'sarah.johnson@medcorp.com',
      supplier_name: 'Global Pharma Supply',
      supplier_contact: 'mike.chen@globalpharma.com',
      product_name: 'Amoxicillin',
      dosage_form: 'Capsule',
      strength: '500mg',
      pack_size: '100 capsules',
      deal_value: 125000,
      commission_rate: 0.05,
      stage: 'Negotiation',
      priority: 'High',
      expected_close_date: '2025-01-15',
      next_action: 'Schedule pricing negotiation call',
      notes: 'Client interested in bulk pricing for Q1 2025',
      created_at: '2024-12-01T10:00:00Z',
      last_activity: '2024-12-20T14:30:00Z'
    },
    {
      id: '2',
      client_name: 'HealthFirst Distribution',
      client_contact: 'david.wilson@healthfirst.com',
      supplier_name: 'BioMed Solutions',
      supplier_contact: 'lisa.martinez@biomed.com',
      product_name: 'Metformin',
      dosage_form: 'Tablet',
      strength: '850mg',
      pack_size: '500 tablets',
      deal_value: 89000,
      commission_rate: 0.04,
      stage: 'Contract',
      priority: 'Medium',
      expected_close_date: '2025-01-10',
      next_action: 'Review final contract terms',
      notes: 'Contract under legal review, expecting signature next week',
      created_at: '2024-11-15T09:00:00Z',
      last_activity: '2024-12-21T11:15:00Z'
    },
    {
      id: '3',
      client_name: 'Regional Medical Center',
      client_contact: 'jennifer.brown@rmc.org',
      supplier_name: 'PharmaTech Industries',
      supplier_contact: 'robert.davis@pharmatech.com',
      product_name: 'Lisinopril',
      dosage_form: 'Tablet',
      strength: '10mg',
      pack_size: '1000 tablets',
      deal_value: 67500,
      commission_rate: 0.06,
      stage: 'Closed',
      priority: 'Medium',
      expected_close_date: '2024-12-15',
      next_action: 'Process purchase order',
      notes: 'Deal closed successfully, PO in progress',
      created_at: '2024-10-20T08:30:00Z',
      last_activity: '2024-12-15T16:45:00Z'
    },
    {
      id: '4',
      client_name: 'City Hospital Network',
      client_contact: 'michael.garcia@cityhealth.org',
      supplier_name: 'MediSource Corp',
      supplier_contact: 'amanda.taylor@medisource.com',
      product_name: 'Atorvastatin',
      dosage_form: 'Tablet',
      strength: '20mg',
      pack_size: '90 tablets',
      deal_value: 156000,
      commission_rate: 0.055,
      stage: 'Lead',
      priority: 'High',
      expected_close_date: '2025-02-28',
      next_action: 'Send detailed product specifications',
      notes: 'Initial interest shown, need to provide more technical details',
      created_at: '2024-12-18T13:20:00Z',
      last_activity: '2024-12-19T10:00:00Z'
    },
    {
      id: '5',
      client_name: 'Wellness Pharmacy Chain',
      client_contact: 'susan.lee@wellnessrx.com',
      supplier_name: 'Advanced Therapeutics',
      supplier_contact: 'james.anderson@advtherapeutics.com',
      product_name: 'Omeprazole',
      dosage_form: 'Capsule',
      strength: '40mg',
      pack_size: '30 capsules',
      deal_value: 43200,
      commission_rate: 0.045,
      stage: 'Negotiation',
      priority: 'Low',
      expected_close_date: '2025-01-25',
      next_action: 'Follow up on volume discount request',
      notes: 'Negotiating volume pricing for multiple locations',
      created_at: '2024-11-28T11:45:00Z',
      last_activity: '2024-12-18T15:30:00Z'
    },
    {
      id: '6',
      client_name: 'Metro Health Systems',
      client_contact: 'patricia.white@metrohealth.com',
      supplier_name: 'Precision Pharma',
      supplier_contact: 'kevin.thompson@precisionpharma.com',
      product_name: 'Amlodipine',
      dosage_form: 'Tablet',
      strength: '5mg',
      pack_size: '90 tablets',
      deal_value: 78900,
      commission_rate: 0.05,
      stage: 'Contract',
      priority: 'Medium',
      expected_close_date: '2025-01-20',
      next_action: 'Finalize delivery schedule',
      notes: 'Contract approved, working on logistics',
      created_at: '2024-11-10T14:15:00Z',
      last_activity: '2024-12-20T09:20:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadDeals = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDeals(mockDeals);
      } catch (error) {
        console.error('Error loading deals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, []);

  // Filter deals based on current filters
  const applyFilters = useMemo(() => {
    let filtered = [...deals];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(deal =>
        deal?.client_name?.toLowerCase()?.includes(searchTerm) ||
        deal?.supplier_name?.toLowerCase()?.includes(searchTerm) ||
        deal?.product_name?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Stage filter
    if (filters?.stage) {
      filtered = filtered?.filter(deal => deal?.stage === filters?.stage);
    }

    // Priority filter
    if (filters?.priority) {
      filtered = filtered?.filter(deal => deal?.priority === filters?.priority);
    }

    // Value range filter
    if (filters?.minValue) {
      filtered = filtered?.filter(deal => deal?.deal_value >= parseFloat(filters?.minValue));
    }
    if (filters?.maxValue) {
      filtered = filtered?.filter(deal => deal?.deal_value <= parseFloat(filters?.maxValue));
    }

    // Date range filter
    if (filters?.startDate) {
      filtered = filtered?.filter(deal => new Date(deal.created_at) >= new Date(filters.startDate));
    }
    if (filters?.endDate) {
      filtered = filtered?.filter(deal => new Date(deal.created_at) <= new Date(filters.endDate));
    }

    return filtered;
  }, [deals, filters]);

  useEffect(() => {
    setFilteredDeals(applyFilters);
  }, [applyFilters]);

  const handleCreateDeal = () => {
    setSelectedDeal(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewDeal = (deal) => {
    setSelectedDeal(deal);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (deal) => {
    if (window.confirm(`Are you sure you want to delete the deal with ${deal?.client_name}?`)) {
      setDeals(prev => prev?.filter(d => d?.id !== deal?.id));
    }
  };

  const handleStageChange = (dealId, newStage) => {
    setDeals(prev => prev?.map(deal => 
      deal?.id === dealId 
        ? { ...deal, stage: newStage, last_activity: new Date()?.toISOString() }
        : deal
    ));
  };

  const handleSaveDeal = async (dealData) => {
    if (modalMode === 'create') {
      const newDeal = {
        ...dealData,
        id: Date.now()?.toString(),
        created_at: new Date()?.toISOString(),
        last_activity: new Date()?.toISOString()
      };
      setDeals(prev => [newDeal, ...prev]);
    } else if (modalMode === 'edit') {
      setDeals(prev => prev?.map(deal => 
        deal?.id === selectedDeal?.id 
          ? { ...deal, ...dealData, last_activity: new Date()?.toISOString() }
          : deal
      ));
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      stage: '',
      priority: '',
      minValue: '',
      maxValue: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleNavigateToMatching = () => {
    window.location.href = '/intelligent-matching';
  };

  const handleNavigateToPurchaseOrders = () => {
    window.location.href = '/purchase-orders';
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message="Loading deals..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Deals Management</h1>
              <p className="text-text-secondary">
                Track and manage your pharmaceutical deals through the complete sales pipeline
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={handleNavigateToMatching}
                iconName="Zap"
                iconPosition="left"
              >
                Create from Matches
              </Button>
              {userRole === 'editor' && (
                <Button
                  onClick={handleCreateDeal}
                  iconName="Plus"
                  iconPosition="left"
                >
                  New Deal
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <DealsStats deals={filteredDeals} />

          {/* Filters */}
          <DealsFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">
                {filteredDeals?.length} deal{filteredDeals?.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary mr-2">View:</span>
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-clinical ${
                    viewMode === 'table' ?'bg-surface text-foreground clinical-shadow' :'text-text-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name="Table" size={16} />
                  <span>Table</span>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-clinical ${
                    viewMode === 'kanban' ?'bg-surface text-foreground clinical-shadow' :'text-text-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name="Columns" size={16} />
                  <span>Kanban</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'table' ? (
            <DealsTable
              deals={filteredDeals}
              onEdit={handleEditDeal}
              onView={handleViewDeal}
              onDelete={handleDeleteDeal}
              userRole={userRole}
            />
          ) : (
            <div className="bg-surface rounded-lg clinical-shadow p-6">
              <KanbanBoard
                deals={filteredDeals}
                onStageChange={handleStageChange}
                onEdit={handleEditDeal}
                onView={handleViewDeal}
                userRole={userRole}
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="bg-surface p-6 rounded-lg clinical-shadow flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  <Icon name="ShoppingCart" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Purchase Orders</h3>
                  <p className="text-sm text-text-secondary">Convert closed deals to purchase orders</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleNavigateToPurchaseOrders}
                iconName="ArrowRight"
                iconPosition="right"
                fullWidth
              >
                Manage Purchase Orders
              </Button>
            </div>

            <div className="bg-surface p-6 rounded-lg clinical-shadow flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-accent bg-opacity-10 rounded-lg">
                  <Icon name="TrendingUp" size={20} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Commission Tracking</h3>
                  <p className="text-sm text-text-secondary">Track earnings from closed deals</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-accent mb-2">
                ${filteredDeals?.reduce((sum, deal) => sum + (deal?.deal_value * (deal?.commission_rate || 0)), 0)?.toLocaleString()}
              </div>
              <p className="text-sm text-text-secondary">Total commission value</p>
            </div>
          </div>
        </div>
      </main>
      {/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={selectedDeal}
        onSave={handleSaveDeal}
        mode={modalMode}
        userRole={userRole}
      />
    </div>
  );
};

export default DealsManagement;
