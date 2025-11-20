import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import OrderForm from './components/OrderForm';
import OrdersTable from './components/OrdersTable';
import OrderDetailsModal from './components/OrderDetailsModal';
import OrderStats from './components/OrderStats';
import Button from '../../components/ui/Button';


const PurchaseOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Mock data for purchase orders
  const mockOrders = [
    {
      id: 'order-1',
      order_number: 'PO-2025001',
      client_id: 'client-1',
      client_name: 'MedCorp Pharmaceuticals',
      supplier_id: 'supplier-1',
      supplier_name: 'Apex Pharma Manufacturing',
      product_name: 'Amoxicillin Capsules',
      api_name: 'Amoxicillin Trihydrate',
      dosage_form: 'capsule',
      strength: '500mg',
      pack_size: '10x10 capsules',
      units: 5000,
      unit_price_usd: 0.25,
      other_costs_usd: 150.00,
      commission_rate: 0.05,
      base_amount_usd: 1400.00,
      commission_usd: 70.00,
      total_amount_usd: 1470.00,
      status: 'confirmed',
      expected_delivery_date: '2025-02-15',
      notes: 'Urgent order for Q1 inventory replenishment',
      created_at: '2025-01-15T10:30:00Z'
    },
    {
      id: 'order-2',
      order_number: 'PO-2025002',
      client_id: 'client-2',
      client_name: 'HealthFirst Distribution',
      supplier_id: 'supplier-2',
      supplier_name: 'BioMed Industries Ltd',
      product_name: 'Paracetamol Tablets',
      api_name: 'Paracetamol',
      dosage_form: 'tablet',
      strength: '500mg',
      pack_size: '20x10 tablets',
      units: 10000,
      unit_price_usd: 0.15,
      other_costs_usd: 200.00,
      commission_rate: 0.05,
      base_amount_usd: 1700.00,
      commission_usd: 85.00,
      total_amount_usd: 1785.00,
      status: 'processing',
      expected_delivery_date: '2025-02-20',
      notes: 'Standard monthly order',
      created_at: '2025-01-18T14:15:00Z'
    },
    {
      id: 'order-3',
      order_number: 'PO-2025003',
      client_id: 'client-3',
      client_name: 'Global Medical Supply',
      supplier_id: 'supplier-3',
      supplier_name: 'ChemCore Laboratories',
      product_name: 'Ibuprofen Tablets',
      api_name: 'Ibuprofen',
      dosage_form: 'tablet',
      strength: '400mg',
      pack_size: '10x10 tablets',
      units: 7500,
      unit_price_usd: 0.20,
      other_costs_usd: 100.00,
      commission_rate: 0.06,
      base_amount_usd: 1600.00,
      commission_usd: 96.00,
      total_amount_usd: 1696.00,
      status: 'shipped',
      expected_delivery_date: '2025-02-10',
      notes: 'Express shipping requested',
      created_at: '2025-01-20T09:45:00Z'
    },
    {
      id: 'order-4',
      order_number: 'PO-2025004',
      client_id: 'client-4',
      client_name: 'PharmaTech Solutions',
      supplier_id: 'supplier-4',
      supplier_name: 'DrugSource International',
      product_name: 'Omeprazole Capsules',
      api_name: 'Omeprazole',
      dosage_form: 'capsule',
      strength: '20mg',
      pack_size: '10x10 capsules',
      units: 3000,
      unit_price_usd: 0.35,
      other_costs_usd: 75.00,
      commission_rate: 0.05,
      base_amount_usd: 1125.00,
      commission_usd: 56.25,
      total_amount_usd: 1181.25,
      status: 'pending',
      expected_delivery_date: '2025-02-25',
      notes: 'Awaiting client confirmation',
      created_at: '2025-01-22T11:20:00Z'
    },
    {
      id: 'order-5',
      order_number: 'PO-2025005',
      client_id: 'client-1',
      client_name: 'MedCorp Pharmaceuticals',
      supplier_id: 'supplier-2',
      supplier_name: 'BioMed Industries Ltd',
      product_name: 'Metformin Tablets',
      api_name: 'Metformin HCl',
      dosage_form: 'tablet',
      strength: '500mg',
      pack_size: '10x10 tablets',
      units: 8000,
      unit_price_usd: 0.18,
      other_costs_usd: 120.00,
      commission_rate: 0.05,
      base_amount_usd: 1560.00,
      commission_usd: 78.00,
      total_amount_usd: 1638.00,
      status: 'delivered',
      expected_delivery_date: '2025-01-30',
      notes: 'Delivered on time',
      created_at: '2025-01-10T16:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate loading orders
    setIsLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleCreateOrder = (orderData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newOrder = {
        ...orderData,
        id: `order-${Date.now()}`,
        client_name: getClientName(orderData?.client_id),
        supplier_name: getSupplierName(orderData?.supplier_id)
      };
      
      setOrders(prev => [newOrder, ...prev]);
      setShowForm(false);
      setIsLoading(false);
      
      // Show success message (you could implement a toast notification here)
      console.log('Order created successfully:', newOrder);
    }, 1500);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev?.map(order => 
      order?.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    
    // Show success message
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev?.filter(order => order?.id !== orderId));
      console.log(`Order ${orderId} deleted`);
    }
  };

  const getClientName = (clientId) => {
    const clientMap = {
      'client-1': 'MedCorp Pharmaceuticals',
      'client-2': 'HealthFirst Distribution',
      'client-3': 'Global Medical Supply',
      'client-4': 'PharmaTech Solutions'
    };
    return clientMap?.[clientId] || 'Unknown Client';
  };

  const getSupplierName = (supplierId) => {
    const supplierMap = {
      'supplier-1': 'Apex Pharma Manufacturing',
      'supplier-2': 'BioMed Industries Ltd',
      'supplier-3': 'ChemCore Laboratories',
      'supplier-4': 'DrugSource International'
    };
    return supplierMap?.[supplierId] || 'Unknown Supplier';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LoadingOverlay isLoading={isLoading} message="Processing order..." />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
              <p className="text-text-secondary mt-2">
                Create and manage purchase orders with automatic calculations and commission tracking
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowForm(!showForm)}
                iconName={showForm ? "X" : "Plus"}
                iconPosition="left"
              >
                {showForm ? 'Cancel' : 'Create Order'}
              </Button>
              <Button
                iconName="Download"
                iconPosition="left"
              >
                Export Orders
              </Button>
            </div>
          </div>

          {/* Order Statistics */}
          <OrderStats orders={orders} />

          {/* Order Form */}
          {showForm && (
            <div className="mb-8">
              <OrderForm 
                onSubmit={handleCreateOrder}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Orders Table */}
          <OrdersTable
            orders={orders}
            onViewOrder={handleViewOrder}
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={handleDeleteOrder}
          />

          {/* Order Details Modal */}
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOrder(null);
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </main>
    </div>
  );
};

export default PurchaseOrdersPage;