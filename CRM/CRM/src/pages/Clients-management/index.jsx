import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import ClientsTable from './components/ClientsTable';
import ClientRequirements from './components/ClientRequirements';
import ClientFormModal from './components/ClientFormModal';
import RequirementFormModal from './components/RequirementFormModal';

const ClientsManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [userRole] = useState('editor'); // Mock user role - in real app, get from auth context

  // Mock data
  const mockClients = [
    {
      id: "client-001",
      company_name: "MedTech Solutions Inc.",
      contact_person: "Sarah Johnson",
      position: "Procurement Manager",
      email: "sarah.johnson@medtechsolutions.com",
      phone: "+1-555-0123",
      address: "123 Healthcare Blvd",
      city: "Boston",
      state: "MA",
      country: "United States",
      postal_code: "02101",
      industry: "pharmaceuticals",
      company_size: "medium",
      status: "active",
      notes: "Key client for cardiovascular medications. Prefers bulk orders with quarterly delivery schedules.",
      created_at: "2024-01-15T08:30:00Z"
    },
    {
      id: "client-002",
      company_name: "Global Pharma Distribution",
      contact_person: "Michael Chen",
      position: "Supply Chain Director",
      email: "m.chen@globalpharma.com",
      phone: "+1-555-0456",
      address: "456 Medical Center Dr",
      city: "San Francisco",
      state: "CA",
      country: "United States",
      postal_code: "94102",
      industry: "distribution",
      company_size: "large",
      status: "active",
      notes: "Large distributor with extensive network. Requires FDA-approved suppliers only.",
      created_at: "2024-02-20T10:15:00Z"
    },
    {
      id: "client-003",
      company_name: "BioResearch Labs",
      contact_person: "Dr. Emily Rodriguez",
      position: "Research Director",
      email: "e.rodriguez@bioresearch.com",
      phone: "+1-555-0789",
      address: "789 Innovation Way",
      city: "Seattle",
      state: "WA",
      country: "United States",
      postal_code: "98101",
      industry: "research",
      company_size: "small",
      status: "pending",
      notes: "Specialized in oncology research. Requires high-purity compounds for clinical trials.",
      created_at: "2024-03-10T14:45:00Z"
    },
    {
      id: "client-004",
      company_name: "Regional Health Network",
      contact_person: "James Wilson",
      position: "Pharmacy Director",
      email: "j.wilson@regionalhealthnet.com",
      phone: "+1-555-0321",
      address: "321 Hospital Ave",
      city: "Chicago",
      state: "IL",
      country: "United States",
      postal_code: "60601",
      industry: "healthcare",
      company_size: "enterprise",
      status: "active",
      notes: "Multi-hospital network serving 500,000+ patients. Focus on generic medications and cost optimization.",
      created_at: "2024-01-28T11:20:00Z"
    },
    {
      id: "client-005",
      company_name: "Specialty Therapeutics Corp",
      contact_person: "Lisa Thompson",
      position: "VP of Operations",
      email: "l.thompson@specialtytherapeutics.com",
      phone: "+1-555-0654",
      address: "654 Biotech Plaza",
      city: "Austin",
      state: "TX",
      country: "United States",
      postal_code: "73301",
      industry: "biotechnology",
      company_size: "medium",
      status: "inactive",
      notes: "Focuses on rare disease treatments. Currently restructuring procurement processes.",
      created_at: "2024-02-05T09:30:00Z"
    }
  ];

  const mockRequirements = [
    {
      id: "req-001",
      client_id: "client-001",
      product_name: "Atorvastatin Tablets",
      api_name: "Atorvastatin Calcium",
      dosage_form: "tablet",
      strength: "20mg",
      quantity: 100000,
      unit: "pieces",
      budget_usd: 15000,
      deadline: "2024-12-15T00:00:00Z",
      priority: "high",
      status: "open",
      notes: "USP grade required. Prefer blister packaging for retail distribution.",
      created_at: "2024-09-15T10:30:00Z"
    },
    {
      id: "req-002",
      client_id: "client-001",
      product_name: "Metformin Extended Release",
      api_name: "Metformin Hydrochloride",
      dosage_form: "tablet",
      strength: "500mg",
      quantity: 75000,
      unit: "pieces",
      budget_usd: 8500,
      deadline: "2024-11-30T00:00:00Z",
      priority: "medium",
      status: "in_progress",
      notes: "Extended release formulation. Stability data required for 24-month shelf life.",
      created_at: "2024-09-10T14:20:00Z"
    },
    {
      id: "req-003",
      client_id: "client-002",
      product_name: "Amoxicillin Capsules",
      api_name: "Amoxicillin Trihydrate",
      dosage_form: "capsule",
      strength: "250mg",
      quantity: 200000,
      unit: "pieces",
      budget_usd: 25000,
      deadline: "2024-10-31T00:00:00Z",
      priority: "high",
      status: "open",
      notes: "FDA-approved facility required. Need CoA and stability studies.",
      created_at: "2024-09-18T09:15:00Z"
    },
    {
      id: "req-004",
      client_id: "client-003",
      product_name: "Doxorubicin Injection",
      api_name: "Doxorubicin Hydrochloride",
      dosage_form: "injection",
      strength: "50mg/25ml",
      quantity: 500,
      unit: "vials",
      budget_usd: 45000,
      deadline: "2024-11-15T00:00:00Z",
      priority: "high",
      status: "open",
      notes: "GMP facility required. Cold chain storage and transport needed. For clinical trial use.",
      created_at: "2024-09-20T16:45:00Z"
    },
    {
      id: "req-005",
      client_id: "client-004",
      product_name: "Ibuprofen Tablets",
      api_name: "Ibuprofen",
      dosage_form: "tablet",
      strength: "400mg",
      quantity: 500000,
      unit: "pieces",
      budget_usd: 12000,
      deadline: "2024-12-31T00:00:00Z",
      priority: "low",
      status: "open",
      notes: "Generic formulation acceptable. Bulk packaging preferred for hospital use.",
      created_at: "2024-09-12T13:30:00Z"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClients(mockClients);
        setRequirements(mockRequirements);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setClients(prev => prev?.filter(c => c?.id !== clientId));
        
        // Clear selection if deleted client was selected
        if (selectedClient?.id === clientId) {
          setSelectedClient(null);
        }
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleSaveClient = async (clientData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingClient) {
        // Update existing client
        setClients(prev => prev?.map(c => 
          c?.id === editingClient?.id 
            ? { ...c, ...clientData, updated_at: new Date()?.toISOString() }
            : c
        ));
        
        // Update selected client if it was the one being edited
        if (selectedClient?.id === editingClient?.id) {
          setSelectedClient(prev => ({ ...prev, ...clientData }));
        }
      } else {
        // Create new client
        const newClient = {
          id: `client-${Date.now()}`,
          ...clientData,
          created_at: new Date()?.toISOString()
        };
        setClients(prev => [newClient, ...prev]);
      }
      
      setIsClientModalOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  };

  const handleEditRequirement = (requirement) => {
    setEditingRequirement(requirement);
    setIsRequirementModalOpen(true);
  };

  const handleDeleteRequirement = async (requirementId) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setRequirements(prev => prev?.filter(r => r?.id !== requirementId));
      } catch (error) {
        console.error('Error deleting requirement:', error);
      }
    }
  };

  const handleSaveRequirement = async (requirementData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingRequirement) {
        // Update existing requirement
        setRequirements(prev => prev?.map(r => 
          r?.id === editingRequirement?.id 
            ? { ...r, ...requirementData, updated_at: new Date()?.toISOString() }
            : r
        ));
      } else {
        // Create new requirement
        const newRequirement = {
          id: `req-${Date.now()}`,
          ...requirementData,
          created_at: new Date()?.toISOString()
        };
        setRequirements(prev => [newRequirement, ...prev]);
      }
      
      setIsRequirementModalOpen(false);
      setEditingRequirement(null);
    } catch (error) {
      console.error('Error saving requirement:', error);
      throw error;
    }
  };

  const handleNavigateToMatching = (requirement) => {
    // Navigate to intelligent matching with requirement context
    navigate('/intelligent-matching', { 
      state: { 
        requirement,
        client: selectedClient 
      } 
    });
  };

  const getClientRequirements = () => {
    if (!selectedClient) return [];
    return requirements?.filter(req => req?.client_id === selectedClient?.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Clients Management</h1>
            <p className="text-text-secondary">
              Manage client relationships and track procurement requirements for pharmaceutical supply chain operations.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clients Table */}
            <div className="lg:col-span-1">
              <ClientsTable
                clients={clients}
                onSelectClient={handleSelectClient}
                selectedClientId={selectedClient?.id}
                onEditClient={handleEditClient}
                onDeleteClient={handleDeleteClient}
                userRole={userRole}
              />
            </div>

            {/* Client Requirements */}
            <div className="lg:col-span-1">
              <ClientRequirements
                client={selectedClient}
                requirements={getClientRequirements()}
                onEditRequirement={handleEditRequirement}
                onDeleteRequirement={handleDeleteRequirement}
                onNavigateToMatching={handleNavigateToMatching}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
        }}
        client={editingClient}
        onSave={handleSaveClient}
      />

      <RequirementFormModal
        isOpen={isRequirementModalOpen}
        onClose={() => {
          setIsRequirementModalOpen(false);
          setEditingRequirement(null);
        }}
        requirement={editingRequirement}
        clientId={selectedClient?.id}
        onSave={handleSaveRequirement}
      />

      {/* Loading Overlay */}
      <LoadingOverlay 
        isLoading={isLoading} 
        message="Loading clients data..." 
      />
    </div>
  );
};

export default ClientsManagement;