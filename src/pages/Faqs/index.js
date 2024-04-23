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
import AddEditFaqModal from "../../modals/AddEditFaqModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import classes from "./Faqs.module.css";
import ViewFaqModal from "../../modals/ViewFaqModal";

// import { quillValidateHandler } from "../../Helper/QuillValidation";
const statusOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: true },
  { label: "Non Active", value: false },
];
const tableElementWidth = ["20%", "40%", "20%", "20%", "20%"];

const Faqs = () => {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const anchorRef = useRef(null);
  const [Faqs, setFaqs] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);
  const [page, setPage] = useState(1);
  const [openPopper, setOpenPopper] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);
  const [count, setCount] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);
  const debounce = useDebounce(search, 500);

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleActionClick = (flag) => {
    if (flag === "Edit") {
      setModalOpen(true);
    } else if (flag === "Delete") {
      setDeleteModal(true);
    } else if (flag === "View") {
      setViewModal(true);
    }
  };

  const getFaqData = async (page = 1, statusVal = status?.value) => {
    const url = BaseURL(
      `faqs/admin/all?page=${page}&status=${statusVal}&search=${debounce}&limit=${recordsLimit}`
    );
    setIsApiCall("table");
    const response = await Get(url, accessToken);
    console.log(response.data);
    if (response !== undefined) {
      setFaqs(response?.data?.data?.data);
      setCount(response?.data?.data?.totalCount);
    }
    setIsApiCall(false);
  };

  const handleUpdate = async (body) => {
    const apiUrl = BaseURL(
      selectedItem === null ? "faqs/create" : "faqs/update"
    );

    setIsApiCall(true);
    const response =
      selectedItem === null
        ? await Post(apiUrl, body, apiHeader(accessToken))
        : await Patch(apiUrl, body, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(
        `FAQ ${selectedItem === null ? "Added" : "Updated"} Successfully`
      );
      // setFaqs((prev) => {
      //   if (selectedItem) {
      //     return prev.map((item) => {
      //       if (item._id === selectedItem._id) {
      //         return response?.data?.data;
      //       }
      //       return item;
      //     });
      //   }
      //   return [response?.data?.data, ...prev];
      // });

      let index = Faqs?.findIndex(
        (ele) => ele?._id == response?.data?.data?._id
      );
      let tempArr = [...Faqs];
      tempArr?.splice(index, 1, response?.data?.data);

      {
        status?.value === statusOptions[0]?.value
          ? setFaqs(tempArr)
          : setFaqs(tempArr?.filter((item) => item?._id !== selectedItem?._id));
      }

      setModalOpen(false);
    }
    setIsApiCall(false);
  };

  const handleDelete = async () => {
    const apiUrl = BaseURL(`faqs/delete/${selectedItem?._id}`);
    setIsApiCall(true);
    const response = await Delete(apiUrl, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("FAQ Deleted Successfully");
      setDeleteModal(false);
      setFaqs((prev) => prev.filter((item) => item._id !== selectedItem._id));
    }
    setIsApiCall(false);
  };

  useEffect(() => {
    getFaqData(1);
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
            FAQ's
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
                    getFaqData(1, e?.value);
                  }}
                  options={statusOptions}
                  placeholder={"Select Status"}
                />
                <Button
                  onClick={
                    () => {
                      setModalOpen(true);
                      setSelectedItem(null);
                    }

                    //   setFaqs((prev) => [{ question: "", answer: "" }, ...prev])
                  }
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
        height:calc(100vh - 360px);
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
                        Question
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[1],
                          textAlign: "center",
                        }}
                      >
                        Answer
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[2],
                          textAlign: "center",
                        }}
                      >
                        Category
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
                      {Faqs?.length > 0 ? (
                        Faqs?.map((item, index) => (
                          <tr key={index}>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[0],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.answer}>
                                {item?.question}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[1],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.answer}>
                                {item?.answer}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
                                textAlign: "center",
                              }}
                            >
                              {item?.category?.name}
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
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
                                width: tableElementWidth?.[3],
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
                        <NoData text={"No Faqs found"} />
                      )}
                      <PoperComponent
                        handleClick={handleActionClick}
                        open={openPopper}
                        setOpen={setOpenPopper}
                        anchorRef={anchorRef}
                        position
                        data={["View", "Edit", "Delete"]}
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
                  getFaqData(e);
                }}
                currentPage={page}
              />
            </div>
          </div>
        </div>

        {modalOpen && (
          <AddEditFaqModal
            show={modalOpen}
            setShow={setModalOpen}
            data={selectedItem}
            apiCalling={isApiCall}
            onClick={handleUpdate}
          />
        )}
        {viewModal && (
          <ViewFaqModal
            show={viewModal}
            setShow={setViewModal}
            details={selectedItem}
          />
        )}

        {deleteModal && (
          <AreYouSureModal
            show={deleteModal}
            setShow={setDeleteModal}
            isApiCall={isApiCall}
            onClick={handleDelete}
          />
        )}
      </SideBarSkeleton>
    </>
  );
};

export default Faqs;
