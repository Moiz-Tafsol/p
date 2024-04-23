import React, { useState } from "react";
import PropTypes from "prop-types";
import classes from "./MobileHeader.module.css";
import { Logo } from "../../constant/imagePath";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiBook2Fill } from "react-icons/ri";
import { IoIosBusiness, IoMdLogIn } from "react-icons/io";
import { AiFillShop, AiOutlineHeart } from "react-icons/ai";
import { IoCartSharp, IoHome, IoLogIn, IoLogOut } from "react-icons/io5";

import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config/apiUrl";
import { io } from "socket.io-client";
import { signOutRequest } from "../../store/auth/authSlice";
import { FaQuestion } from "react-icons/fa";
import { favourite, shoap } from "../../constant/imagePath";
import { IoMdContact } from "react-icons/io";
import { useRef } from "react";
import { BiCart } from "react-icons/bi";
import { CiLogin } from "react-icons/ci";
import { BsHeartFill } from "react-icons/bs";

export const MobileHeader = ({ customStyle, logo = Logo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, fcmToken, isLogin } = useSelector(
    (state) => state?.authReducer
  );

  const socket = useRef(null);

  // current page url path name
  const currentPage = window.location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const logout = () => {
    socket.current = io(apiUrl);
    socket.current.emit("logout", { _id: user?._id, fcmToken });
    dispatch(signOutRequest());
    navigate("/");
  };

  const RenderListItem = ({ icon, text, customClass, path, href }) => {
    return (
      <div
        className={[classes.listItem, customClass].join(" ")}
        onClick={() => {
          if (path.toLowerCase() == "logout") {
            logout();
          }
          // else if (path.toLowerCase() == "login") {
          //   setOpenLogin(true);
          // }
          else {
            navigate(path, { state: { href } });
          }
        }}
      >
        {icon}
        <span className={classes.listItemText}>{text}</span>
      </div>
    );
  };

  return (
    <>
      <div className={classes.headerMainDiv} id={"navMobileHeader"}>
        <div className={classes.header} style={{ ...customStyle }}>
          <div className={classes.imageContainer}>
            <img src={logo} className={classes.logo} alt="logo" />
          </div>
          <GiHamburgerMenu
            className={classes.hamburger}
            onClick={() => {
              toggleDrawer();
            }}
            color="white"
            fill={"#000"}
          />
        </div>
        <Drawer
          open={isOpen}
          onClose={toggleDrawer}
          direction="right"
          className="bla bla bla"
        >
          <div className={classes.drawerContainer}>
            <div className={classes.drawerUserSection}>
              <>
                <img src={Logo} className={classes.drawerLogo} alt="logo" />
              </>
            </div>
            <div className={classes.drawerList}>
              <>
                <RenderListItem
                  icon={<IoHome size={18} />}
                  text={"Home"}
                  customClass={currentPage == "/" && classes.activeItem}
                  path={"/"}
                />
                <RenderListItem
                  icon={<RiBook2Fill size={18} />}
                  text={"About Us"}
                  customClass={currentPage == "/about-us" && classes.activeItem}
                  path={"/about-us"}
                />
                <RenderListItem
                  icon={<AiFillShop size={18} />}
                  text={"Products"}
                  customClass={
                    currentPage == "/our-products" && classes.activeItem
                  }
                  path={"/our-products"}
                />
                <RenderListItem
                  icon={<IoIosBusiness size={18} />}
                  text={"FAQs"}
                  customClass={currentPage == "/faqs" && classes.activeItem}
                  path={"/faqs"}
                />

                <div>
                  <RenderListItem
                    icon={<IoMdContact size={18} />}
                    text={"Contact Us"}
                    customClass={
                      currentPage == "/contact-us" && classes.activeItem
                    }
                    path={"/contact-us"}
                  />
                </div>

                <hr
                  style={{
                    width: "100%",
                    marginBottom: "0px",
                  }}
                />
                {isLogin ? (
                  <>
                    <RenderListItem
                      icon={<BsHeartFill size={16} />}
                      text={"My Quote"}
                      customClass={
                        currentPage == "/quote" && classes.activeItem
                      }
                      path={"/quote"}
                    />
                    <RenderListItem
                      icon={<IoLogOut size={18} />}
                      text={"logout"}
                      path={"logout"}
                    />
                  </>
                ) : (
                  <>
                    <RenderListItem
                      icon={<IoLogIn size={20} />}
                      text={"Register"}
                      path={"sign-up"}
                    />
                    <RenderListItem
                      icon={<IoLogIn size={20} />}
                      text={"Login"}
                      path={"login"}
                    />
                  </>
                )}
              </>
            </div>
          </div>
        </Drawer>
        {/* {openLogin && (
          <LoginModal
            show={openLogin}
            setShow={setOpenLogin}
            showSignUp={setOpenSignUp}
          />
        )}

        {openSignUp && (
          <SignUpModal
            showLogin={setOpenLogin}
            show={openSignUp}
            setShow={setOpenSignUp}
          />
        )} */}
      </div>
    </>
  );
};

MobileHeader.propTypes = {
  customStyle: PropTypes.object,
};

MobileHeader.defaulProps = {};
