import moment from "moment";
import classes from "./NotificationCard.module.css";
import { imageUrl } from "../../config/apiUrl";

const NotificationCard = ({ data }) => {
  return (
    <div className={classes.notification}>
      <div className={classes.description}>
        <div className={classes.userProfile}>
          <div className={classes.imageBox}>
            <img src={imageUrl(data?.sender?.photo)} alt="" />
          </div>
          <h5>{data?.sender?.username}</h5>
        </div>
        <div className={classes.info}>
          <p>{data?.message}</p>
        </div>
      </div>
      <div className={classes.createdDate}>
        <p>{moment(data?.createdAt)?.format(`DD/MM/YYYY`)}</p>
        <p>{moment(data?.createdAt)?.format(`HH:MM A`)}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
