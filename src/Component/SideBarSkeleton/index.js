import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { AfterLoginHeader } from "../Header/AfterLoginHeader";
import SideBar from "../SideBar";
import Drawer from "react-modern-drawer";
import classes from "./SideBarSkeleton.module.css";
import { Link } from "react-router-dom";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import UploadImageBox from "../../Component/UploadImageBox";

const SideBarSkeleton = ({
  heading,
  children,
  header,
  footerVisible = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  useEffect(() => {
    isMobileViewHook(setIsMobile);
  }, []);
  return (
    <>
      <style>{`
        .drawerContainer{
          width:320px !important;
        }
        @media (max-width:768px){
          .drawerContainer{
            width:290px !important;
          }
        }
    `}</style>
      <Container fluid className="g-0" style={{ backgroundColor: "#fefefe" }}>
        <div className="d-flex">
          <div
            className={[
              !isMobile ? classes.sidebarDiv : classes.sidebarOnMobile,
              isCollapsed ? classes.iscollapsed : "",
            ].join(" ")}
          >
            {!isMobile ? (
              <SideBar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            ) : (
              <Drawer
                open={isOpen}
                onClose={toggleDrawer}
                direction="left"
                className="drawerContainer"
              >
                <SideBar
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                />
              </Drawer>
            )}
          </div>
          <div
            className={[
              !isMobile ? classes.contentDiv : classes.contentOnMobile,
              isCollapsed ? classes.contentIsCollapsed : "",
            ].join(" ")}
          >
            <AfterLoginHeader
              drawerBtn={
                isMobile && (
                  <GiHamburgerMenu
                    className={[classes.GiHamburgerMenuMobile]}
                    onClick={() => {
                      toggleDrawer();
                    }}
                  />
                )
              }
              header={header}
            />
            <div className={classes.pageMain}>{children}</div>
            {footerVisible && (
              <div className={classes.footer}>
                <p>&copy; Copyright 2024, All Right Reserved.</p>
                <div className={classes.links}></div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default SideBarSkeleton;
