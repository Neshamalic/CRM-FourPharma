import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  
  const pathMap = {
    '/global-search': 'Global Search',
    '/suppliers-management': 'Suppliers Management',
    '/clients-management': 'Clients Management',
    '/intelligent-matching': 'Intelligent Matching',
    '/deals-management': 'Deals Management',
    '/purchase-orders': 'Purchase Orders'
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Dashboard', path: '/' }];
    
    let currentPath = '';
    pathSegments?.forEach(segment => {
      currentPath += `/${segment}`;
      const label = pathMap?.[currentPath] || segment?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase());
      breadcrumbs?.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    if (path !== location?.pathname) {
      window.location.href = path;
    }
  };

  if (breadcrumbs?.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-border" />
          )}
          <button
            onClick={() => handleNavigation(crumb?.path)}
            className={`transition-clinical ${
              index === breadcrumbs?.length - 1
                ? 'text-foreground font-medium cursor-default'
                : 'hover:text-foreground cursor-pointer'
            }`}
            disabled={index === breadcrumbs?.length - 1}
          >
            {crumb?.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;