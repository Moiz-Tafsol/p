import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { SlOptions } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Delete, Get, Patch } from "../../Axios/AxiosFunctions";
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
import classes from "./Users.module.css";
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "system-deactivated" },
];
const tableElementWidth = ["15%", "20%", "30%", "20%", "15%"];

export default function Users() {
  const anchorRef = useRef(null);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [page, setPage] = useState(1);
  const [openPopper, setOpenPopper] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);
  const [userData, setUserData] = useState([]);
  const [count, setCount] = useState(20);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterOptions[0]);
  const navigate = useNavigate();
  const debounced = useDebounce(search, 500);
  const [loader, setLoader] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);

  ///////////////////// Get DATA ///////////////////////////
  const handleGetUsers = async (
    pageNo = page,
    filterOption = filter?.value,
    load = "main"
  ) => {
    setLoader(load);
    const response = await Get(
      BaseURL(
        `users/admin/all?page=${pageNo}&search=${debounced}&status=${filterOption}&limit=${recordsLimit}`
      ),
      accessToken
    );
    if (response != undefined) {
      setUserData(response?.data?.data?.users);
      setCount(response?.data?.data?.totalCount);
    }
    setLoader(false);
  };

  /////////////////////UPDATE DATA///////////////////////////

  const handleUpdate = async (body, load = "update") => {
    setLoader(load);
    const response = await Patch(
      BaseURL("users/admin/update"),
      body,
      apiHeader(accessToken)
    );

    if (response !== undefined) {
      toast.success("Status Updated Successfully");
      let index = userData?.findIndex(
        (ele) => ele?._id == response?.data?.data?._id
      );
      let tempArr = [...userData];
      tempArr?.splice(index, 1, response?.data?.data);

      {
        filter?.value === filterOptions[0]?.value
          ? setUserData(tempArr)
          : setUserData(
              tempArr?.filter((item) => item?._id !== selectedItem?._id)
            );
      }
    }
    setModalOpen(false);
    setLoader(false);
  };

  /////////////////////////////// CSV Function ////////////////////////
  const getAllUser = async () => {
    const apiUrl = BaseURL("users/admin/all");
    setCsvLoading(true);
    const respose = await Get(apiUrl, accessToken);
    if (respose != undefined) {
      const { users } = respose?.data?.data;
      setCsvData(() => {
        return users.map((item) => {
          return {
            Name: item?.username,
            Email: item?.email,
            Phone: item?.phone,
            Status: item?.active,
            "Created At": moment(item?.createdAt).format("Do MMM YYYY"),
          };
        });
      });
    }
    setCsvLoading(false);
  };
  //////////////////////Popper Functions //////////////////////
  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleActionClick = (flag) => {
    if (flag === "View") {
      navigate(`/user-detail/${selectedItem?.slug}`);
    } else if (flag === "Edit ") {
      navigate(`/user-edit/${selectedItem?.slug}`, {
        state: {
          data: selectedItem,
        },
      });
    } else if (flag === "Delete") {
      setModalOpen(true);
    }
  };

  /////////////////////////////// Delete User Function ////////////////////////
  const handleDelete = async () => {
    const apiUrl = BaseURL(`users/admin/delete/${selectedItem?._id}`);
    setIsApiCall(true);
    const response = await Delete(apiUrl, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success("User Deleted Successfully");
      setModalOpen(false);
      setUserData((prev) =>
        prev.filter((item) => item._id !== selectedItem._id)
      );
    }
    setIsApiCall(false);
  };

  useEffect(() => {
    getAllUser();
  }, []);
  useEffect(() => {
    setPage(1);
    handleGetUsers(1, filter?.value);
  }, [debounced]);

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
            Users
          </h1>
        }
      >
        <div className={classes.table__wrapper}>
          <div className={classes._searchDiv}>
            <div className={classes._left}>
              <div className={classes.searchInput}>
                <SearchInput
                  setter={setSearch}
                  value={search}
                  placeholder="Search For User"
                />
              </div>
              <div className={classes.innerDiv}>
                <div className={classes.dropdowndiv}>
                  <DropDown
                    customStyle={{
                      width: "160px",
                    }}
                    setter={(e) => {
                      setPage(1);
                      setFilter(e);
                      setSearch("");
                      handleGetUsers(1, e?.value);
                    }}
                    value={filter}
                    options={filterOptions}
                    placeholder={"Filter"}
                  />
                </div>
                <div className={classes._button}>
                  <Button disabled={csvLoading}>
                    {csvLoading ? (
                      "Download CSV"
                    ) : (
                      <CSVLink data={csvData || [{}]} filename={"Users.csv"}>
                        Download CSV
                      </CSVLink>
                    )}
                  </Button>
                </div>
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
          height:calc(100vh - 390px);
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
          .table100-body td{
            padding-block : 15px;
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
        }import { apiUrl } from './../../config/apiUrl';

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
                        S No.
                      </th>

                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[1],
                          textAlign: "center",
                        }}
                      >
                        Name
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[2],
                          textAlign: "center",
                        }}
                      >
                        Email
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

              {loader == "main" ? (
                <TableSkeleton rowsCount={recordsLimit} colsCount={9} />
              ) : (
                <div class="table100-body js-pscroll ps ps--active-y">
                  <table>
                    <tbody>
                      {userData?.length > 0 ? (
                        userData?.map((item, index) => (
                          <tr key={index}>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[0],
                                textAlign: "center",
                              }}
                            >
                              <span>{index + 1}</span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[1],
                                textAlign: "center",
                              }}
                            >
                              <span>{item?.username}</span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
                                textAlign: "center",
                              }}
                            >
                              {item?.email}
                            </td>

                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[3],
                                textAlign: "center",
                                marginLeft: "13px",
                              }}
                            >
                              <span className="active">
                                {item?.active === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>
                            <td
                              class="cell100 column5"
                              style={{
                                width: tableElementWidth?.[4],
                                textAlign: "center",
                                marginRight: "13px",
                              }}
                            >
                              <div ref={index == indexMap ? anchorRef : null}>
                                <SlOptions
                                  color="var(--main-color)"
                                  size={24}
                                  cursor="pointer"
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
                        <NoData text={"No Users found"} />
                      )}
                      <PoperComponent
                        handleClick={handleActionClick}
                        open={openPopper}
                        setOpen={setOpenPopper}
                        anchorRef={anchorRef}
                        position
                        data={["View", "Edit ", "Delete"]}
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
                  handleGetUsers(e, filter?.value);
                }}
                currentPage={page}
              />
            </div>
          </div>
        </div>
      </SideBarSkeleton>
      {modalOpen && (
        <AreYouSureModal
          show={modalOpen}
          setShow={setModalOpen}
          isApiCall={isApiCall}
          onClick={handleDelete}
        />
      )}
    </>
  );
}
