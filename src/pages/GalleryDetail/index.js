import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Get } from "../../Axios/AxiosFunctions";
import { Loader } from "../../Component/Loader/index";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import classes from "./GalleyDetail.module.css";
function GalleryDetail() {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const slug = useParams().id;
  const [data, setData] = useState();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const getGalleryDetail = async () => {
    setLoader(true);
    const response = await Get(
      BaseURL(`photos/admin/single/${slug}`),
      accessToken
    );
    if (response != undefined) {
      setData(response?.data?.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    getGalleryDetail();
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
          Gallery Details
        </h1>
      }
    >
      {loader ? (
        <Loader />
      ) : (
        <div className={classes._main}>
          <Row>
            <Col xl={6} md={6} className="my-1">
              <div className={classes._img}>
                <img src={imageUrl(data?.originalImage?.key)} />
              </div>
            </Col>
            <Col xl={6} md={6} className="my-1">
              <div className={classes.contentDiv}>
                <div className={classes.info}>
                  <label>Artist Name</label>
                  <p>{data?.user?.username}</p>
                </div>
                {data?.title && (
                  <div className={classes.info}>
                    <label>Title Name</label>
                    <p>{data?.title}</p>
                  </div>
                )}
                {data?.tags?.length > 0 && (
                  <div className={classes.tags}>
                    <label>Tags</label>
                    <div className={classes._tagsP}>
                      {data?.tags.map((e) => (
                        <p>{e}</p>
                      ))}
                    </div>
                  </div>
                )}
                <div className={classes.AboutDiv}>
                  <div className={classes.about}>
                    <label>Description:</label>
                    <p>{data?.description}</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </SideBarSkeleton>
  );
}

export default GalleryDetail;
