import React from 'react';
import Icon from '../../../components/AppIcon';
import MatchCard from './MatchCard';
import LoadingOverlay from '../../../components/ui/LoadingOverlay';

const MatchingResults = ({ 
  requirement, 
  matches, 
  isLoading, 
  onCreateDeal, 
  onLoadMore, 
  hasMore 
}) => {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg clinical-shadow p-8">
        <LoadingOverlay isLoading={true} message="Finding best matches..." overlay={false} />
      </div>
    );
  }

  if (!matches || matches?.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg clinical-shadow p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Search" size={24} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Matches Found</h3>
            <p className="text-text-secondary max-w-md">
              We couldn't find any suppliers matching the current requirements and filters. 
              Try adjusting your filter criteria or check back later for new suppliers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const averageScore = matches?.reduce((sum, match) => sum + match?.similarity_score, 0) / matches?.length;
  const excellentMatches = matches?.filter(match => match?.similarity_score >= 90)?.length;
  const goodMatches = matches?.filter(match => match?.similarity_score >= 75)?.length;

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="bg-surface border border-border rounded-lg clinical-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Matching Results for {requirement?.product_name}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <span>{matches?.length} suppliers found</span>
            <span>•</span>
            <span>Avg. score: {averageScore?.toFixed(1)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle2" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Excellent Matches</span>
            </div>
            <p className="text-2xl font-bold text-success">{excellentMatches}</p>
            <p className="text-xs text-green-700">90%+ similarity</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertCircle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">Good Matches</span>
            </div>
            <p className="text-2xl font-bold text-warning">{goodMatches}</p>
            <p className="text-xs text-yellow-700">75%+ similarity</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Average Score</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{averageScore?.toFixed(1)}%</p>
            <p className="text-xs text-blue-700">Overall matching quality</p>
          </div>
        </div>
      </div>
      {/* Match Cards */}
      <div className="space-y-4">
        {matches?.map((match) => (
          <MatchCard
            key={match?.id}
            match={match}
            onCreateDeal={onCreateDeal}
          />
        ))}
      </div>
      {/* Load More */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-surface border border-border rounded-lg clinical-shadow hover:clinical-shadow-lg transition-clinical text-foreground hover:bg-muted"
          >
            <div className="flex items-center space-x-2">
              <Icon name="ChevronDown" size={16} />
              <span>Load More Matches</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchingResults;