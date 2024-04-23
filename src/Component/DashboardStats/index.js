import { Col, Row } from "react-bootstrap";
import classes from "./DashboardStatsCard.module.css";
import { FaUser } from "react-icons/fa6";

const DashboardStats = ({ userCount, publishCount }) => {
  return (
    <Row className={classes.container} style={{ margin: "0" }}>
      <Col className={classes.card}>
        <div className={classes.card_left}>
          <p>Total Users</p>
          <h1>{userCount}</h1>
        </div>
        <div className={classes.card_right}>
          <FaUser size={40} color="white" />
        </div>
      </Col>
      <Col className={classes.card}>
        <div className={classes.card_left}>
          <p>Published Arts</p>
          <h1>{publishCount}</h1>
        </div>
        <div className={classes.card_right}>
          <FaUser size={40} color="white" />
        </div>
      </Col>
      {/* <Col className={classes.card}>
        <div className={classes.card_left}>
          <p>Pending Arts</p>
          <h1>500</h1>
        </div>
        <div className={classes.card_right}>
          <FaUser size={40} color="white" />
        </div>
      </Col> */}
    </Row>
  );
};

export default DashboardStats;
