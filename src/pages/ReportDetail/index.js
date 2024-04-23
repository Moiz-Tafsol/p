import { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Get, Patch } from "../../Axios/AxiosFunctions";
import { DropDown } from "../../Component/DropDown/DropDown";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import PoperComponent from "../../Component/PopperComponent";
import SearchInput from "../../Component/SearchInput";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import TableSkeleton from "../../Component/TableSkeleton";
import useDebounce from "../../CustomHooks/useDebounce";
import { BaseURL, apiHeader, recordsLimit } from "../../config/apiUrl";
import ReportDetailModal from "../../modals/ReportDetailModal";
import ReportEditModal from "../../modals/ReportEditModal";
import classes from "./ReportDetail.module.css";

const filterOptions = [
  { label: "All", value: "" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Pending", value: "pending" },
];

const tableElementWidth = ["20%", "20%", "20%", "20%", "20%"];
export default function ReportDetail() {
  const anchorRef = useRef(null);
  const [page, setPage] = useState(1);
  const [openPopper, setOpenPopper] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);

  const [count, setCount] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(filterOptions[0]);

  const [modalOpen, setModalOpen] = useState(false);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const slug = useParams().slug;
  const [data, setData] = useState([]);
  const [photoId, setPhotoId] = useState("");
  const [loader, setLoader] = useState(false);
  const debounce = useDebounce(search, 500);
  const [isApiCall, setIsApiCall] = useState(false);
  const getReportDetails = async (
    pageNo = page,
    filterOption = filter?.value
  ) => {
    setLoader(true);
    const response = await Get(
      BaseURL(
        `photos/admin/reported/single/${slug}?&search=${debounce}&page=${pageNo}&limit=${recordsLimit}&status=${filterOption}`
      ),
      accessToken
    );
    if (response != undefined) {
      setData(response?.data?.data?.reports);
      setPhotoId(response?.data?.data?._id);
      setCount(response?.data?.data?.totalCount);
    }
    setLoader(false);
  };

  const updateHandler = async (body) => {
    const params = {
      photoId,
      ...body,
    };
    const apiUrl = BaseURL("photos/admin/update-report");
    setIsApiCall(true);
    const response = await Patch(apiUrl, params, apiHeader(accessToken));
    if (response !== undefined) {
      toast.success(`Report Updated Successfully`);
      setData((prev) => {
        if (selectedItem) {
          return prev?.map((item) => {
            if (item._id === selectedItem._id) {
              return response?.data?.data;
            }
            return item;
          });
        }
        return [response?.data?.data?.reports[0], ...prev];
      });

      let index = data?.findIndex(
        (ele) => ele?._id == response?.data?.data?._id
      );
      let tempArr = [...data];
      tempArr?.splice(index, 1, response?.data?.data);

      {
        filter?.value === filterOptions[0]?.value
          ? setData(tempArr)
          : setData(tempArr?.filter((item) => item?._id !== selectedItem?._id));
      }

      setModalOpen(false);
    }
    setIsApiCall(false);
  };

  useEffect(() => {
    getReportDetails();
  }, [debounce]);

  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleActionClick = (flag) => {
    if (flag === "View") {
      setModalOpen({ view: true, edit: false });
    } else if (flag === "Edit") {
      setModalOpen({ view: false, edit: true });
    }
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
            Report Detail
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
                  getReportDetails(1, e?.value);
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
                        Name
                      </th>
                      <th
                        class="cell100 column5 "
                        style={{
                          width: tableElementWidth?.[1],
                          textAlign: "center",
                        }}
                      >
                        Email
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
              <div class="table100-body js-pscroll ps ps--active-y">
                <table>
                  {loader ? (
                    <TableSkeleton rowsCount={10} colsCount={4} />
                  ) : (
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
                              <span>{item?.user?.username}</span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[1],
                                textAlign: "center",
                              }}
                            >
                              {item?.user?.email}
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
                                textAlign: "center",
                              }}
                            >
                              <span className={classes.description}>
                                {item?.description}
                              </span>
                            </td>
                            <td
                              class="cell100 column5 "
                              style={{
                                width: tableElementWidth?.[2],
                                textAlign: "center",
                              }}
                            >
                              {item?.status}
                            </td>

                            <td
                              class="cell100 column5"
                              style={{
                                width: tableElementWidth?.[3],
                                textAlign: "center",
                                cursor: "pointer",
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
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <NoData text={"No Reports found"} />
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
                  )}
                </table>
              </div>
            </div>
            <div className={classes.paginationDiv}>
              <PaginationComponent
                totalPages={Math.ceil(count / recordsLimit)}
                setCurrentPage={(e) => {
                  setPage(e);
                  getReportDetails(e);
                }}
                currentPage={page}
              />
            </div>
          </div>
        </div>
      </SideBarSkeleton>
      {modalOpen?.view && (
        <ReportDetailModal
          selectedItem={selectedItem}
          setShow={(e) => setModalOpen((prev) => ({ ...prev, view: e }))}
          show={modalOpen?.view}
        />
      )}
      {modalOpen?.edit && (
        <ReportEditModal
          data={selectedItem}
          setShow={(e) => setModalOpen((prev) => ({ ...prev, edit: e }))}
          show={modalOpen?.edit}
          apiCalling={isApiCall}
          onClick={updateHandler}
        />
      )}
    </>
  );
}
