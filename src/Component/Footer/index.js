import React, { useState, useEffect } from "react";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import MobileFooter from "./MobileFooter";
import DesktopFooter from "./DesktopFooter";

const Footer = ({ mainWrapper }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    isMobileViewHook(setIsMobile, 992);
  }, [window.innerWidth]);

  return (
    <>
      {/* {isMobile ? (
        <MobileFooter mainWrapper={mainWrapper} />
      ) : (
        <DesktopFooter mainWrapper={mainWrapper} />
      )} */}
      <DesktopFooter mainWrapper={mainWrapper} />
    </>
  );
};

export default Footer;
