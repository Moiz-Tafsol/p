import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Get } from "../../Axios/AxiosFunctions";
import { DropDown } from "../../Component/DropDown/DropDown";
import ImageCardsComponent from "../../Component/ImageCardsComponent";
import PaginationComponent from "../../Component/PaginationComponent";
import SearchInput from "../../Component/SearchInput";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import TabsComponent from "../../Component/TabsComponent";
import useDebounce from "../../CustomHooks/useDebounce";
import { BaseURL, recordsLimit } from "../../config/apiUrl";
import classes from "./Gallery.module.css";
import NoData from "../../Component/NoData/NoData";
import CardsLoading from "../../Component/CardsLoading";

const statusOptions = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
];

const tabsArray = [
  { label: "Sponsored", value: true },
  { label: "Non Sponsored", value: false },
];
const Gallery = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState(statusOptions[0]);
  const [data, setData] = useState([]);
  const [isApiCall, setIsApiCall] = useState(false);
  const [tabs, setTabs] = useState(tabsArray[0]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const debounce = useDebounce(searchInput, 500);

  const getData = async (
    pageNo = page,
    filterOption = filter?.value,
    tabVal = tabs?.value
  ) => {
    const url = BaseURL(
      `photos/admin/all?sponsored=${tabVal}&search=${debounce}&page=${pageNo}&limit=${recordsLimit}&sortBy=${filterOption}`
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
          Gallery
        </h1>
      }
    >
      <div className={classes.filters}>
        <div className={classes.tabs}>
          <TabsComponent
            data={tabsArray}
            value={tabs.label}
            setter={(e) => {
              setTabs(e);
              getData(1, filter?.value, e?.value);
              setPage(1);
              setSearchInput("");
            }}
          />
        </div>
        <div className={classes.innerfilters}>
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
            setter={(e) => {
              setFilter(e);
              getData(1, e?.value);
              setPage(1);
            }}
            options={statusOptions}
            customStyle={{
              width: "130px",
            }}
          />
        </div>
      </div>
      {isApiCall ? (
        <CardsLoading height={389.78} />
      ) : (
        <>
          {data?.length === 0 ? (
            <NoData text="No Photo Found" />
          ) : (
            <>
              <ImageCardsComponent data={data} />
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

export default Gallery;
