import React, { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { FaBlogger, FaQuora } from "react-icons/fa";
import { FaHouse, FaUserLarge } from "react-icons/fa6";
import { FaRegKeyboard } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import { MdPrivacyTip } from "react-icons/md";
import { RiDiscussFill } from "react-icons/ri";
import { FaFileContract } from "react-icons/fa6";
import { GiNetworkBars } from "react-icons/gi";
import { FaImage } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { GrFlagFill } from "react-icons/gr";
import { MdForum, MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { SlEarphones } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { MdManageAccounts } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../../constant/imagePath";
import { signOutRequest } from "../../store/auth/authSlice";
import { Button } from "../Button/Button";
import { IoCall } from "react-icons/io5";
import { FaList } from "react-icons/fa";
import classes from "./SideBar.module.css";
import { FaQuestion } from "react-icons/fa";
import { BiMessageAltError } from "react-icons/bi";
const RenderItem = ({ icon, title, subMenu = [], path }) => {
  const active = useLocation()?.pathname;
  const [subnav, setSubnav] = useState(false);
  const subActive = subMenu.find((item, index) => item?.path == active);
  const showSubnav = () => setSubnav(!subnav);
  return (
    <>
      <Link
        className={[
          classes?.listItemContainer,
          path == active && classes?.active,
          subActive && classes?.subActive,
          subnav && classes?.marginZero,
        ].join(" ")}
        to={subMenu?.length > 0 ? "#" : path}
        onClick={() => {
          if (subMenu?.length > 0) {
            showSubnav(!subnav);
          }
        }}
      >
        {icon}
        <span>{title}</span>
        {subMenu?.length > 0 &&
          (subnav ? (
            <RiArrowUpSFill
              size={20}
              color={"var(--sidebar-text-color)"}
              className={classes?.dropDownIcon}
            />
          ) : (
            <RiArrowDownSFill
              size={20}
              color={"var(--sidebar-text-color)"}
              className={classes?.dropDownIcon}
            />
          ))}
      </Link>
      {subnav &&
        subMenu.map((item, index) => {
          return (
            <Link
              className={[
                classes?.innerItemContainer,
                item?.path == active && classes?.active,
              ].join(" ")}
              key={index}
              to={item?.path}
            >
              <span>
                <div className={classes.cmsIcon}>{item?.icon}</div>
              </span>
              <span>{item?.label}</span>
            </Link>
          );
        })}
    </>
  );
};

const SideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const socket = io(apiUrl);

  const HandleSubmitSignOut = () => {
    // socket.emit("logout", userData?._id, fcmToken);
    dispatch(signOutRequest());
    navigate("/login");
  };

  return (
    <div className={classes?.mainContainer}>
      <div className={classes?.logoContainer}>
        <img src={Logo} onClick={() => navigate("/")} />
      </div>
      <div className={classes.itemsContainer}>
        <RenderItem
          icon={<FaHouse size={20} color={"var(--main-color)"} />}
          title={"Dashboard"}
          path={"/"}
        />
        <RenderItem
          icon={<FaUserLarge size={20} color={"var(--main-color)"} />}
          title={"Users"}
          path={"/users"}
        />

        <RenderItem
          icon={
            <MdOutlinePhotoSizeSelectActual
              size={20}
              color={"var(--main-color)"}
            />
          }
          title={"Gallery"}
          path={"/gallery"}
        />

        <RenderItem
          icon={<GrFlagFill size={20} color={"var(--main-color)"} />}
          title={"Reports"}
          path={"/reports"}
        />
        <RenderItem
          icon={<SlEarphones size={20} color={"var(--main-color)"} />}
          title={"Support"}
          path={"/support"}
        />

        <RenderItem
          icon={<GiNetworkBars size={20} color={"var(--main-color)"} />}
          title={"Levels"}
          path={"/levels"}
        />
        <RenderItem
          icon={<FaBlogger size={20} color={"var(--main-color)"} />}
          title={"Blogs"}
          path={"/blogs"}
        />

        {/* <RenderItem
          icon={<GrContact size={20} color={"var(--main-color)"} />}
          title={"Contact"}
          path={"/contact"}
        /> */}
        <RenderItem
          icon={<MdForum size={20} color={"var(--main-color)"} />}
          title={"Forums"}
          path={"/forums"}
        />
        <RenderItem
          icon={<FaList size={20} color={"var(--main-color)"} />}
          title={"Categories"}
          path={"/categories"}
        />

        <RenderItem
          icon={<FaQuora size={20} color={"var(--main-color)"} />}
          title={"Faq"}
          path={"/faqs"}
        />

        <RenderItem
          icon={<MdManageAccounts size={20} color={"var(--main-color)"} />}
          title={"CMS"}
          subMenu={[
            {
              label: "Home",
              path: "/cms/home",
              icon: <FaHouse size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Faq",
              path: "/cms/faqs",
              icon: <FaQuestion size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Contact",
              path: "/cms/contact",
              icon: <IoCall size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Blog",
              path: "/cms/blogs",
              icon: <FaBlogger size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Blog Detail",
              path: "/cms/blog-detail",
              icon: <FaBlogger size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Forum",
              path: "/cms/forum",
              icon: <RiDiscussFill size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Forum Detail",
              path: "/cms/forum-detail",
              icon: <RiDiscussFill size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Product Detail",
              path: "/cms/product-detail",
              icon: <FaImage size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Terms & Conditions",
              path: "/cms/terms",
              icon: <FaFileContract size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Privacy Policy",
              path: "/cms/privacy",
              icon: <MdPrivacyTip size={15} color={"var(--main-color)"} />,
            },
            {
              label: "About",
              path: "/cms/about",
              icon: <BiMessageAltError size={15} color={"var(--main-color)"} />,
            },
            {
              label: "Footer",
              path: "/cms/footer",
              icon: <FaRegKeyboard size={15} color={"var(--main-color)"} />,
            },
          ]}
        />

        <Button className={classes["logout-btn"]} onClick={HandleSubmitSignOut}>
          <CiLogout size={25} color="#fff" /> <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SideBar;
