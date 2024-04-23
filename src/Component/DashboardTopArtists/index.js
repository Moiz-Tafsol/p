import { Col, Row } from "react-bootstrap";
import { FaHeart, FaRegEye } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { HiUserAdd } from "react-icons/hi";
import { imageUrl } from "../../config/apiUrl";
import classes from "./DashboardTopArtists.module.css";
import { useNavigate } from "react-router-dom";

const DashboardTopArtists = ({ data }) => {
  const navigate = useNavigate();
  return (
    <main>
      <h1 className={classes.heading}>Top Artist</h1>
      <div className={classes.container}>
        {data?.map((artist) => {
          return (
            <div
              className={classes.card}
              onClick={() => navigate(`user-detail/${artist?.slug}`)}
            >
              <div className={classes.imageContainer}>
                <img src={imageUrl(artist?.photo)} className={classes.image} />
              </div>
              <div className={classes.artistDetails}>
                <h2>{artist?.username}</h2>
                <Row className={classes.artistDetails_rows}>
                  <Col>
                    <HiUserAdd color="var(--main-color)" />
                    <span>Followers: {artist?.followerCount}</span>
                  </Col>
                  <Col>
                    <FaHeart color="var(--main-color)" />
                    <span>Likes: {artist?.likeCount}</span>
                  </Col>
                </Row>
                <Row className={classes.artistDetails_rows}>
                  <Col>
                    <FaRegEye color="var(--main-color)" />
                    <span>Views: {artist?.viewCount}</span>
                  </Col>
                  <Col>
                    <FaDownload color="var(--main-color)" />
                    <span>Downloads: {artist?.downloadCount}</span>
                  </Col>
                </Row>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default DashboardTopArtists;
