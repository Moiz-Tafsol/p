import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { imageUrl } from "../../config/apiUrl";
import Style from "./AfterLoginHeader.module.css";
import { AiFillBell } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export const AfterLoginHeader = ({ className, header, drawerBtn }) => {
  const { user } = useSelector((state) => state?.authReducer);
  const { newNotifications } = useSelector((state) => state?.commonReducer);
  const navigate = useNavigate();

  return (
    <Container className={`${[Style.navbarContainer, className].join(" ")}`}>
      {drawerBtn && drawerBtn}
      {header && <div className={Style.actionWrapper}>{header}</div>}

      <div className={Style["profile-container"]}>
        <div
          className={Style.notifyIconDiv}
          onClick={() => navigate("/notifications")}
        >
          <AiFillBell
            size={30}
            className={Style.notifyIcon}
            color="var(--white-color)"
          />
          <span className={Style.notificationCount}>
            {newNotifications?.length > 0 && newNotifications?.length}
          </span>
        </div>
        <div className={`${[Style.profileImg]} ${Style["profile-wrapper"]}`}>
          <img src={imageUrl(`${user?.photo}`)} alt="" layout="fill" />
        </div>
        <p className={Style["profile-name"]}>{user?.username}</p>
      </div>
    </Container>
  );
};
