import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import RequirementCard from './components/RequirementCard';
import FilterPanel from './components/FilterPanel';
import MatchingResults from './components/MatchingResults';
import CreateDealModal from './components/CreateDealModal';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { supabase } from '../../utils/supabaseClient';

const IntelligentMatching = () => {
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  const [filters, setFilters] = useState({
    similarityThreshold: '60',
    location: '',
    leadTime: '',
    maxPrice: '',
    minMoq: '',
    minQuantity: ''
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('similarity_score');

  // ---------- MOCK DATA (por ahora) ----------
  const mockRequirements = [
    {
      id: 'req_001',
      client_id: 'client_001',
      client_name: 'MedCorp Pharmaceuticals',
      product_name: 'Amoxicillin Capsules',
      api_name: 'Amoxicillin',
      dosage_form: 'Capsules',
      strength: '500mg',
      pack_size: '10x10',
      quantity: 100000,
      budget_usd: 50000,
      required_date: '2025-03-15',
      priority: 'High',
      status: 'Active',
      notes: 'Urgent requirement for Q1 2025. Quality certification required.'
    },
    {
      id: 'req_002',
      client_id: 'client_002',
      client_name: 'Global Health Solutions',
      product_name: 'Paracetamol Tablets',
      api_name: 'Paracetamol',
      dosage_form: 'Tablets',
      strength: '650mg',
      pack_size: '20x10',
      quantity: 250000,
      budget_usd: 75000,
      required_date: '2025-04-20',
      priority: 'Medium',
      status: 'Active',
      notes: 'Regular supply needed for hospital chain.'
    },
    {
      id: 'req_003',
      client_id: 'client_003',
      client_name: 'PharmaTech Industries',
      product_name: 'Metformin Tablets',
      api_name: 'Metformin HCl',
      dosage_form: 'Tablets',
      strength: '1000mg',
      pack_size: '15x10',
      quantity: 150000,
      budget_usd: 60000,
      required_date: '2025-05-10',
      priority: 'Low',
      status: 'Pending',
      notes: 'Extended release formulation preferred.'
    }
  ];

  const mockMatches = {
    req_001: [
      {
        id: 'match_001',
        supplier_id: 'sup_001',
        supplier_name: 'Apex Pharmaceuticals Ltd',
        supplier_location: 'Mumbai, India',
        supplier_type: 'Manufacturer',
        product_id: 'prod_001',
        product_name: 'Amoxicillin Capsules 500mg',
        api_name: 'Amoxicillin',
        dosage_form: 'Capsules',
        strength: '500mg',
        pack_size: '10x10',
        unit_price_usd: 0.45,
        moq: 50000,
        lead_time_days: 21,
        available_quantity: 500000,
        similarity_score: 95,
        key_differentiators: [
          'WHO-GMP certified facility',
          'Competitive pricing below budget',
          'Fast delivery within 3 weeks',
          'Large inventory availability'
        ],
        last_updated: '2 hours ago'
      },
      {
        id: 'match_002',
        supplier_id: 'sup_002',
        supplier_name: 'BioMed Solutions Inc',
        supplier_location: 'Hyderabad, India',
        supplier_type: 'Manufacturer',
        product_id: 'prod_002',
        product_name: 'Amoxicillin Capsules 500mg',
        api_name: 'Amoxicillin',
        dosage_form: 'Capsules',
        strength: '500mg',
        pack_size: '10x10',
        unit_price_usd: 0.48,
        moq: 25000,
        lead_time_days: 28,
        available_quantity: 300000,
        similarity_score: 92,
        key_differentiators: [
          'FDA approved facility',
          'Lower MOQ requirement',
          'Established quality track record',
          'Flexible packaging options'
        ],
        last_updated: '4 hours ago'
      },
      {
        id: 'match_003',
        supplier_id: 'sup_003',
        supplier_name: 'Global Pharma Manufacturing',
        supplier_location: 'Ahmedabad, India',
        supplier_type: 'Contract Manufacturer',
        product_id: 'prod_003',
        product_name: 'Amoxicillin Capsules 500mg',
        api_name: 'Amoxicillin',
        dosage_form: 'Capsules',
        strength: '500mg',
        pack_size: '10x10',
        unit_price_usd: 0.52,
        moq: 100000,
        lead_time_days: 35,
        available_quantity: 200000,
        similarity_score: 88,
        key_differentiators: [
          'ISO 13485 certified',
          'Custom formulation capabilities',
          'Strong regulatory support',
          'Cost-effective for large volumes'
        ],
        last_updated: '1 day ago'
      }
    ],
    req_002: [
      {
        id: 'match_004',
        supplier_id: 'sup_004',
        supplier_name: 'MediCore Pharmaceuticals',
        supplier_location: 'Chennai, India',
        supplier_type: 'Manufacturer',
        product_id: 'prod_004',
        product_name: 'Paracetamol Tablets 650mg',
        api_name: 'Paracetamol',
        dosage_form: 'Tablets',
        strength: '650mg',
        pack_size: '20x10',
        unit_price_usd: 0.28,
        moq: 100000,
        lead_time_days: 25,
        available_quantity: 800000,
        similarity_score: 94,
        key_differentiators: [
          'Excellent price point',
          'High volume capacity',
          'Proven hospital supply experience',
          'Consistent quality standards'
        ],
        last_updated: '3 hours ago'
      }
    ]
  };

  const sortOptions = [
    { value: 'similarity_score', label: 'Similarity Score (High to Low)' },
    { value: 'unit_price_usd', label: 'Price (Low to High)' },
    { value: 'lead_time_days', label: 'Lead Time (Shortest First)' },
    { value: 'available_quantity', label: 'Available Quantity (High to Low)' }
  ];

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    setIsLoading(true);
    try {
      // Por ahora seguimos usando mocks
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRequirements(mockRequirements);
    } catch (error) {
      console.error('Error loading requirements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMatches = async (requirementId) => {
    if (expandedRequirement === requirementId) {
      setExpandedRequirement(null);
      setMatches([]);
      setSelectedRequirement(null);
      return;
    }

    setIsMatchingLoading(true);
    setExpandedRequirement(requirementId);

    const requirement = requirements?.find((req) => req?.id === requirementId);
    setSelectedRequirement(requirement);

    try {
      // Simulación de matching
      await new Promise((resolve) => setTimeout(resolve, 800));

      const requirementMatches = mockMatches?.[requirementId] || [];
      const filteredMatches = applyFilters(requirementMatches);
      const sortedMatches = sortMatches(filteredMatches);

      setMatches(sortedMatches);
    } catch (error) {
      console.error('Error finding matches:', error);
      setMatches([]);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  const applyFilters = (matchList) => {
    return matchList?.filter((match) => {
      if (
        filters?.similarityThreshold &&
        match?.similarity_score < parseInt(filters?.similarityThreshold)
      ) {
        return false;
      }
      if (
        filters?.location &&
        !match?.supplier_location
          ?.toLowerCase()
          ?.includes(filters?.location?.toLowerCase())
      ) {
        return false;
      }
      if (filters?.leadTime && match?.lead_time_days > parseInt(filters?.leadTime)) {
        return false;
      }
      if (filters?.maxPrice && match?.unit_price_usd > parseFloat(filters?.maxPrice)) {
        return false;
      }
      if (filters?.minMoq && match?.moq < parseInt(filters?.minMoq)) {
        return false;
      }
      if (
        filters?.minQuantity &&
        match?.available_quantity < parseInt(filters?.minQuantity)
      ) {
        return false;
      }
      return true;
    });
  };

  const sortMatches = (matchList) => {
    return [...matchList]?.sort((a, b) => {
      switch (sortBy) {
        case 'similarity_score':
          return b?.similarity_score - a?.similarity_score;
        case 'unit_price_usd':
          return a?.unit_price_usd - b?.unit_price_usd;
        case 'lead_time_days':
          return a?.lead_time_days - b?.lead_time_days;
        case 'available_quantity':
          return b?.available_quantity - a?.available_quantity;
        default:
          return b?.similarity_score - a?.similarity_score;
      }
    });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);

    if (selectedRequirement && mockMatches?.[selectedRequirement?.id]) {
      const requirementMatches = mockMatches?.[selectedRequirement?.id];
      const filteredMatches = applyFilters(requirementMatches);
      const sortedMatches = sortMatches(filteredMatches);
      setMatches(sortedMatches);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      similarityThreshold: '60',
      location: '',
      leadTime: '',
      maxPrice: '',
      minMoq: '',
      minQuantity: ''
    };
    setFilters(clearedFilters);
    handleFiltersChange(clearedFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const sortedMatches = sortMatches(matches);
    setMatches(sortedMatches);
  };

  const handleCreateDeal = (match) => {
    setSelectedMatch(match);
    setIsCreateDealModalOpen(true);
  };

  // ---------- Crear DEAL REAL en Supabase ----------
  const handleDealCreated = async (formValues) => {
    if (!selectedRequirement || !selectedMatch) {
      alert('No requirement or match selected.');
      return;
    }

    try {
      // Campos básicos y seguros (ajustados al esquema típico de deals)
      const payload = {
        // OJO: si tus columnas client_id / supplier_id son UUID,
        // y aquí los IDs son strings mock (client_001, sup_001),
        // déjalos en null hasta que conectemos Intelligent Matching 100% a BD.
        client_id: null,
        supplier_id: null,
        client_requirement_id: null,
        supplier_product_id: null,
        title:
          formValues?.title ||
          `${selectedRequirement.product_name} - ${selectedMatch.supplier_name}`,
        stage: formValues?.stage || 'Qualification',
        value_usd:
          formValues?.dealValue !== undefined && formValues?.dealValue !== ''
            ? Number(formValues.dealValue)
            : selectedRequirement?.budget_usd || null,
        currency: 'USD',
        probability:
          formValues?.probability !== undefined && formValues?.probability !== ''
            ? Number(formValues.probability)
            : 50,
        close_date: formValues?.expectedCloseDate || selectedRequirement?.required_date || null,
        status: 'open',
        source: 'intelligent_matching',
        notes: formValues?.internalNotes || null
      };

      const { error } = await supabase.from('deals').insert(payload);

      if (error) {
        console.error('Supabase error creating deal:', error);
        alert(`Error creating deal in Supabase: ${error.message}`);
        return;
      }

      alert('Deal created successfully in Supabase!');
      setIsCreateDealModalOpen(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error('Unexpected error creating deal:', error);
      alert('Error creating deal. Check console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingOverlay isLoading={true} message="Loading requirements..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Intelligent Matching
                </h1>
                <p className="text-text-secondary">
                  AI-powered supplier-client requirement matching with similarity scoring for
                  optimal deal creation
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={loadRequirements}
                >
                  Refresh
                </Button>
                <Button
                  variant="default"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                >
                  Configure Matching
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterPanelOpen}
            onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          />

          {/* Requirements List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Client Requirements ({requirements?.length})
              </h2>
              {expandedRequirement && matches?.length > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-text-secondary">Sort matches by:</span>
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-64"
                  />
                </div>
              )}
            </div>

            {requirements?.length === 0 ? (
              <div className="bg-surface border border-border rounded-lg clinical-shadow p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Requirements Found
                    </h3>
                    <p className="text-text-secondary max-w-md">
                      There are no active client requirements to match. Create new requirements
                      in the Clients Management section.
                    </p>
                  </div>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => (window.location.href = '/clients-management')}
                  >
                    Add Requirements
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {requirements?.map((requirement) => (
                  <div key={requirement?.id} className="space-y-4">
                    <RequirementCard
                      requirement={requirement}
                      onViewMatches={handleViewMatches}
                      isExpanded={expandedRequirement === requirement?.id}
                    />

                    {expandedRequirement === requirement?.id && (
                      <div className="ml-6 pl-6 border-l-2 border-primary">
                        <MatchingResults
                          requirement={selectedRequirement}
                          matches={matches}
                          isLoading={isMatchingLoading}
                          onCreateDeal={handleCreateDeal}
                          onLoadMore={() => {}}
                          hasMore={false}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Deal Modal */}
      <CreateDealModal
        isOpen={isCreateDealModalOpen}
        onClose={() => {
          setIsCreateDealModalOpen(false);
          setSelectedMatch(null);
        }}
        match={selectedMatch}
        requirement={selectedRequirement}
        onCreateDeal={handleDealCreated}
      />
    </div>
  );
};

export default IntelligentMatching;

