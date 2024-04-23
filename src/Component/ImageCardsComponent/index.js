import { useNavigate } from "react-router-dom";
import classes from "./ImageCardsComponent.module.css";
import { FaFlag } from "react-icons/fa";
import { Col, Row } from "react-bootstrap";
import { imageUrl } from "../../config/apiUrl";

const ImageCardsComponent = ({ data, isFlag, report = false }) => {
  const navigate = useNavigate();
  return (
    <div className={classes.container}>
      <Row>
        {data?.map((item) => {
          return (
            <Col xxl={3} xl={4} lg={6} md={12}>
              <div
                className={classes.card}
                onClick={
                  report
                    ? () => navigate(`/reports/${item?.slug}`)
                    : () => navigate(`/gallery/${item?.slug}`)
                }
              >
                <img
                  src={imageUrl(item?.originalImage?.key)}
                  className={classes.image}
                />
                {isFlag && (
                  <div className={classes.flagContainer}>
                    <div className={classes.flag}>
                      <FaFlag color="var(--main-color)" />
                    </div>
                    {item?.reportCount}
                  </div>
                )}
                {/* <div className={classes.status}>{item?.status}</div> */}
                <div className={classes.user}>
                  <img
                    src={imageUrl(item?.user?.photo)}
                    className={classes.userImage}
                  />
                  <p>{item?.user?.username}</p>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ImageCardsComponent;
