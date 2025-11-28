import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import ClientsTable from './components/ClientsTable';
import ClientRequirements from './components/ClientRequirements';
import ClientFormModal from './components/ClientFormModal';
import RequirementFormModal from './components/RequirementFormModal';
import { supabase } from '../../utils/supabaseClient';

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

  // ---------- MOCK DATA (fallback si Supabase está vacío o falla) ----------
  const mockClients = [
    {
      id: 'client-001',
      company_name: 'MedTech Solutions Inc.',
      contact_person: 'Sarah Johnson',
      position: 'Procurement Manager',
      email: 'sarah.johnson@medtechsolutions.com',
      phone: '+1-555-0123',
      address: '123 Healthcare Blvd',
      city: 'Boston',
      state: 'MA',
      country: 'United States',
      postal_code: '02101',
      industry: 'pharmaceuticals',
      company_size: 'medium',
      status: 'active',
      notes:
        'Key client for cardiovascular medications. Prefers bulk orders with quarterly delivery schedules.',
      created_at: '2024-01-15T08:30:00Z',
    },
    {
      id: 'client-002',
      company_name: 'Global Pharma Distribution',
      contact_person: 'Michael Chen',
      position: 'Supply Chain Director',
      email: 'm.chen@globalpharma.com',
      phone: '+1-555-0456',
      address: '456 Medical Center Dr',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      postal_code: '94102',
      industry: 'distribution',
      company_size: 'large',
      status: 'active',
      notes:
        'Large distributor with extensive network. Requires FDA-approved suppliers only.',
      created_at: '2024-02-20T10:15:00Z',
    },
    {
      id: 'client-003',
      company_name: 'BioResearch Labs',
      contact_person: 'Dr. Emily Rodriguez',
      position: 'Research Director',
      email: 'e.rodriguez@bioresearch.com',
      phone: '+1-555-0789',
      address: '789 Innovation Way',
      city: 'Seattle',
      state: 'WA',
      country: 'United States',
      postal_code: '98101',
      industry: 'research',
      company_size: 'small',
      status: 'pending',
      notes:
        'Specialized in oncology research. Requires high-purity compounds for clinical trials.',
      created_at: '2024-03-10T14:45:00Z',
    },
    {
      id: 'client-004',
      company_name: 'Regional Health Network',
      contact_person: 'James Wilson',
      position: 'Pharmacy Director',
      email: 'j.wilson@regionalhealthnet.com',
      phone: '+1-555-0321',
      address: '321 Hospital Ave',
      city: 'Chicago',
      state: 'IL',
      country: 'United States',
      postal_code: '60601',
      industry: 'healthcare',
      company_size: 'enterprise',
      status: 'active',
      notes:
        'Multi-hospital network serving 500,000+ patients. Focus on generic medications and cost optimization.',
      created_at: '2024-01-28T11:20:00Z',
    },
    {
      id: 'client-005',
      company_name: 'Specialty Therapeutics Corp',
      contact_person: 'Lisa Thompson',
      position: 'VP of Operations',
      email: 'l.thompson@specialtytherapeutics.com',
      phone: '+1-555-0654',
      address: '654 Biotech Plaza',
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      postal_code: '73301',
      industry: 'biotechnology',
      company_size: 'medium',
      status: 'inactive',
      notes:
        'Focuses on rare disease treatments. Currently restructuring procurement processes.',
      created_at: '2024-02-05T09:30:00Z',
    },
  ];

  const mockRequirements = [
    {
      id: 'req-001',
      client_id: 'client-001',
      product_name: 'Atorvastatin Tablets',
      api_name: 'Atorvastatin Calcium',
      dosage_form: 'tablet',
      strength: '20mg',
      quantity: 100000,
      unit: 'pieces',
      budget_usd: 15000,
      deadline: '2024-12-15T00:00:00Z',
      priority: 'high',
      status: 'open',
      notes:
        'USP grade required. Prefer blister packaging for retail distribution.',
      created_at: '2024-09-15T10:30:00Z',
    },
    {
      id: 'req-002',
      client_id: 'client-001',
      product_name: 'Metformin Extended Release',
      api_name: 'Metformin Hydrochloride',
      dosage_form: 'tablet',
      strength: '500mg',
      quantity: 75000,
      unit: 'pieces',
      budget_usd: 8500,
      deadline: '2024-11-30T00:00:00Z',
      priority: 'medium',
      status: 'in_progress',
      notes:
        'Extended release formulation. Stability data required for 24-month shelf life.',
      created_at: '2024-09-10T14:20:00Z',
    },
    {
      id: 'req-003',
      client_id: 'client-002',
      product_name: 'Amoxicillin Capsules',
      api_name: 'Amoxicillin Trihydrate',
      dosage_form: 'capsule',
      strength: '250mg',
      quantity: 200000,
      unit: 'pieces',
      budget_usd: 25000,
      deadline: '2024-10-31T00:00:00Z',
      priority: 'high',
      status: 'open',
      notes:
        'FDA-approved facility required. Need CoA and stability studies.',
      created_at: '2024-09-18T09:15:00Z',
    },
    {
      id: 'req-004',
      client_id: 'client-003',
      product_name: 'Doxorubicin Injection',
      api_name: 'Doxorubicin Hydrochloride',
      dosage_form: 'injection',
      strength: '50mg/25ml',
      quantity: 500,
      unit: 'vials',
      budget_usd: 45000,
      deadline: '2024-11-15T00:00:00Z',
      priority: 'high',
      status: 'open',
      notes:
        'GMP facility required. Cold chain storage and transport needed. For clinical trial use.',
      created_at: '2024-09-20T16:45:00Z',
    },
    {
      id: 'req-005',
      client_id: 'client-004',
      product_name: 'Ibuprofen Tablets',
      api_name: 'Ibuprofen',
      dosage_form: 'tablet',
      strength: '400mg',
      quantity: 500000,
      unit: 'pieces',
      budget_usd: 12000,
      deadline: '2024-12-31T00:00:00Z',
      priority: 'low',
      status: 'open',
      notes:
        'Generic formulation acceptable. Bulk packaging preferred for hospital use.',
      created_at: '2024-09-12T13:30:00Z',
    },
  ];

  // ---------- Cargar datos desde Supabase (con fallback a mocks) ----------
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 1) Cargar clients desde Supabase
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        // 2) Cargar requirements desde Supabase
        const { data: reqsData, error: reqsError } = await supabase
          .from('client_requirements')
          .select('*')
          .order('created_at', { ascending: false });

        if (clientsError) throw clientsError;
        if (reqsError) throw reqsError;

        // Mapear formato de BD → formato que usan los componentes actuales
        const mappedClients =
          clientsData && clientsData.length > 0
            ? clientsData.map((c) => ({
                id: c.id,
                company_name: c.name,
                contact_person: c.contact_name,
                position: '', // no existe en la tabla todavía
                email: c.contact_email,
                phone: c.contact_phone,
                address: '',
                city: '',
                state: '',
                country: c.country,
                postal_code: '',
                industry: c.segment,
                company_size: '',
                status: c.status || 'active',
                notes: c.notes,
                created_at: c.created_at,
              }))
            : mockClients;

        const mappedRequirements =
          reqsData && reqsData.length > 0
            ? reqsData.map((r) => ({
                id: r.id,
                client_id: r.client_id,
                product_name: r.product_name,
                api_name: r.api_name || '',
                dosage_form: r.dosage_form,
                strength: r.strength,
                quantity: r.annual_volume || null,
                unit: r.unit || '',
                budget_usd: r.budget_usd || null,
                deadline: r.deadline || null,
                priority: r.priority,
                status: r.status || 'open',
                notes: r.notes,
                created_at: r.created_at,
              }))
            : mockRequirements;

        setClients(mappedClients);
        setRequirements(mappedRequirements);
      } catch (error) {
        console.error(
          'Error loading data from Supabase, using mock data:',
          error
        );
        // Fallback: usar mock data si falla Supabase
        setClients(mockClients);
        setRequirements(mockRequirements);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ---------- Handlers de selección / navegación ----------
  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsClientModalOpen(true);
  };

  // ---------- CRUD de CLIENTES conectado a Supabase ----------
  const handleDeleteClient = async (clientId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this client? This action cannot be undone.'
      )
    ) {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', clientId);

        if (error) {
          console.error('Error deleting client in Supabase:', error);
          alert(
            'No se pudo eliminar el cliente en Supabase: ' + error.message
          );
        }

        // Actualizar estado local siempre para reflejar UI
        setClients((prev) => prev?.filter((c) => c?.id !== clientId));

        if (selectedClient?.id === clientId) {
          setSelectedClient(null);
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Error inesperado al eliminar el cliente');
      }
    }
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        // UPDATE en Supabase
        const { error } = await supabase
          .from('clients')
          .update({
            name: clientData.company_name,
            country: clientData.country,
            segment: clientData.industry,
            contact_name: clientData.contact_person,
            contact_email: clientData.email,
            contact_phone: clientData.phone,
            status: clientData.status,
            notes: clientData.notes,
          })
          .eq('id', editingClient.id);

        if (error) {
          console.error('Error updating client in Supabase:', error);
          alert(
            'No se pudo actualizar el cliente en Supabase: ' + error.message
          );
          throw error;
        }

        // Actualizar estado local
        setClients((prev) =>
          prev?.map((c) =>
            c?.id === editingClient?.id ? { ...c, ...clientData } : c
          )
        );

        if (selectedClient?.id === editingClient?.id) {
          setSelectedClient((prev) =>
            prev ? { ...prev, ...clientData } : prev
          );
        }
      } else {
        // INSERT en Supabase
        const { data, error } = await supabase
          .from('clients')
          .insert({
            name: clientData.company_name,
            country: clientData.country,
            segment: clientData.industry,
            contact_name: clientData.contact_person,
            contact_email: clientData.email,
            contact_phone: clientData.phone,
            status: clientData.status,
            notes: clientData.notes,
          })
          .select()
          .single();

        console.log('Supabase insert result (clients):', { data, error });

        if (error) {
          console.error('Error inserting client in Supabase:', error);
          alert(
            'No se pudo crear el cliente en Supabase: ' + error.message
          );
          throw error;
        }

        const newClient = {
          id: data.id,
          company_name: data.name,
          contact_person: data.contact_name,
          position: clientData.position || '',
          email: data.contact_email,
          phone: data.contact_phone,
          address: clientData.address || '',
          city: clientData.city || '',
          state: clientData.state || '',
          country: data.country,
          postal_code: clientData.postal_code || '',
          industry: data.segment,
          company_size: clientData.company_size || '',
          status: data.status || 'active',
          notes: data.notes,
          created_at: data.created_at,
        };

        setClients((prev) => [newClient, ...prev]);
      }

      // Cerrar modal desde el padre cuando todo sale bien
      setIsClientModalOpen(false);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  };

  // ---------- CRUD de REQUIREMENTS (por ahora solo en frontend) ----------
  const handleEditRequirement = (requirement) => {
    setEditingRequirement(requirement);
    setIsRequirementModalOpen(true);
  };

  const handleDeleteRequirement = async (requirementId) => {
    if (
      window.confirm('Are you sure you want to delete this requirement?')
    ) {
      try {
        // TODO: conectar a Supabase (tabla client_requirements)
        setRequirements((prev) =>
          prev?.filter((r) => r?.id !== requirementId)
        );
      } catch (error) {
        console.error('Error deleting requirement:', error);
      }
    }
  };

  const handleSaveRequirement = async (requirementData) => {
    try {
      // TODO: conectar a Supabase (tabla client_requirements)
      if (editingRequirement) {
        setRequirements((prev) =>
          prev?.map((r) =>
            r?.id === editingRequirement?.id
              ? {
                  ...r,
                  ...requirementData,
                  updated_at: new Date()?.toISOString(),
                }
              : r
          )
        );
      } else {
        const newRequirement = {
          id: `req-${Date.now()}`,
          ...requirementData,
          created_at: new Date()?.toISOString(),
        };
        setRequirements((prev) => [newRequirement, ...prev]);
      }

      setIsRequirementModalOpen(false);
      setEditingRequirement(null);
    } catch (error) {
      console.error('Error saving requirement:', error);
      throw error;
    }
  };

  // ---------- Navegación a Intelligent Matching ----------
  const handleNavigateToMatching = (requirement) => {
    navigate('/intelligent-matching', {
      state: {
        requirement,
        client: selectedClient,
      },
    });
  };

  const getClientRequirements = () => {
    if (!selectedClient) return [];
    return requirements?.filter(
      (req) => req?.client_id === selectedClient?.id
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Breadcrumb />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Clients Management
            </h1>
            <p className="text-text-secondary">
              Manage client relationships and track procurement requirements
              for pharmaceutical supply chain operations.
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
