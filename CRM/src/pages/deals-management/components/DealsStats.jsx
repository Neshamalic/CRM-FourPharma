import React from 'react';
import Icon from '../../../components/AppIcon';

const DealsStats = ({ deals }) => {
  const calculateStats = () => {
    const totalDeals = deals?.length;
    const totalValue = deals?.reduce((sum, deal) => sum + deal?.deal_value, 0);
    const totalCommission = deals?.reduce((sum, deal) => sum + (deal?.deal_value * (deal?.commission_rate || 0)), 0);
    
    const stageStats = deals?.reduce((acc, deal) => {
      acc[deal.stage] = (acc?.[deal?.stage] || 0) + 1;
      return acc;
    }, {});

    const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;
    const closedDeals = stageStats?.['Closed'] || 0;
    const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;

    return {
      totalDeals,
      totalValue,
      totalCommission,
      avgDealValue,
      conversionRate,
      stageStats
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  const statCards = [
    {
      title: 'Total Deals',
      value: stats?.totalDeals?.toLocaleString(),
      icon: 'Package',
      color: 'text-primary',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats?.totalValue),
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Commission',
      value: formatCurrency(stats?.totalCommission),
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Avg Deal Value',
      value: formatCurrency(stats?.avgDealValue),
      icon: 'BarChart3',
      color: 'text-warning',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(stats?.conversionRate),
      icon: 'Target',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-surface p-4 rounded-lg clinical-shadow border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">{stat?.title}</p>
              <p className="text-xl font-semibold text-foreground">{stat?.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DealsStats;