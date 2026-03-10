import { useState, useEffect } from 'react';
import { getAppVersion, getEnvironment } from '../utils/env';

const VersionInfo = ({ style = {} }) => {
  const version = getAppVersion();
  const environment = getEnvironment();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: "'Encode Sans', sans-serif",
    flexWrap: 'wrap',
    ...style,
  };

  const badgeStyle = {
    padding: '4px 8px',
    borderRadius: '50px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };

  const versionBadgeStyle = {
    ...badgeStyle,
    backgroundColor: 'var(--secondary-color, #6B7280)',
    color: 'white',
  };

  const getEnvironmentBadgeStyle = () => {
    const baseStyle = { ...badgeStyle };
    switch (environment) {
      case 'LOCAL':
        return {
          ...baseStyle,
          backgroundColor: '#4CAF50',
          color: 'white',
        };
      case 'QA':
        return {
          ...baseStyle,
          backgroundColor: '#FF9800',
          color: 'white',
        };
      case 'PRODUCTION':
        return {
          ...baseStyle,
          backgroundColor: 'var(--accent-color, #F10036)',
          color: 'white',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#757575',
          color: 'white',
        };
    }
  };

  return (
    <div style={containerStyle}>
      <span style={versionBadgeStyle}>
        {!isSmallScreen && 'Versión: '}
        {version}
      </span>
      <span style={getEnvironmentBadgeStyle()}>
        {!isSmallScreen && 'Ambiente: '}
        {environment}
      </span>
    </div>
  );
};

export default VersionInfo;
