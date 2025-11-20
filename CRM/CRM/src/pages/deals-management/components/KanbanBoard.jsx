import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import DealCard from './DealCard';

const KanbanBoard = ({ deals, onStageChange, onEdit, onView, userRole = 'editor' }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = ['Lead', 'Negotiation', 'Contract', 'Closed'];

  const getStageDeals = (stage) => {
    return deals?.filter(deal => deal?.stage === stage);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'border-blue-200 bg-blue-50',
      'Negotiation': 'border-yellow-200 bg-yellow-50',
      'Contract': 'border-purple-200 bg-purple-50',
      'Closed': 'border-green-200 bg-green-50'
    };
    return colors?.[stage] || 'border-gray-200 bg-gray-50';
  };

  const getStageIcon = (stage) => {
    const icons = {
      'Lead': 'Target',
      'Negotiation': 'MessageSquare',
      'Contract': 'FileText',
      'Closed': 'CheckCircle'
    };
    return icons?.[stage] || 'Circle';
  };

  const calculateStageValue = (stage) => {
    const stageDeals = getStageDeals(stage);
    return stageDeals?.reduce((total, deal) => total + deal?.deal_value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const handleDragStart = (e, deal) => {
    if (userRole !== 'editor') return;
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStage) => {
    e?.preventDefault();
    if (draggedDeal && draggedDeal?.stage !== targetStage && userRole === 'editor') {
      onStageChange(draggedDeal?.id, targetStage);
    }
    setDraggedDeal(null);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {stages?.map((stage) => {
        const stageDeals = getStageDeals(stage);
        const stageValue = calculateStageValue(stage);

        return (
          <div
            key={stage}
            className={`flex-shrink-0 w-80 rounded-lg border-2 ${getStageColor(stage)} transition-clinical`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {/* Stage Header */}
            <div className="p-4 border-b border-border bg-surface rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={getStageIcon(stage)} size={18} className="text-text-secondary" />
                  <h3 className="font-semibold text-foreground">{stage}</h3>
                  <span className="bg-muted text-text-secondary px-2 py-1 rounded-full text-xs font-medium">
                    {stageDeals?.length}
                  </span>
                </div>
              </div>
              <div className="text-sm text-text-secondary">
                Total: <span className="font-semibold text-foreground">{formatCurrency(stageValue)}</span>
              </div>
            </div>
            {/* Stage Content */}
            <div className="p-4 space-y-3 min-h-96 max-h-96 overflow-y-auto">
              {stageDeals?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon name="Package" size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-text-secondary">No deals in {stage?.toLowerCase()}</p>
                  {userRole === 'editor' && stage === 'Lead' && (
                    <p className="text-xs text-text-secondary mt-1">
                      Create deals from matches
                    </p>
                  )}
                </div>
              ) : (
                stageDeals?.map((deal) => (
                  <div
                    key={deal?.id}
                    draggable={userRole === 'editor'}
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-${userRole === 'editor' ? 'move' : 'default'} ${
                      draggedDeal?.id === deal?.id ? 'opacity-50' : ''
                    }`}
                  >
                    <DealCard
                      deal={deal}
                      onStageChange={onStageChange}
                      onEdit={onEdit}
                      onView={onView}
                      userRole={userRole}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;