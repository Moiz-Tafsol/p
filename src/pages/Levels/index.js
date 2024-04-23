import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Delete, Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import LevelComponent from "../../Component/LevelComponent";
import { Loader } from "../../Component/Loader";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { BaseURL, apiHeader } from "../../config/apiUrl";
import AddEditLevelModal from "../../modals/AddEditLevelModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import classes from "./Levels.module.css";

export default function Levels() {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const getlevels = async (load = "main-loading") => {
    const url = BaseURL(`levels`);
    setLoading(load);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data?.levels);
    }
    setLoading(false);
  };

  useEffect(() => {
    getlevels();
  }, []);

  const handleCreateUpdate = async (body, load = "main-loading") => {
    const apiUrl = BaseURL(
      selectedData === null ? "levels/create" : "levels/update"
    );
    setLoading(load);
    const response =
      selectedData === null
        ? await Post(apiUrl, body, apiHeader(accessToken))
        : await Patch(apiUrl, body, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(
        `Level ${selectedData === null ? "Added" : "Updated"} Successfully`
      );

      setData((prev) => {
        if (selectedData) {
          return prev.map((item) => {
            if (item._id === selectedData._id) {
              return response?.data?.data;
            }
            return item;
          });
        }
        return [response?.data?.data, ...prev];
      });
      setModalOpen(false);
    }
    setLoading(false);
  };

  const DeleteLevel = async () => {
    setLoading("delete");
    const response = await Delete(
      BaseURL(`levels/delete/${selectedData?._id}`),
      apiHeader(accessToken)
    );
    if (response != undefined) {
      toast.success("Level Deleted Succesfully");
      setData(data?.filter((item) => item?._id !== selectedData?._id));
    }
    setDeleteModal(false);
    setLoading(false);
  };

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
            Levels
          </h1>
        }
      >
        <div className={classes.addbtn}>
          <Button
            onClick={() => {
              setSelectedData(null);
              setModalOpen(true);
            }}
            label="Add Level"
            customStyle={{
              fontFamily: "var(--ff-primary-med)",
            }}
          />
        </div>
        {isLoading == "main-loading" ? (
          <Loader />
        ) : (
          <Row className={classes.row}>
            {data?.map((ele) => {
              return (
                <Col lg={6} xl={4}>
                  <LevelComponent
                    onEdit={() => {
                      setSelectedData(ele);
                      setModalOpen(true);
                    }}
                    item={ele}
                    onDelete={() => {
                      setSelectedData(ele);
                      setDeleteModal(true);
                    }}
                  />
                </Col>
              );
            })}
          </Row>
        )}
      </SideBarSkeleton>
      {modalOpen && (
        <AddEditLevelModal
          data={selectedData}
          setShow={setModalOpen}
          show={modalOpen}
          apiCalling={isLoading}
          onClick={handleCreateUpdate}
        />
      )}
      <AreYouSureModal
        setShow={setDeleteModal}
        show={deleteModal}
        onClick={DeleteLevel}
        isApiCall={isLoading}
      />
    </>
  );
}
