import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import SuppliersTable from './components/SuppliersTable';
import ProductsPanel from './components/ProductsPanel';
import SupplierModal from './components/SupplierModal';
import ProductModal from './components/ProductModal';
import BulkActionsModal from './components/BulkActionsModal';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import { supabase } from '../../utils/supabaseClient';

const SuppliersManagement = () => {
  // State management
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);

  // Modal states
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Selection states
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // User role (mock - in real app this would come from auth context)
  const [userRole] = useState('editor'); // 'editor' or 'viewer'

  // ---------- MOCK DATA (fallback) ----------
  const mockSuppliers = [
    {
      id: 'sup-001',
      company_name: 'PharmaCorp International',
      contact_person: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@pharmacorp.com',
      phone: '+1-555-0123',
      location: 'New York, USA',
      status: 'active',
      website: 'https://pharmacorp.com',
      notes: 'Leading supplier of cardiovascular medications',
      product_count: 45,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'sup-002',
      company_name: 'Global Meds Ltd',
      contact_person: 'Michael Chen',
      email: 'michael.chen@globalmeds.com',
      phone: '+44-20-7123-4567',
      location: 'London, UK',
      status: 'active',
      website: 'https://globalmeds.com',
      notes: 'Specializes in generic pharmaceuticals',
      product_count: 78,
      created_at: '2024-02-20T14:15:00Z'
    },
    {
      id: 'sup-003',
      company_name: 'BioTech Solutions',
      contact_person: 'Dr. Priya Sharma',
      email: 'priya.sharma@biotech-sol.com',
      phone: '+91-11-2345-6789',
      location: 'Mumbai, India',
      status: 'pending',
      website: 'https://biotech-solutions.com',
      notes: 'Emerging supplier with innovative drug delivery systems',
      product_count: 23,
      created_at: '2024-03-10T09:45:00Z'
    },
    {
      id: 'sup-004',
      company_name: 'European Pharma Group',
      contact_person: 'Hans Mueller',
      email: 'hans.mueller@europharma.de',
      phone: '+49-30-1234-5678',
      location: 'Berlin, Germany',
      status: 'inactive',
      website: 'https://europharma.de',
      notes: 'Currently undergoing regulatory compliance review',
      product_count: 56,
      created_at: '2024-01-05T16:20:00Z'
    },
    {
      id: 'sup-005',
      company_name: 'MediSupply Australia',
      contact_person: 'Emma Thompson',
      email: 'emma.thompson@medisupply.au',
      phone: '+61-2-9876-5432',
      location: 'Sydney, Australia',
      status: 'active',
      website: 'https://medisupply.com.au',
      notes: 'Regional distributor for Asia-Pacific markets',
      product_count: 34,
      created_at: '2024-02-28T11:10:00Z'
    }
  ];

  const mockProducts = [
    {
      id: 'prod-001',
      supplier_id: 'sup-001',
      api_name: 'Atorvastatin',
      dosage_form: 'tablet',
      strength: '20mg',
      pack_size: '10x10',
      unit_price_usd: 0.45,
      moq: 10000,
      lead_time_days: 30,
      description: 'Cholesterol-lowering medication'
    },
    {
      id: 'prod-002',
      supplier_id: 'sup-001',
      api_name: 'Metformin',
      dosage_form: 'tablet',
      strength: '500mg',
      pack_size: '10x15',
      unit_price_usd: 0.12,
      moq: 50000,
      lead_time_days: 25,
      description: 'Type 2 diabetes medication'
    },
    {
      id: 'prod-003',
      supplier_id: 'sup-001',
      api_name: 'Lisinopril',
      dosage_form: 'tablet',
      strength: '10mg',
      pack_size: '10x10',
      unit_price_usd: 0.28,
      moq: 25000,
      lead_time_days: 35,
      description: 'ACE inhibitor for hypertension'
    },
    {
      id: 'prod-004',
      supplier_id: 'sup-002',
      api_name: 'Amoxicillin',
      dosage_form: 'capsule',
      strength: '250mg',
      pack_size: '10x10',
      unit_price_usd: 0.18,
      moq: 100000,
      lead_time_days: 20,
      description: 'Broad-spectrum antibiotic'
    },
    {
      id: 'prod-005',
      supplier_id: 'sup-002',
      api_name: 'Paracetamol',
      dosage_form: 'tablet',
      strength: '500mg',
      pack_size: '10x20',
      unit_price_usd: 0.08,
      moq: 200000,
      lead_time_days: 15,
      description: 'Pain reliever and fever reducer'
    },
    {
      id: 'prod-006',
      supplier_id: 'sup-003',
      api_name: 'Insulin Glargine',
      dosage_form: 'injection',
      strength: '100IU/ml',
      pack_size: '3ml cartridge',
      unit_price_usd: 25.50,
      moq: 1000,
      lead_time_days: 45,
      description: 'Long-acting insulin for diabetes'
    }
  ];

  // ---------- Inicializar datos desde Supabase (con fallback a mocks) ----------
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('suppliers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const mappedSuppliers =
          data && data.length > 0
            ? data.map(s => ({
                id: s.id,
                company_name: s.name,
                contact_person: s.contact_name,
                email: s.contact_email,
                phone: s.contact_phone,
                // usamos country como "location" en la UI por ahora
                location: s.country || '',
                status: s.status || 'active',
                website: '', // no está en BD aún, se queda solo en frontend
                notes: s.notes,
                // por ahora no tenemos tabla de productos real, dejamos 0
                product_count: 0,
                created_at: s.created_at
              }))
            : mockSuppliers;

        setSuppliers(mappedSuppliers);
      } catch (error) {
        console.error('Error loading suppliers from Supabase, using mock data:', error);
        setSuppliers(mockSuppliers);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // ---------- Cargar productos (mock) cuando cambia el supplier ----------
  useEffect(() => {
    if (selectedSupplierId) {
      const loadProducts = async () => {
        setIsProductsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        const supplierProducts = mockProducts?.filter(
          p => p?.supplier_id === selectedSupplierId
        );
        setProducts(supplierProducts);
        setIsProductsLoading(false);
      };

      loadProducts();
    } else {
      setProducts([]);
    }
  }, [selectedSupplierId]);

  // ---------- Filtros ----------
  const filteredSuppliers = suppliers?.filter(supplier => {
    const search = searchTerm?.toLowerCase();
    const matchesSearch =
      supplier?.company_name?.toLowerCase()?.includes(search) ||
      supplier?.contact_person?.toLowerCase()?.includes(search) ||
      supplier?.location?.toLowerCase()?.includes(search);

    const matchesStatus =
      statusFilter === 'all' || supplier?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ---------- Selección de supplier ----------
  const handleSelectSupplier = supplierId => {
    setSelectedSupplierId(supplierId);
    const supplier = suppliers?.find(s => s?.id === supplierId);
    setSelectedSupplier(supplier);
  };

  // ---------- CRUD Suppliers (con Supabase + local state) ----------
  const handleEditSupplier = supplier => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleSaveSupplier = async supplierData => {
    setIsLoading(true);
    try {
      if (editingSupplier) {
        // UPDATE en Supabase solo si no es mock (UUID vs “sup-xxx”)
        if (!editingSupplier.id.startsWith('sup-')) {
          const { error } = await supabase
            .from('suppliers')
            .update({
              name: supplierData.company_name,
              country: supplierData.location,
              segment: null, // podríamos usar supplierData.segment / industry más adelante
              contact_name: supplierData.contact_person,
              contact_email: supplierData.email,
              contact_phone: supplierData.phone,
              status: supplierData.status,
              notes: supplierData.notes
            })
            .eq('id', editingSupplier.id);

          if (error) {
            console.error('Error updating supplier in Supabase:', error);
            alert(
              `No se pudo actualizar el proveedor en Supabase: ${
                error.message || 'Unknown error'
              }`
            );
          }
        }

        // Actualizar estado local
        setSuppliers(prev =>
          prev?.map(s =>
            s?.id === editingSupplier?.id
              ? {
                  ...s,
                  ...supplierData,
                  updated_at: new Date().toISOString()
                }
              : s
          )
        );

        if (selectedSupplier?.id === editingSupplier?.id) {
          setSelectedSupplier(prev =>
            prev ? { ...prev, ...supplierData } : prev
          );
        }
      } else {
        // INSERT en Supabase
        const { data, error } = await supabase
          .from('suppliers')
          .insert({
            name: supplierData.company_name,
            country: supplierData.location,
            segment: null,
            contact_name: supplierData.contact_person,
            contact_email: supplierData.email,
            contact_phone: supplierData.phone,
            status: supplierData.status,
            notes: supplierData.notes
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting supplier in Supabase:', error);
          alert(
            `No se pudo crear el proveedor en Supabase: ${
              error.message || 'Unknown error'
            }`
          );
          throw error;
        }

        const newSupplier = {
          id: data.id,
          company_name: data.name,
          contact_person: data.contact_name,
          email: data.contact_email,
          phone: data.contact_phone,
          location: data.country || '',
          status: data.status || 'active',
          website: supplierData.website || '',
          notes: data.notes,
          product_count: 0,
          created_at: data.created_at
        };

        setSuppliers(prev => [newSupplier, ...prev]);
      }

      setIsSupplierModalOpen(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error saving supplier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSupplier = async supplierId => {
    if (
      !window.confirm(
        'Are you sure you want to delete this supplier? This will also delete all associated products.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      // Solo borrar en Supabase si no es un supplier mock
      if (!supplierId.startsWith('sup-')) {
        const { error } = await supabase
          .from('suppliers')
          .delete()
          .eq('id', supplierId);

        if (error) {
          console.error('Error deleting supplier in Supabase:', error);
          alert(
            `No se pudo eliminar el proveedor en Supabase: ${
              error.message || 'Unknown error'
            }`
          );
        }
      }

      // Actualizar estado local
      setSuppliers(prev => prev?.filter(s => s?.id !== supplierId));
      if (selectedSupplierId === supplierId) {
        setSelectedSupplierId(null);
        setSelectedSupplier(null);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      alert('Ocurrió un error eliminando el proveedor.');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- CRUD Products (solo frontend / mock por ahora) ----------
  const handleEditProduct = (product /*, supplierId*/) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async productData => {
    setIsProductsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingProduct) {
        const updatedProducts = products?.map(p =>
          p?.id === editingProduct?.id
            ? { ...p, ...productData, updated_at: new Date()?.toISOString() }
            : p
        );
        setProducts(updatedProducts);
      } else {
        const newProduct = {
          id: `prod-${Date.now()}`,
          ...productData,
          created_at: new Date()?.toISOString()
        };
        setProducts(prev => [newProduct, ...prev]);

        // Update supplier product count
        setSuppliers(prev =>
          prev?.map(s =>
            s?.id === productData?.supplier_id
              ? { ...s, product_count: (s?.product_count || 0) + 1 }
              : s
          )
        );
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  const handleDeleteProduct = async productId => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsProductsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      setProducts(prev => prev?.filter(p => p?.id !== productId));

      if (selectedSupplier) {
        setSuppliers(prev =>
          prev?.map(s =>
            s?.id === selectedSupplier?.id
              ? {
                  ...s,
                  product_count: Math.max(0, (s?.product_count || 0) - 1)
                }
              : s
          )
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsProductsLoading(false);
    }
  };

  // ---------- Bulk actions ----------
  const handleBulkAction = async actionData => {
    setIsLoading(true);
    try {
      const realIds = (actionData?.supplierIds || []).filter(
        id => !id.startsWith('sup-')
      );

      switch (actionData?.type) {
        case 'update_status':
          // Actualizar en Supabase para suppliers reales
          if (realIds.length > 0) {
            const { error } = await supabase
              .from('suppliers')
              .update({ status: actionData?.status })
              .in('id', realIds);

            if (error) {
              console.error(
                'Error updating suppliers status in Supabase:',
                error
              );
            }
          }

          // Actualizar estado local
          setSuppliers(prev =>
            prev?.map(s =>
              actionData?.supplierIds?.includes(s?.id)
                ? {
                    ...s,
                    status: actionData?.status,
                    updated_at: new Date()?.toISOString()
                  }
                : s
            )
          );
          break;

        case 'delete':
          if (realIds.length > 0) {
            const { error } = await supabase
              .from('suppliers')
              .delete()
              .in('id', realIds);

            if (error) {
              console.error('Error deleting suppliers in Supabase:', error);
            }
          }

          setSuppliers(prev =>
            prev?.filter(s => !actionData?.supplierIds?.includes(s?.id))
          );
          if (actionData?.supplierIds?.includes(selectedSupplierId)) {
            setSelectedSupplierId(null);
            setSelectedSupplier(null);
            setProducts([]);
          }
          break;

        case 'export':
          // Aquí en una app real generarías un CSV/Excel
          console.log('Exporting suppliers:', actionData?.supplierIds);
          break;

        default:
          break;
      }

      setSelectedSuppliers([]);
      setSelectAll(false);
      setIsBulkModalOpen(false);
    } catch (error) {
      console.error('Error in bulk action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Selección de suppliers para bulk ----------
  const handleSupplierSelect = (supplierId, isSelected) => {
    if (isSelected) {
      setSelectedSuppliers(prev => [...prev, supplierId]);
    } else {
      setSelectedSuppliers(prev => prev?.filter(id => id !== supplierId));
    }
  };

  const handleSelectAll = isSelected => {
    setSelectAll(isSelected);
    if (isSelected) {
      setSelectedSuppliers(filteredSuppliers?.map(s => s?.id));
    } else {
      setSelectedSuppliers([]);
    }
  };

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
                <h1 className="text-2xl font-semibold text-foreground">
                  Suppliers Management
                </h1>
                <p className="text-text-secondary mt-1">
                  Manage your supplier network and product catalogs
                </p>
              </div>

              {/* Bulk Actions + Add Supplier */}
              <div className="flex items-center space-x-3">
                {selectedSuppliers?.length > 0 && userRole === 'editor' && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-text-secondary">
                      {selectedSuppliers?.length} selected
                    </span>
                    <Button
                      variant="outline"
                      iconName="Settings"
                      iconPosition="left"
                      onClick={() => setIsBulkModalOpen(true)}
                    >
                      Bulk Actions
                    </Button>
                  </div>
                )}

                {userRole === 'editor' && (
                  <Button
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => {
                      setEditingSupplier(null);
                      setIsSupplierModalOpen(true);
                    }}
                  >
                    Add New Supplier
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Suppliers Table */}
            <div className="xl:col-span-2">
              {/* Selection Header */}
              {userRole === 'editor' && (
                <div className="mb-4 p-4 bg-surface rounded-lg clinical-shadow">
                  <Checkbox
                    label={`Select all suppliers (${filteredSuppliers?.length})`}
                    checked={selectAll}
                    onChange={e => handleSelectAll(e?.target?.checked)}
                  />
                </div>
              )}

              <SuppliersTable
                suppliers={filteredSuppliers?.map(supplier => ({
                  ...supplier,
                  isSelected: selectedSuppliers?.includes(supplier?.id)
                }))}
                onSelectSupplier={handleSelectSupplier}
                selectedSupplierId={selectedSupplierId}
                onEditSupplier={handleEditSupplier}
                onDeleteSupplier={handleDeleteSupplier}
                userRole={userRole}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onSupplierSelect={handleSupplierSelect}
                showSelection={userRole === 'editor'}
              />
            </div>

            {/* Products Panel */}
            <div className="xl:col-span-1">
              <ProductsPanel
                supplier={selectedSupplier}
                products={products}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                userRole={userRole}
                isLoading={isProductsLoading}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setEditingSupplier(null);
        }}
        supplier={editingSupplier}
        onSave={handleSaveSupplier}
        isLoading={isLoading}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        supplierId={selectedSupplierId}
        onSave={handleSaveProduct}
        isLoading={isProductsLoading}
      />

      <BulkActionsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedSuppliers={selectedSuppliers}
        onBulkAction={handleBulkAction}
        isLoading={isLoading}
      />

      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} message="Processing..." />
    </div>
  );
};

export default SuppliersManagement;
