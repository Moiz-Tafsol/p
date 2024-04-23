import React, { useState, useEffect } from 'react';
import { isMobileViewHook } from '../../CustomHooks/isMobileViewHook';
import DesktopHeader from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import PropTypes from 'prop-types';

const Header = ({
  backgroundColor,
  containerClass,
  className,
  logo,
  customStyle,
  headerClassName,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile, 992);
  }, [window.innerWidth]);

  return (
    <header
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 1,
      }}
      className={headerClassName}
    >
      {isMobile ? (
        <MobileHeader
          logo={logo}
          customStyle={customStyle}
        />
      ) : (
        <DesktopHeader
          logo={logo}
          backgroundColor={backgroundColor}
          containerClass={containerClass}
          className={className}
        />
      )}
    </header>
  );
};

export default Header;

Header.propTypes = {
  backgroundColor: PropTypes.string,
  containerClass: PropTypes.string,
  className: PropTypes.string,
  logo: PropTypes.object,
  customStyle: PropTypes.object,
};
