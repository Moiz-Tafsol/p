import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { Loader } from "../../Component/Loader";
import NoData from "../../Component/NoData/NoData";
import NotificationCard from "../../Component/NotificationCard";
import PaginationComponent from "../../Component/PaginationComponent";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL, apiHeader, recordsLimit } from "../../config/apiUrl";
import { saveNewNotification } from "../../store/common/commonSlice";
import classes from "./Notification.module.css";

const Notification = () => {
  const dispatch = useDispatch();
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const { newNotifications } = useSelector((state) => state?.commonReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageTotalCount, setPageTotalCount] = useState(1);
  const [getNotifications, setNotifications] = useState([]);

  const getAllNotifications = async (pgNo = page) => {
    const apiUrl = BaseURL(`notifications?page=${pgNo}&limit=${recordsLimit}`);
    setIsLoading(true);
    const response = await Get(apiUrl, accessToken);
    if (response !== undefined) {
      setNotifications(response?.data?.data);
      setPageTotalCount(response?.data?.data?.totalCount);
    }
    setIsLoading(false);
  };
  const updateAllNotificationAsSeen = async () => {
    const url = BaseURL(`notifications/seen`);
    let response = await Patch(url, {}, apiHeader(accessToken));
    if (response !== undefined) {
      dispatch(saveNewNotification([]));
    }
  };

  useEffect(() => {
    setPage(1);
    getAllNotifications(1);
    newNotifications?.length > 0 && updateAllNotificationAsSeen();
  }, []);

  return (
    <SideBarSkeleton
      header={
        <h1
          style={{
            fontSize: "26px",
            color: "white",
            margin: "0",
            fontFamily: "var(--ff-secondary-bold)",
          }}
        >
          Notifications
        </h1>
      }
    >
      <div className={classes.inner}>
        <div className={classes.header}>
          <h3>Notifications</h3>
        </div>
        <div className={classes.wrapper}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {getNotifications?.notifications?.length === 0 ? (
                <NoData text="No Notifications Found" />
              ) : (
                getNotifications?.notifications?.map((ele) => {
                  return (
                    <div className={classes.notificationWrapper}>
                      <NotificationCard data={ele} />
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
        <div className={classes.paginationDiv}>
          <PaginationComponent
            totalPages={Math.ceil(pageTotalCount / recordsLimit)}
            setCurrentPage={(e) => {
              setPage(e);
              getAllNotifications(e);
            }}
            currentPage={page}
          />
        </div>
      </div>
    </SideBarSkeleton>
  );
};

export default Notification;
