import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Get } from "../../Axios/AxiosFunctions";
import DashboardStats from "../../Component/DashboardStats";
import DashboardTopArtists from "../../Component/DashboardTopArtists";
import { DropDown } from "../../Component/DropDown/DropDown";
import LineChart from "../../Component/GraphComponent";
import ImageCardsComponent from "../../Component/ImageCardsComponent";
import { Loader } from "../../Component/Loader/index";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import classes from "./Dashboard.module.css";
import CardsLoading from "../../Component/CardsLoading";

const filterOptions = [
  { label: "Monthly", value: "day" },
  { label: "Yearly", value: "month" },
];
const Dashboard = () => {
  const [images, setImages] = useState([]);
  const [data, setData] = useState(null);
  const [artistData, setArtistData] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [filter, setFilter] = useState(filterOptions[0]);

  const [isApiCall, setIsApiCall] = useState(false);
  const [graphLoader, setGraphLoader] = useState(false);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );

  const getData = async (filterVal = filter?.value, graphLoader = false) => {
    const url = BaseURL(`users/admin/dashboard?graph-units=${filterVal}`);
    graphLoader ? setGraphLoader(true) : setIsApiCall(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setArtistData(response?.data?.data?.top10Artists);
      setGraphData(response?.data?.data?.graphData);
      setData(response?.data?.data);
    }
    graphLoader ? setGraphLoader(false) : setIsApiCall(false);
  };

  const getImages = async () => {
    const url = BaseURL(
      `photos/admin/all?sponsored=false&limit=${recordsLimit}`
    );
    setIsApiCall("images");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setImages(response?.data?.data?.photos);
    }
    setIsApiCall("imagesFetched");
  };

  useEffect(() => {
    getData();
    getImages();
  }, []);

  return (
    <>
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
            Dashboard
          </h1>
        }
      >
        {isApiCall ? (
          <Row>
            <Col xxl={8}>
              <Row className="mb-3">
                <Col md={6}>
                  <Skeleton height={"100px"} variant="rounded" />
                </Col>
                <Col md={6}>
                  <Skeleton height={"100px"} variant="rounded" />
                </Col>
              </Row>
              <Skeleton height={"485px"} variant="rounded" />
            </Col>
            <Col xxl={4}>
              {" "}
              <Skeleton height={"600px"} variant="rounded" />
            </Col>
          </Row>
        ) : (
          <Row className={classes.dashboardContainer}>
            <Col xxl={8}>
              <Row>
                <DashboardStats
                  userCount={data?.userCount}
                  publishCount={data?.publishCount}
                />
              </Row>
              <Row>
                <div className={classes.chartHeader}>
                  <h1>Statistics</h1>
                  <DropDown
                    options={filterOptions}
                    placeholder="Filter"
                    value={filter}
                    setter={(e) => {
                      setFilter(e);
                      getData(e?.value, true);
                    }}
                  />
                </div>
                <div style={{ height: "400px" }}>
                  {graphLoader ? (
                    <Loader />
                  ) : (
                    <LineChart graphData={graphData} filter={filter?.value} />
                  )}
                </div>
              </Row>
            </Col>

            <Col xxl={4}>
              <DashboardTopArtists data={artistData} />
            </Col>
          </Row>
        )}
        <div className={classes.imagesContainer}>
          <div className={classes.imagesContainerHeader}>
            <h1>Uploaded Images</h1>
          </div>
          {isApiCall === "images" ? (
            <CardsLoading height={389.78} />
          ) : (
            <ImageCardsComponent data={images} />
          )}
        </div>
      </SideBarSkeleton>
    </>
  );
};

export default Dashboard;
