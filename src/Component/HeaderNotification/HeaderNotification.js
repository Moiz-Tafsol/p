import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import classes from "./HeaderNotification.module.css";

const Notifications = ({ img, message, jobTitle, time }) => {
  return (
    <div className={[classes.HeaderNotificationInnerDiv]}>
      <div className={[classes.ImgDiv]}>
        <img src={`${imageUrl}${img}`} alt="..." />
      </div>
      <div className={[classes.contentDiv]}>
        <div className={[classes.titleDiv]}>
          <h6>{jobTitle}</h6>
          <p>{moment(time).format("hh:mm a")}</p>
        </div>
        <p>{message}</p>
      </div>
    </div>
  );
};

const HeaderNotification = () => {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state?.authReducer?.access_token);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const url = BaseURL("notifications/all");
    setLoading(true);
    let response = await Get(url, accessToken);
    setLoading(false);

    if (response !== undefined) {
      setNotifications(response?.data?.data);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className={[classes.HeaderNotification]}>
      <div className={[classes.notificationHeader]}>
        <h4>Notifications</h4>
      </div>
      {notifications
        ?.slice(Math.max(notifications?.length - 5, 0))
        ?.map((item, i) => {
          return (
            <div className={[classes.mb16]} key={i}>
              <Notifications
                time={item?.createdAt}
                img={item?.sender?.photo}
                message={item?.message}
                jobTitle={item?.job?.jobTitle}
              />
            </div>
          );
        })}
      <p
        className={["reg", classes.viewAll].join(" ")}
        onClick={() => navigate("/notifications")}
      >
        See all
      </p>
    </div>
  );
};
export default HeaderNotification;
