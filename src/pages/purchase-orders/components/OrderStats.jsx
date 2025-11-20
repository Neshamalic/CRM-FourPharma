import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderStats = ({ orders = [] }) => {
  // Calculate statistics
  const totalOrders = orders?.length;
  const totalValue = orders?.reduce((sum, order) => sum + order?.base_amount_usd, 0);
  const totalCommission = orders?.reduce((sum, order) => sum + order?.commission_usd, 0);
  
  const statusCounts = orders?.reduce((acc, order) => {
    acc[order.status] = (acc?.[order?.status] || 0) + 1;
    return acc;
  }, {});

  const pendingOrders = statusCounts?.pending || 0;
  const deliveredOrders = statusCounts?.delivered || 0;
  const completionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders?.toLocaleString('en-US'),
      icon: 'ShoppingCart',
      color: 'bg-primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Value',
      value: `$${totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      color: 'bg-accent',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Total Commission',
      value: `$${totalCommission?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: 'TrendingUp',
      color: 'bg-success',
      change: '+15.3%',
      changeType: 'positive'
    },
    {
      title: 'Pending Orders',
      value: pendingOrders?.toLocaleString('en-US'),
      icon: 'Clock',
      color: 'bg-warning',
      change: '-5.1%',
      changeType: 'negative'
    },
    {
      title: 'Completion Rate',
      value: `${completionRate?.toFixed(1)}%`,
      icon: 'CheckCircle',
      color: 'bg-secondary',
      change: '+2.4%',
      changeType: 'positive'
    },
    {
      title: 'Average Order Value',
      value: totalOrders > 0 ? `$${(totalValue / totalOrders)?.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00',
      icon: 'BarChart3',
      color: 'bg-primary',
      change: '+6.7%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-surface rounded-lg clinical-shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-text-secondary">{stat?.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium ${
                  stat?.changeType === 'positive' ? 'text-success' : 'text-destructive'
                }`}>
                  {stat?.change}
                </span>
                <span className="text-xs text-text-secondary ml-1">vs last month</span>
              </div>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 ${stat?.color} rounded-lg`}>
              <Icon name={stat?.icon} size={24} color="white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderStats;