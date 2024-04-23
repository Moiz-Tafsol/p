import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Get } from "../../Axios/AxiosFunctions";
import { DropDown } from "../../Component/DropDown/DropDown";
import ImageCardsComponent from "../../Component/ImageCardsComponent";
import NoData from "../../Component/NoData/NoData";
import PaginationComponent from "../../Component/PaginationComponent";
import SearchInput from "../../Component/SearchInput";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import useDebounce from "../../CustomHooks/useDebounce";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import classes from "./Reports.module.css";
import CardsLoading from "../../Component/CardsLoading";

const filterOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];
const Reports = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState(filterOptions[0]);
  const [data, setData] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const debounce = useDebounce(searchInput, 500);

  const getData = async (pageNo = page, filterOption = filter?.value) => {
    const url = BaseURL(
      `photos/admin/reported?&search=${debounce}&page=${pageNo}&limit=${recordsLimit}&status=${filterOption}`
    );
    setIsApiCall(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setData(response?.data?.data?.photos);
      setCount(response?.data?.data?.totalCount);
    }
    setIsApiCall(false);
  };

  useEffect(() => {
    getData();
  }, [debounce]);

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
          Reports
        </h1>
      }
    >
      <div className={classes.actions}>
        <div className={classes.search}>
          <SearchInput
            placeholder="Search..."
            value={searchInput}
            setter={setSearchInput}
          />
        </div>
        <DropDown
          placeholder="Filter"
          value={filter}
          customStyle={{ width: "150px" }}
          setter={(e) => {
            setFilter(e);
            getData(1, e?.value);
          }}
          options={filterOptions}
        />
      </div>
      {isApiCall ? (
        <CardsLoading height={389.78} />
      ) : (
        <>
          {data?.length === 0 ? (
            <NoData text="No Reports Found" />
          ) : (
            <>
              <ImageCardsComponent data={data} isFlag report={true} />{" "}
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
            </>
          )}
        </>
      )}
    </SideBarSkeleton>
  );
};

export default Reports;
