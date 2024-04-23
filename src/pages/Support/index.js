import { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { DropDown } from "../../Component/DropDown/DropDown";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import PoperComponent from "../../Component/PopperComponent";
import SearchInput from "../../Component/SearchInput";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { supportArr } from "../../config/DummyData";
import classes from "./Support.module.css";
import { Get, Delete, Patch } from "../../Axios/AxiosFunctions";
import { BaseURL, apiHeader, apiUrl, recordsLimit } from "../../config/apiUrl";
import { useSelector } from "react-redux";
import { Loader } from "../../Component/Loader";
import { Button } from "../../Component/Button/Button";
import { toast } from "react-toastify";
import useDebounce from "../../CustomHooks/useDebounce";
import ViewSupportModal from "../../modals/ViewSupportModal";
import SupportUpdateModal from "../../modals/SupportUpdateModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import TableSkeleton from "../../Component/TableSkeleton";

export default function Support() {
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Resolved", value: "resolved" },
    { label: "Rejected", value: "rejected" },
  ];
  const tableElementWidth = ["15%", "15%", "15%", "40%", "15%"];
  const anchorRef = useRef(null);
  const { access_token: token } = useSelector((state) => state?.authReducer);
  const [page, setPage] = useState(1);
  const [openPopper, setOpenPopper] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);
  const [supportData, setSupportData] = useState([]);
  const [count, setCount] = useState();
  const [search, setSearch] = useState("");
  const debouncedSearchTerm = useDebounce(search, 500);
  const [filter, setFilter] = useState(filterOptions[0]);
  const [loader, setLoader] = useState(false);
  const [viewSupportModal, setviewSupportModal] = useState(false);
  const [viewDeleteModal, setViewDeleteModal] = useState(false);
  const [deleteContactLoading, setDeleteContactLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [updateContactLoading, setUpdateContactLoading] = useState(false);

  const handleGetDashboard = async (
    pageNo = page,
    filterValue = filter?.value
  ) => {
    const apiUrl = BaseURL(
      `contactus/admin/all?search=${debouncedSearchTerm}&page=${pageNo}&limit=${recordsLimit}&status=${filterValue}`
    );
    setLoader(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setSupportData(response?.data?.data?.data);
      setCount(response?.data?.data?.totalCount);
    }
    setLoader(false);
  };

  const handleUpdate = async (params) => {
    const apiUrl = BaseURL(`contactus/update`);
    const body = { ...params, id: selectedItem._id };
    setUpdateContactLoading(true);
    const response = await Patch(apiUrl, body, apiHeader(token));
    if (response !== undefined) {
      const tempArr = [...supportData];
      const findInd = tempArr?.findIndex(
        (ele) => ele?._id === response?.data?.data?._id
      );
      tempArr?.splice(findInd, 1, response?.data?.data);
      setSupportData(tempArr);
      toast.success("Status updated Successfully");
      setOpenEditModal(false);
    }
    setUpdateContactLoading(false);
  };

  const deleteContact = async (item) => {
    const apiUrl = BaseURL(`contactus/delete/${item._id}`);
    setDeleteContactLoading(true);
    const response = await Delete(apiUrl, null, apiHeader(token, false));
    if (response !== undefined) {
      setSupportData((prev) => {
        prev = prev.filter((element) => element._id !== item._id);
        return prev;
      });
      toast.success("Contact deleted successfully");
      setViewDeleteModal(false);
    }
    setDeleteContactLoading(false);
  };

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleActionClick = (flag) => {
    if (flag === "View") {
      setviewSupportModal(true);
    } else if (flag === "Edit") {
      setOpenEditModal(true);
    } else {
      setViewDeleteModal(true);
    }
  };

  useEffect(() => {
    setPage(1);
    handleGetDashboard(1);
  }, [debouncedSearchTerm]);

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
            Support
          </h1>
        }
      >
        <div className={classes.table__wrapper}>
          <div className={classes._searchDiv}>
            <div className={classes._left}>
              <div className={classes.search}>
                <SearchInput
                  setter={setSearch}
                  value={search}
                  placeholder="Search..."
                />
              </div>

              <DropDown
                customStyle={{ width: "160px" }}
                setter={(e) => {
                  setFilter(e);
                  handleGetDashboard(1, e?.value);
                  setPage(1);
                }}
                value={filter}
                options={filterOptions}
                placeholder={"Filter"}
              />
            </div>
          </div>
          <div className={classes.tableContent}>
            <style>{`
        // .modal-body{
        //     height: 550px;
        //     overflow-y: auto;
        // }
        .table100-body{
          height:calc(100vh - 375px);
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
            padding-block: 15px;
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
                          width: "15%",
                          textAlign: "center",
                        }}
                      >
                        Name
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: "15%",
                          textAlign: "center",
                        }}
                      >
                        Email
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        Subject
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: "25%",
                          textAlign: "center",
                        }}
                      >
                        Message
                      </th>

                      <th
                        class="cell100 column5 "
                        style={{
                          width: "12%",
                          textAlign: "center",
                        }}
                      >
                        Status
                      </th>
                      <th
                        class="cell100 column5"
                        style={{
                          width: "15%",
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
                      {supportData?.length > 0 ? (
                        supportData?.map((item, index) => (
                          <tr key={index}>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: "15%",
                                textAlign: "center",
                              }}
                            >
                              <span>{item?.name}</span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: "15%",
                                textAlign: "center",
                              }}
                            >
                              {item?.email}
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: "20%",
                                textAlign: "center",
                              }}
                            >
                              {item?.subject}
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: "25%",
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.message}>
                                {item?.message}
                              </span>
                            </td>

                            <td
                              class="cell100 column5 "
                              style={{
                                width: "15%",
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
                                {item?.status}
                              </span>
                            </td>
                            <td
                              class="cell100 column5"
                              style={{
                                width: "15%",
                                textAlign: "center",
                              }}
                            >
                              <div ref={index == indexMap ? anchorRef : null}>
                                <SlOptions
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
                        <NoData text={"No Support found"} />
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
                  handleGetDashboard(e);
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
          />
        )}
        {viewDeleteModal && (
          <AreYouSureModal
            show={viewDeleteModal}
            setShow={setViewDeleteModal}
            onClick={() => deleteContact(selectedItem)}
            isApiCall={deleteContactLoading}
          />
        )}
        {openEditModal && (
          <SupportUpdateModal
            show={openEditModal}
            setShow={setOpenEditModal}
            loading={updateContactLoading}
            handleClick={handleUpdate}
            data={selectedItem}
          />
        )}
      </SideBarSkeleton>
    </>
  );
}
