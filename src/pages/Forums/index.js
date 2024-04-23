import React, { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Delete, Get, Patch, Post } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import PoperComponent from "../../Component/PopperComponent";
import SearchInput from "../../Component/SearchInput/index";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import TableSkeleton from "../../Component/TableSkeleton";
import useDebounce from "../../CustomHooks/useDebounce";
import { BaseURL, apiHeader, recordsLimit } from "../../config/apiUrl";
import AddEditForumsModal from "../../modals/AddEditForumsModal";
import classes from "./Forums.module.css";
import ViewSupportModal from "../../modals/ViewSupportModal";
import TabsComponent from "../../Component/TabsComponent";
import { Row, Col } from "react-bootstrap";

function Forum() {
  const tabsArray = [
    { label: "Featured", value: true },
    { label: "Non Featured", value: false },
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Active", value: true },
    { label: "Non Active", value: false },
  ];

  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const anchorRef = useRef(null);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openPopper, setOpenPopper] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);
  const [count, setCount] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewSupportModal, setviewSupportModal] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const debounce = useDebounce(search, 500);
  const [tabs, setTabs] = useState(tabsArray[0]);
  const [updateForumLoading, setUpdateForumLoading] = useState(false);

  const tableElementWidth = ["20%", "20%", "30%", "20%", "10%"];

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleActionClick = (flag) => {
    if (flag === "Edit") {
      setModalOpen(true);
    } else {
      setviewSupportModal(true);
    }
  };

  const getData = async (pageNo = page, filterOption = status?.value, tab) => {
    const url = BaseURL(
      `forum/admin/all?search=${debounce}&status=${filterOption}&featured=${tabs?.value}&page=${pageNo}&limit=${recordsLimit}`
    );

    setLoader(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data?.forums);
      setCount(response?.data?.data?.totalCount);
    }
    setLoader(false);
  };

  const handleUpdate = async (body) => {
    const apiUrl = BaseURL(`forum/admin/update`);
    const params = { id: selectedItem._id, ...body };
    setUpdateForumLoading(true);
    const response = await Patch(apiUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      let findInd = data?.findIndex(
        (ele) => ele?._id === response?.data?.data?._id
      );
      let tempArr = [...data];
      tempArr?.splice(findInd, 1, response?.data?.data);

      status?.value !== statusOptions[0]?.value
        ? setData(tempArr.filter((item) => item?._id !== selectedItem?._id))
        : setData(tempArr);

      tabs?.value !== tabs?.value &&
        setData(tempArr.filter((item) => item?._id !== selectedItem?._id));

      toast.success("Status updated Successfully");
      setModalOpen(false);
    }
    setUpdateForumLoading(false);
  };

  useEffect(() => {
    getData(1, status?.value);
    setPage(1);
  }, [debounce, tabs]);

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
            Forums
          </h1>
        }
      >
        <div className={classes.main}>
          <Row className={classes.header}>
            <Col lg={6} className={classes.tabs}>
              <TabsComponent
                data={tabsArray}
                value={tabs.label}
                setter={(e) => {
                  // changeTabs();
                  setTabs(e);
                  setSearch("");
                  setPage(1);
                }}
              />
            </Col>
            <Col lg={6} className={classes.filters}>
              <div className={classes.search}>
                <SearchInput
                  placeholder="Search..."
                  value={search}
                  setter={setSearch}
                />
              </div>
              <DropDown
                customStyle={{
                  width: "150px",
                }}
                value={status}
                setter={(e) => {
                  setStatus(e);
                  getData(1, e?.value);
                  setSearch("");
                  setPage(1);
                }}
                options={statusOptions}
                placeholder={"Select Status"}
              />
            </Col>
          </Row>
          <div className={classes.tableContent}>
            <style>{`
      // .modal-body{
      //     height: 550px;
      //     overflow-y: auto;
      // }
      .table100-body{
        height:calc(100vh - 365px);
        overflow-y:scroll;
      }
      .table100-body::-webkit-scrollbar {
          display: none;
        }
      .table100-head tr{
        margin:0 !important;
        padding:0 10px !important;
          background-color:var(--main-color);
      }
      .table100-body tr{
        margin:0 !important;
    }
      .table100.ver1 th {
          color:white;
      }
      
      #composition-button svg{
          cursor:pointer;
      }
      .table100-head{
        z-index:10;
      }
      .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        
        .table100-body td {
          padding-block : 15px;
          padding-inline: 20px;
      }
      
      @media screen and (max-width:1700px){
        .column2{
          padding-left:50px !important;
      }
  }
  @media screen and (max-width:1440px){
      .table100-head, .table100-body{
          width:1200px;
        }
        .table100.ver1{
          overflow-x:scroll !important;
      }
      .table100.ver1::-webkit-scrollbar {
          display: none;
        }
  }
  `}</style>
            <div class="table100 ver1 m-b-110">
              <div class="table100-head">
                <table>
                  <thead>
                    <tr class="row100 head">
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[0],
                          textAlign: "center",
                        }}
                      >
                        Title
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[1],
                          textAlign: "center",
                        }}
                      >
                        Category
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[2],
                          textAlign: "center",
                        }}
                      >
                        Description
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[3],
                          textAlign: "center",
                        }}
                      >
                        Status
                      </th>

                      <th
                        class="cell100 column5"
                        style={{
                          width: tableElementWidth?.[4],
                          textAlign: "center",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
              {loader ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={4} />
              ) : (
                <div class="table100-body js-pscroll ps ps--active-y">
                  <table>
                    <tbody>
                      {data?.length > 0 ? (
                        data?.map((item, index) => (
                          <tr key={index}>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[0],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.description}>
                                {item?.title}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[1],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.description}>
                                {" "}
                                {item?.category?.name}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.description}>
                                {" "}
                                {item?.description}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[3],
                                textAlign: "center",
                              }}
                            >
                              <span
                                style={{
                                  borderRadius: "20px",
                                  padding: "5px 20px",
                                  backgroundColor: "#06856c",
                                  color: "white",
                                }}
                              >
                                {" "}
                                {item?.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>

                            <td
                              class="cell100 column5"
                              style={{
                                width: tableElementWidth?.[4],
                                textAlign: "center",
                              }}
                            >
                              <div ref={index == indexMap ? anchorRef : null}>
                                <SlOptions
                                  color="var(--main-color)"
                                  cursor="pointer"
                                  size={24}
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIndexMap(index);
                                    setTimeout(() => {
                                      handleToggle();
                                    }, 100);
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoData text={"No Forum found"} />
                      )}
                      <PoperComponent
                        handleClick={handleActionClick}
                        open={openPopper}
                        setOpen={setOpenPopper}
                        anchorRef={anchorRef}
                        position
                        data={["View", "Edit"]}
                      />
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className={classes.paginationDiv}>
              <PaginationComponent
                totalPages={Math.ceil(count / recordsLimit)}
                setCurrentPage={(e) => {
                  setPage(e);
                  getData(e);
                }}
                currentPage={page}
              />
            </div>
          </div>
        </div>

        {viewSupportModal && (
          <ViewSupportModal
            show={viewSupportModal}
            setShow={setviewSupportModal}
            details={selectedItem}
            pageName={"forums"}
          />
        )}

        {modalOpen && (
          <AddEditForumsModal
            show={modalOpen}
            setShow={setModalOpen}
            data={selectedItem}
            onClick={handleUpdate}
            loading={updateForumLoading}
          />
        )}
      </SideBarSkeleton>
    </>
  );
}

export default Forum;
