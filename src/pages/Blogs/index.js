import parse from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Delete, Get } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import PoperComponent from "../../Component/PopperComponent";
import SearchInput from "../../Component/SearchInput";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import TableSkeleton from "../../Component/TableSkeleton";
import useDebounce from "../../CustomHooks/useDebounce";
import { BaseURL, apiHeader, recordsLimit } from "../../config/apiUrl";
import AreYouSureModal from "../../modals/AreYouSureModal";
import classes from "./Blogs.module.css";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: true },
  { label: "Non Active", value: false },
];

const tableElementWidth = ["10%", "20%", "40%", "20%", "10%"];
const Blogs = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const navigate = useNavigate();
  const anchorRef = useRef(null);
  const [blogs, setBlogs] = useState([]);
  const [id, setId] = useState("");
  const [isApiCall, setIsApiCall] = useState(false);
  const [page, setPage] = useState(1);
  const [openPopper, setOpenPopper] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const debounce = useDebounce(search, 500);
  const [count, setCount] = useState(20);
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };

  const handleActionClick = (flag) => {
    if (flag === "Edit") {
      navigate("/blogs/add-edit", { state: { data: selectedItem } });
    } else if (flag === "Delete") {
      setDeleteModal(true);
    }
  };

  const getData = async (pageNo = page, statusVal = status?.value) => {
    const url = BaseURL(
      `blogs/admin/all?page=${pageNo}&status=${statusVal}&search=${debounce}&limit=${recordsLimit}`
    );
    setIsApiCall("table");
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setBlogs(response?.data?.data?.blogs);
      setCount(response?.data?.data?.totalCount);
    }
    setIsApiCall(false);
  };

  const handleDelete = async () => {
    const apiUrl = BaseURL(`blogs/delete/${selectedItem?._id}`);
    setIsApiCall(true);
    const response = await Delete(apiUrl, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("Blog Deleted Successfully");
      setDeleteModal(false);
      setBlogs((prev) => prev.filter((item) => item._id !== selectedItem._id));
    }
    setIsApiCall(false);
  };

  useEffect(() => {
    getData(1);
  }, [debounce]);

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
            Blogs
          </h1>
        }
      >
        <div className={classes.main}>
          <div className={classes.header}>
            <div className={classes.filters}>
              <SearchInput
                placeholder="Search..."
                value={search}
                setter={setSearch}
                inputStyle={{ minWidth: "250px" }}
              />
              <div className={classes.filtersActions}>
                <DropDown
                  customStyle={{
                    width: "150px",
                  }}
                  value={status}
                  setter={(e) => {
                    setStatus(e);
                    setPage(1);
                    getData(1, e?.value);
                  }}
                  options={statusOptions}
                  placeholder={"Select Status"}
                />
                <Button
                  onClick={() => {
                    navigate("/blogs/add-edit");
                  }}
                  label={"Add"}
                />
              </div>
            </div>
          </div>
          <div className={classes.tableContent}>
            <style>{`
      // .modal-body{
      //     height: 550px;
      //     overflow-y: auto;
      // }
      .table100-body{
        height:calc(100vh - 380px);
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
          padding-block: 10px;
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
                        S.No
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[1],
                          textAlign: "center",
                        }}
                      >
                        Title
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
              {isApiCall === "table" ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={5} />
              ) : (
                <div class="table100-body js-pscroll ps ps--active-y">
                  <table>
                    <tbody>
                      {blogs?.length > 0 ? (
                        blogs?.map((item, index) => (
                          <tr key={index}>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[0],
                                textAlign: "center",
                              }}
                            >
                              {index + 1}
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[1],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.ellipse}>
                                {item?.title}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.ellipse}>
                                {/* {item?.description && parse(item?.description)} */}
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
                              <span className="active">
                                {item?.isActive ? "Active" : "Non Active"}
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
                                  style={{ cursor: "pointer" }}
                                  color="var(--main-color)"
                                  size={24}
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIndexMap(index);
                                    setTimeout(() => {
                                      handleToggle();
                                    }, 100);
                                  }}
                                  cursor={"pointer"}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoData text={"No Blogs found"} />
                      )}
                      <PoperComponent
                        handleClick={handleActionClick}
                        open={openPopper}
                        setOpen={setOpenPopper}
                        anchorRef={anchorRef}
                        position
                        data={["Edit", "Delete"]}
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
      </SideBarSkeleton>

      {deleteModal && (
        <AreYouSureModal
          show={deleteModal}
          setShow={setDeleteModal}
          isApiCall={isApiCall}
          onClick={handleDelete}
        />
      )}
    </>
  );
};

export default Blogs;
