import React, { useState, useCallback, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import SearchInput from './components/SearchInput';
import SearchFilters from './components/SearchFilters';
import SearchSummary from './components/SearchSummary';
import SearchResultsTable from './components/SearchResultsTable';
import Icon from '../../components/AppIcon';


const GlobalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dosageForm: '',
    strength: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data for search results
  const mockSearchResults = [
    {
      id: 'prod_001',
      supplier_id: 'sup_001',
      supplier_name: 'PharmaCorp International',
      supplier_location: 'Mumbai, India',
      product_name: 'Paracetamol',
      dosage_form: 'Tablet',
      strength: '500mg',
      pack_size: '10x10 Blister',
      unit_price_usd: 0.05,
      moq: 10000,
      lead_time_days: 15,
      relevance_score: 0.95
    },
    {
      id: 'prod_002',
      supplier_id: 'sup_002',
      supplier_name: 'MediSupply Ltd',
      supplier_location: 'Bangkok, Thailand',
      product_name: 'Amoxicillin',
      dosage_form: 'Capsule',
      strength: '250mg',
      pack_size: '10x10 Blister',
      unit_price_usd: 0.12,
      moq: 5000,
      lead_time_days: 20,
      relevance_score: 0.88
    },
    {
      id: 'prod_003',
      supplier_id: 'sup_003',
      supplier_name: 'Global Pharma Solutions',
      supplier_location: 'Istanbul, Turkey',
      product_name: 'Ibuprofen',
      dosage_form: 'Tablet',
      strength: '400mg',
      pack_size: '20x10 Blister',
      unit_price_usd: 0.08,
      moq: 15000,
      lead_time_days: 12,
      relevance_score: 0.82
    },
    {
      id: 'prod_004',
      supplier_id: 'sup_004',
      supplier_name: 'Asian Medical Exports',
      supplier_location: 'Dhaka, Bangladesh',
      product_name: 'Azithromycin',
      dosage_form: 'Tablet',
      strength: '500mg',
      pack_size: '3x1 Blister',
      unit_price_usd: 0.45,
      moq: 2000,
      lead_time_days: 25,
      relevance_score: 0.78
    },
    {
      id: 'prod_005',
      supplier_id: 'sup_005',
      supplier_name: 'European Pharmaceuticals',
      supplier_location: 'Warsaw, Poland',
      product_name: 'Omeprazole',
      dosage_form: 'Capsule',
      strength: '20mg',
      pack_size: '14x1 Blister',
      unit_price_usd: 0.25,
      moq: 8000,
      lead_time_days: 18,
      relevance_score: 0.75
    },
    {
      id: 'prod_006',
      supplier_id: 'sup_006',
      supplier_name: 'Tropical Medicine Co',
      supplier_location: 'Lagos, Nigeria',
      product_name: 'Artemether + Lumefantrine',
      dosage_form: 'Tablet',
      strength: '20mg+120mg',
      pack_size: '6x4 Blister',
      unit_price_usd: 1.20,
      moq: 1000,
      lead_time_days: 30,
      relevance_score: 0.72
    },
    {
      id: 'prod_007',
      supplier_id: 'sup_007',
      supplier_name: 'Latin America Pharma',
      supplier_location: 'São Paulo, Brazil',
      product_name: 'Metformin',
      dosage_form: 'Tablet',
      strength: '500mg',
      pack_size: '30x1 Blister',
      unit_price_usd: 0.15,
      moq: 12000,
      lead_time_days: 22,
      relevance_score: 0.70
    },
    {
      id: 'prod_008',
      supplier_id: 'sup_008',
      supplier_name: 'Pacific Medical Supplies',
      supplier_location: 'Manila, Philippines',
      product_name: 'Ceftriaxone',
      dosage_form: 'Injection',
      strength: '1g',
      pack_size: '1 Vial',
      unit_price_usd: 2.50,
      moq: 500,
      lead_time_days: 14,
      relevance_score: 0.68
    }
  ];

  // Simulate API search with debouncing
  const performSearch = useCallback(async (query, currentFilters) => {
    if (!query && !currentFilters?.dosageForm && !currentFilters?.strength) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter mock results based on search query and filters
    let filteredResults = mockSearchResults;

    if (query) {
      const searchTerm = query?.toLowerCase();
      filteredResults = filteredResults?.filter(product =>
        product?.product_name?.toLowerCase()?.includes(searchTerm) ||
        product?.dosage_form?.toLowerCase()?.includes(searchTerm) ||
        product?.strength?.toLowerCase()?.includes(searchTerm) ||
        product?.pack_size?.toLowerCase()?.includes(searchTerm) ||
        product?.supplier_name?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (currentFilters?.dosageForm) {
      filteredResults = filteredResults?.filter(product =>
        product?.dosage_form?.toLowerCase() === currentFilters?.dosageForm?.toLowerCase()
      );
    }

    if (currentFilters?.strength) {
      filteredResults = filteredResults?.filter(product =>
        product?.strength?.toLowerCase() === currentFilters?.strength?.toLowerCase()
      );
    }

    // Sort by relevance score (descending)
    filteredResults?.sort((a, b) => b?.relevance_score - a?.relevance_score);

    // Limit to 50 results
    filteredResults = filteredResults?.slice(0, 50);

    setSearchResults(filteredResults);
    setIsLoading(false);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    performSearch(query, filters);
  }, [filters, performSearch]);

  const handleFilterChange = useCallback((filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setFilters(newFilters);
    performSearch(searchQuery, newFilters);
  }, [filters, searchQuery, performSearch]);

  const handleCreateDeal = (product) => {
    // Navigate to deals management with pre-filled data
    console.log('Creating deal for product:', product);
    // In a real app, this would navigate to /deals-management with product data
    alert(`Creating deal for ${product?.product_name} from ${product?.supplier_name}`);
  };

  const handleViewSupplier = (supplierId) => {
    // Navigate to supplier details
    console.log('Viewing supplier:', supplierId);
    // In a real app, this would navigate to /suppliers-management with supplier details
    alert(`Viewing supplier details for ID: ${supplierId}`);
  };

  // Load initial data or handle URL parameters
  useEffect(() => {
    // Check if there are URL parameters for initial search
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams?.get('q');
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery, filters);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          <SearchInput
            onSearch={handleSearch}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
          
          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
          />
          
          {hasSearched && (
            <>
              <SearchSummary
                totalResults={searchResults?.length}
                searchQuery={searchQuery}
                filters={filters}
                isLoading={isLoading}
              />
              
              <SearchResultsTable
                results={searchResults}
                onCreateDeal={handleCreateDeal}
                onViewSupplier={handleViewSupplier}
                isLoading={isLoading}
              />
            </>
          )}
          
          {!hasSearched && !isLoading && (
            <div className="bg-surface p-12 rounded-lg clinical-shadow text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Start Your Product Search
                </h3>
                <p className="text-text-secondary mb-6">
                  Enter a product name, API, dosage form, or strength to discover pharmaceutical products from suppliers worldwide.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-medium text-foreground mb-1">Popular Searches</div>
                    <div className="text-text-secondary space-y-1">
                      <div>• Paracetamol</div>
                      <div>• Amoxicillin</div>
                      <div>• Ibuprofen</div>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-medium text-foreground mb-1">Search Tips</div>
                    <div className="text-text-secondary space-y-1">
                      <div>• Use generic names</div>
                      <div>• Include strength</div>
                      <div>• Try dosage forms</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <LoadingOverlay isLoading={false} />
    </div>
  );
};

export default GlobalSearch;