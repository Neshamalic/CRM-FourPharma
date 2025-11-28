import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import Button from '../../components/ui/Button';
import { supabase } from '../../utils/supabaseClient';

const IntelligentMatching = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State principal
  const [clients, setClients] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false); // ahora lo usamos para crear deals
  const [errorMessage, setErrorMessage] = useState('');

  // ---- 1. Cargar datos iniciales desde Supabase ----
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        // 1) Clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (clientsError) throw clientsError;

        const mappedClients = (clientsData || []).map(c => ({
          id: c.id,
          name: c.name,
          country: c.country,
          segment: c.segment,
          contact_name: c.contact_name,
          contact_email: c.contact_email,
          contact_phone: c.contact_phone,
          status: c.status || 'active',
          notes: c.notes,
          created_at: c.created_at
        }));

        setClients(mappedClients);

        // 2) Requirements
        const { data: reqsData, error: reqsError } = await supabase
          .from('client_requirements')
          .select('*')
          .order('created_at', { ascending: false });

        if (reqsError) throw reqsError;

        const mappedRequirements = (reqsData || []).map(r => ({
          id: r.id,
          client_id: r.client_id,
          product_name: r.product_name,
          api_name: r.api_name || '',
          dosage_form: r.dosage_form || '',
          strength: r.strength || '',
          quantity: r.annual_volume || null,
          unit: r.unit || '',
          budget_usd: r.budget_usd || null,
          deadline: r.deadline || null,
          priority: r.priority || '',
          status: r.status || 'open',
          notes: r.notes || '',
          created_at: r.created_at
        }));

        setRequirements(mappedRequirements);

        // 3) Suppliers
        const { data: supData, error: supError } = await supabase
          .from('suppliers')
          .select('*')
          .order('created_at', { ascending: false });

        if (supError) throw supError;

        const mappedSuppliers = (supData || []).map(s => ({
          id: s.id,
          name: s.name,
          country: s.country,
          status: s.status || 'active',
          website: s.website || '',
          contact_name: s.contact_name || '',
          contact_email: s.contact_email || '',
          contact_phone: s.contact_phone || '',
          notes: s.notes || '',
          created_at: s.created_at
        }));

        setSuppliers(mappedSuppliers);

        // 4) Products
        const { data: prodData, error: prodError } = await supabase
          .from('supplier_products')
          .select('*')
          .order('created_at', { ascending: false });

        if (prodError) throw prodError;

        const mappedProducts = (prodData || []).map(p => ({
          id: p.id,
          supplier_id: p.supplier_id,
          api_name: p.api_name || '',
          dosage_form: p.dosage_form || '',
          strength: p.strength || '',
          pack_size: p.pack_size || '',
          unit_price_usd: p.unit_price_usd,
          moq: p.moq,
          lead_time_days: p.lead_time_days,
          description: p.description || ''
        }));

        setProducts(mappedProducts);

        // 5) Preselección si venimos desde ClientsManagement
        if (location.state?.client) {
          const clientFromState = location.state.client;
          const reqFromState = location.state.requirement;

          const foundClient = mappedClients.find(c => c.id === clientFromState.id) || null;
          setSelectedClient(foundClient || null);

          if (reqFromState) {
            const foundReq = mappedRequirements.find(r => r.id === reqFromState.id) || null;
            setSelectedRequirement(foundReq || null);
          }
        }
      } catch (error) {
        console.error('Error loading data in Intelligent Matching:', error);
        setErrorMessage('Error loading data from Supabase. Please try again or check console.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [location.state]);

  // ---- 2. Helpers para selección de cliente y requirement ----
  const clientRequirements = useMemo(() => {
    if (!selectedClient) return [];
    return requirements.filter(r => r.client_id === selectedClient.id);
  }, [requirements, selectedClient]);

  const handleClientChange = event => {
    const value = event.target.value;
    if (!value) {
      setSelectedClient(null);
      setSelectedRequirement(null);
      return;
    }
    const client = clients.find(c => c.id === value);
    setSelectedClient(client || null);
    setSelectedRequirement(null);
  };

  const handleRequirementChange = event => {
    const value = event.target.value;
    if (!value) {
      setSelectedRequirement(null);
      return;
    }
    const req = clientRequirements.find(r => r.id === value);
    setSelectedRequirement(req || null);
  };

  // ---- 3. Lógica de matching ----
  const computeMatchScore = (requirement, product, supplier, client) => {
    if (!requirement || !product) return 0;

    let score = 0;

    const reqApi = (requirement.api_name || '').toLowerCase().trim();
    const prodApi = (product.api_name || '').toLowerCase().trim();

    const reqDosage = (requirement.dosage_form || '').toLowerCase().trim();
    const prodDosage = (product.dosage_form || '').toLowerCase().trim();

    const reqStrength = (requirement.strength || '').toLowerCase().trim();
    const prodStrength = (product.strength || '').toLowerCase().trim();

    // API match
    if (reqApi && prodApi && reqApi === prodApi) {
      score += 50;
    } else if (reqApi && prodApi && prodApi.includes(reqApi)) {
      score += 30;
    }

    // Dosage form match
    if (reqDosage && prodDosage && reqDosage === prodDosage) {
      score += 20;
    } else if (reqDosage && prodDosage && prodDosage.includes(reqDosage)) {
      score += 10;
    }

    // Strength match
    if (reqStrength && prodStrength && reqStrength === prodStrength) {
      score += 15;
    }

    // Country / región
    if (client?.country && supplier?.country && client.country === supplier.country) {
      score += 10;
    }

    // Budget
    if (requirement.budget_usd && product.unit_price_usd) {
      const maxUnitPrice = Number(requirement.budget_usd) / (Number(requirement.quantity) || 1);
      if (product.unit_price_usd <= maxUnitPrice) {
        score += 5;
      }
    }

    return Math.min(score, 100);
  };

  const matchResults = useMemo(() => {
    if (!selectedRequirement || !selectedClient) return [];

    const activeSuppliers = suppliers.filter(s => s.status === 'active');

    const rows = products
      .map(product => {
        const supplier = activeSuppliers.find(s => s.id === product.supplier_id);
        if (!supplier) return null;

        const score = computeMatchScore(
          selectedRequirement,
          product,
          supplier,
          selectedClient
        );

        return {
          id: `${product.id}-${supplier.id}`,
          score,
          supplier,
          product
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    return rows;
  }, [products, suppliers, selectedRequirement, selectedClient]);

  // ---- 4. Crear Deal en Supabase desde un match ----
  const handleCreateDeal = async (row) => {
    if (!selectedClient || !selectedRequirement || !row) return;

    setIsMatching(true);
    try {
      const quantity = Number(selectedRequirement.quantity) || null;
      const unitPrice = row.product.unit_price_usd != null
        ? Number(row.product.unit_price_usd)
        : null;

      const dealValue =
        quantity && unitPrice
          ? quantity * unitPrice
          : null;

      const payload = {
        client_id: selectedClient.id,
        requirement_id: selectedRequirement.id,
        supplier_id: row.supplier.id,
        product_id: row.product.id,

        client_name: selectedClient.name,
        supplier_name: row.supplier.name,
        product_name: selectedRequirement.product_name || row.product.api_name || '',
        dosage_form: row.product.dosage_form || selectedRequirement.dosage_form || '',
        strength: row.product.strength || selectedRequirement.strength || '',
        pack_size: row.product.pack_size || '',

        stage: 'Lead',
        priority: selectedRequirement.priority || 'Medium',

        deal_value: dealValue,
        currency: 'USD',
        commission_rate: 0.05, // puedes ajustar después o exponerlo en un formulario
        expected_close_date: null,

        next_action: 'Follow up with supplier and client',
        notes: `Created from Intelligent Matching. Score: ${row.score}%.`
      };

      const { data, error } = await supabase
        .from('deals')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Error inserting deal in Supabase:', error);
        alert('Error creating deal. Check console for details.');
        return;
      }

      console.log('Deal created:', data);
      alert('Deal created successfully! You can review it in Deals Management.');

      // Si quieres redirigir automáticamente:
      // navigate('/deals-management');
    } catch (error) {
      console.error('Unexpected error creating deal:', error);
      alert('Unexpected error creating deal. Check console for details.');
    } finally {
      setIsMatching(false);
    }
  };

  // ---- 5. UI ----

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <LoadingOverlay isLoading={true} message="Loading intelligent matching data..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Breadcrumb />

          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Intelligent Matching
              </h1>
              <p className="text-text-secondary">
                Match client requirements with supplier product portfolios using structured criteria.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/clients-management')}
              >
                Back to Clients
              </Button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Selección de Cliente y Requirement */}
          <div className="bg-surface rounded-lg clinical-shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Select Client
                </label>
                <select
                  className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedClient?.id || ''}
                  onChange={handleClientChange}
                >
                  <option value="">-- Choose client --</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.country ? `(${c.country})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Requirement selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Select Requirement
                </label>
                <select
                  className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedRequirement?.id || ''}
                  onChange={handleRequirementChange}
                  disabled={!selectedClient}
                >
                  <option value="">
                    {selectedClient ? '-- Choose requirement --' : 'Select a client first'}
                  </option>
                  {clientRequirements.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.product_name || r.api_name || 'Unnamed requirement'} · {r.dosage_form} {r.strength}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resumen de requirement seleccionado */}
            {selectedRequirement && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-md bg-muted">
                  <div className="font-medium text-foreground mb-1">Product</div>
                  <div className="text-text-secondary">
                    {selectedRequirement.product_name || '—'}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    API: {selectedRequirement.api_name || '—'}
                  </div>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <div className="font-medium text-foreground mb-1">Form & Strength</div>
                  <div className="text-text-secondary">
                    {selectedRequirement.dosage_form || '—'} {selectedRequirement.strength || ''}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    Qty: {selectedRequirement.quantity || '—'} {selectedRequirement.unit || ''}
                  </div>
                </div>
                <div className="p-3 rounded-md bg-muted">
                  <div className="font-medium text-foreground mb-1">Commercial</div>
                  <div className="text-text-secondary">
                    Budget: {selectedRequirement.budget_usd ? `$${selectedRequirement.budget_usd.toLocaleString()}` : '—'}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    Priority: {selectedRequirement.priority || '—'} · Status: {selectedRequirement.status || '—'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resultados de Matching */}
          <div className="bg-surface rounded-lg clinical-shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Matching Results
              </h2>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span>
                  {selectedRequirement
                    ? `${matchResults.length} matches found`
                    : 'Select a client and requirement to see matches'}
                </span>
              </div>
            </div>

            {!selectedRequirement ? (
              <div className="text-sm text-text-secondary">
                Select a client and requirement to start matching.
              </div>
            ) : matchResults.length === 0 ? (
              <div className="text-sm text-text-secondary">
                No matching suppliers found for this requirement. Try adjusting product data or requirements.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-3 py-2 text-left font-medium text-foreground">Score</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Supplier</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">API</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Form / Strength</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Pack</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Unit Price (USD)</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">MOQ</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Lead Time (days)</th>
                      <th className="px-3 py-2 text-left font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchResults.map(row => (
                      <tr key={row.id} className="border-b border-border hover:bg-muted/60">
                        <td className="px-3 py-2 align-top">
                          <span
                            className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor:
                                row.score >= 80
                                  ? 'rgba(16, 185, 129, 0.12)' // verde
                                  : row.score >= 50
                                  ? 'rgba(234, 179, 8, 0.12)' // amarillo
                                  : 'rgba(248, 113, 113, 0.12)', // rojo
                              color:
                                row.score >= 80
                                  ? '#065f46'
                                  : row.score >= 50
                                  ? '#92400e'
                                  : '#b91c1c'
                            }}
                          >
                            {row.score}%
                          </span>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="font-medium text-foreground">
                            {row.supplier.name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {row.supplier.country || '—'}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="text-text-secondary">
                            {row.product.api_name || '—'}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="text-text-secondary">
                            {row.product.dosage_form || '—'} {row.product.strength || ''}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          <div className="text-text-secondary">
                            {row.product.pack_size || '—'}
                          </div>
                        </td>
                        <td className="px-3 py-2 align-top">
                          {row.product.unit_price_usd != null
                            ? `$${Number(row.product.unit_price_usd).toFixed(4)}`
                            : '—'}
                        </td>
                        <td className="px-3 py-2 align-top">
                          {row.product.moq != null ? row.product.moq.toLocaleString() : '—'}
                        </td>
                        <td className="px-3 py-2 align-top">
                          {row.product.lead_time_days != null
                            ? row.product.lead_time_days
                            : '—'}
                        </td>
                        <td className="px-3 py-2 align-top">
                          <Button
                            size="sm"
                            iconName="Plus"
                            iconPosition="left"
                            onClick={() => handleCreateDeal(row)}
                          >
                            Create Deal
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <LoadingOverlay isLoading={isMatching} message="Creating deal..." />
    </div>
  );
};

export default IntelligentMatching;
