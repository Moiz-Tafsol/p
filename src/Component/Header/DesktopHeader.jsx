import React, { useRef, useState } from "react";
import { Navbar, Nav, Container, OverlayTrigger } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Style from "./DesktopHeader.module.css";
import classes from "./DesktopHeader.module.css";
// import { Logo } from "../../constant/imagePath";
import { IoLogInOutline } from "react-icons/io5";
import { MdCall } from "react-icons/md";
import { apiUrl, imageUrl } from "../../config/apiUrl";
import { signOutRequest } from "../../store/auth/authSlice";
import { io } from "socket.io-client";
import { Button } from "../../Component/Button/Button";
import { Logo } from "../../constant/imagePath";
import { BiCart } from "react-icons/bi";
import { BsHeart } from "react-icons/bs";
import { profile } from "../../constant/imagePath";
const DesktopHeader = ({
  logo = Logo,
  backgroundColor,
  containerClass,
  className,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [show, setShow] = useState(false);
  const { user, fcmToken, isLogin } = useSelector(
    (state) => state?.authReducer
  );
  const socket = useRef(null);
  // let isLogin = false;

  const logout = () => {
    socket.current = io(apiUrl);
    socket.current.emit("logout", { _id: user?._id, fcmToken });
    dispatch(signOutRequest());
    navigate("/");
  };
  return (
    <Container
      className={`${[Style.navbarContainer, containerClass].join(
        " "
      )} mainContainer`}
    >
      <Navbar
        collapseOnSelect
        expand="lg"
        className={`${[Style.header, className].join(" ")}`}
        style={{ backgroundColor: backgroundColor }}
        id={"navDesktopHeader"}
      >
        {/* <Navbar.Brand className={Style.main_logo_main} href="/"> */}
        <div className={Style.main_logo_main} onClick={() => navigate("/")}>
          <img className={classes["brand-logo"]} src={logo} alt="Logo" />
        </div>
        {/* </Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className={Style.navbarCollapse}
          id="responsive-navbar-nav"
        >
          <Nav
            className={`mx-auto ${[Style.navbarCustom__style].join(" ")}`}
            gap={5}
          >
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                    : `${[Style.nabarLinks]}`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  isActive
                    ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                    : `${[Style.nabarLinks]}`
                }
              >
                About Us
              </NavLink>
              <NavLink
                to="/our-products"
                className={({ isActive }) =>
                  isActive
                    ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                    : `${[Style.nabarLinks]}`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="https://qm.tempustools.com/store/d1ce2b8d-21ee-491d-9f2d-8f48ec48c563/login"
                target="_blank"
                className={({ isActive }) =>
                  isActive
                    ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                    : `${[Style.nabarLinks]}`
                }
              >
                Laser Quote
              </NavLink>
              <NavLink
                to="/faqs"
                className={({ isActive }) =>
                  isActive
                    ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                    : `${[Style.nabarLinks]}`
                }
              >
                FAQs
              </NavLink>
              <NavLink
                to="/contact-us"
                className={({ isActive }) =>
                  isActive
                    ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                    : `${[Style.nabarLinks]}`
                }
              >
                Contact Us
              </NavLink>

              {isLogin && (
                <NavLink
                  to="/quote"
                  className={({ isActive }) =>
                    isActive
                      ? `${[Style.nabarLinks, Style.navActive].join(" ")}`
                      : `${[Style.nabarLinks]}`
                  }
                >
                  {user?.wishlist?.length > 0 && (
                    <span className={classes.cartNumbers}>
                      {user?.wishlist?.length}
                    </span>
                  )}
                  <span className={Style.BiCart}>
                    <BsHeart />
                  </span>
                </NavLink>
              )}
            </>
          </Nav>

          <div className={Style.dflex}>
            {isLogin ? (
              <>
                <OverlayTrigger
                  trigger={["click"]}
                  placement={"bottom-end"}
                  overlay={
                    <div className={Style.profileOverlay}>
                      <div>
                        <NavLink
                          to="/dashboard"
                          className={[Style.overlayLink]}
                        >
                          Dashboard
                        </NavLink>
                        <p className={[Style.overlayLink]} onClick={logout}>
                          Logout
                        </p>
                      </div>
                    </div>
                  }
                  show={show}
                  onToggle={() => setShow(!show)}
                >
                  <div className={[Style.profileImg]}>
                    {/* <img src={`${imageUrl}${user?.photo}`} alt="..." /> */}
                    <img src={imageUrl(user?.photo)} alt="profile" />
                  </div>
                </OverlayTrigger>
              </>
            ) : (
              <div>
                <div className={Style.btnMain}>
                  <Button onClick={() => navigate("/login")} label={"Login"} />
                  <Button
                    onClick={() => navigate("/sign-up")}
                    label={"Register"}
                  />
                </div>
              </div>
            )}
          </div>
        </Navbar.Collapse>

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
      </Navbar>
    </Container>
  );
};

export default DesktopHeader;
