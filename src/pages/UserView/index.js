import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsTwitter, BsYoutube } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { FaEarthAfrica, FaFacebook, FaInstagram } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Get } from "../../Axios/AxiosFunctions";
import { Loader } from "../../Component/Loader";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL, imageUrl } from "../../config/apiUrl";
import classes from "./UserView.module.css";
import { Button } from "../../Component/Button/Button";
function UserView() {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const slug = useParams().slug;
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState();
  const navigate = useNavigate();

  const handleGetUsers = async () => {
    setLoader(true);
    const response = await Get(
      BaseURL(`users/admin/single/${slug}`),
      accessToken
    );
    if (response != undefined) {
      setData(response?.data?.data);
    }
    setLoader(false);
  };

  useEffect(() => {
    handleGetUsers();
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
          User Detail
        </h1>
      }
    >
      {loader ? (
        <Loader />
      ) : (
        <div className={classes._main}>
          <div
            className={classes.backbtn}
            onClick={() => {
              navigate(-1);
            }}
            style={{
              cursor: "pointer",
            }}
          >
            <span cl>
              <FaArrowLeft
                size={18}
                color="var(text-color)"
                style={{
                  marginBottom: "5px",
                }}
              />
            </span>

            <span>Back</span>
          </div>
          <div className={classes.imageDiv}>
            <div className={classes._image}>
              <img src={imageUrl(data?.photo)}></img>
            </div>
            <div className={classes.editButton}>
              <Button
                label={"Edit"}
                onClick={() => {
                  navigate(`/user-edit/${data?.slug}`, {
                    state: {
                      data,
                    },
                  });
                }}
              />
            </div>
          </div>
          <div className={classes._content}>
            <h1>Profile Informaton</h1>
            <div className={classes.infoDiv}>
              {data?.username && (
                <div className={classes.info}>
                  <label>Full Name :</label>
                  <p className={classes.user}>{data?.username}</p>
                </div>
              )}
              {data?.country && (
                <div className={classes.info}>
                  <label>Country : </label>
                  <p>{data?.country}</p>
                </div>
              )}
              {data?.city && (
                <div className={classes.info}>
                  <label>City :</label>
                  <p>{data?.city}</p>
                </div>
              )}
            </div>

            <div className={classes.infoDiv}>
              {data?.email && (
                <div className={classes.info}>
                  <label>Email :</label>
                  <p>{data?.email}</p>
                </div>
              )}

              {data?.DOB && (
                <div className={classes.info}>
                  <label>Date of Birth:</label>
                  <p>{moment(data?.DOB).format("MMM Do YY")}</p>
                </div>
              )}
            </div>
            <div className={classes.AboutDiv}>
              {data?.aboutMe && (
                <div className={classes.about}>
                  <label>About me:</label>
                  <p>{data?.aboutMe}</p>
                </div>
              )}
            </div>
            {data?.paypalLink && (
              <div className={classes.Donations}>
                <h5>Donations</h5>
                {/* <p>{data?.donations}</p> */}
                <div className={classes.infoDiv}>
                  <div className={classes.info}>
                    <label>PayPal:</label>
                    <p>{data?.paypalLink}</p>
                  </div>
                </div>
              </div>
            )}
            <div className={classes.socials}>
              {data?.socialLinks && (
                <>
                  <div className={classes.iconDiv}>
                    {data?.socialLinks?.instagram && (
                      <Link to={data?.socialLinks?.instagram}>
                        <FaInstagram size={25} />
                      </Link>
                    )}
                  </div>

                  <div className={classes.iconDiv}>
                    {data?.socialLinks?.facebook && (
                      <Link to={data?.socialLinks?.facebook}>
                        <FaFacebook size={25} />
                      </Link>
                    )}{" "}
                  </div>

                  <div className={classes.iconDiv}>
                    {data?.socialLinks?.twitter && (
                      <Link to={data?.socialLinks?.twitter}>
                        <BsTwitter size={25} />
                      </Link>
                    )}{" "}
                  </div>

                  <div className={classes.iconDiv}>
                    {data?.socialLinks?.youtube && (
                      <Link to={data?.socialLinks?.youtube}>
                        <BsYoutube size={25} />
                      </Link>
                    )}{" "}
                  </div>

                  <div className={classes.iconDiv}>
                    {data?.socialLinks?.website && (
                      <Link to={data?.socialLinks?.website}>
                        <FaEarthAfrica size={25} />
                      </Link>
                    )}{" "}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </SideBarSkeleton>
  );
}

export default UserView;
