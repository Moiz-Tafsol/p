import React, { useEffect, useRef, useState } from "react";
import classes from "./Categories.module.css";
import SideBarSkeleton from "../../Component/SideBarSkeleton";
import { Button } from "../../Component/Button/Button";
import { Col, Row } from "react-bootstrap";
import { Get, Patch, Post, Delete } from "../../Axios/AxiosFunctions";
import {
  BaseURL,
  apiHeader,
  formRegEx,
  formRegExReplacer,
  recordsLimit,
} from "../../config/apiUrl";
import { toast } from "react-toastify";
import { Loader } from "../../Component/Loader";
import { useSelector } from "react-redux";
import PaginationComponent from "../../Component/PaginationComponent";
import PoperComponent from "../../Component/PopperComponent";
import { SlOptions } from "react-icons/sl";
import NoData from "../../Component/NoData/NoData";
import TabsComponent from "../../Component/TabsComponent";
import AddEditCategoryModal from "../../modals/AddEditCategoryModal";
import AreYouSureModal from "../../modals/AreYouSureModal";
import moment from "moment";
import { DropDown } from "../../Component/DropDown/DropDown";
import SearchInput from "../../Component/SearchInput";
import useDebounce from "../../CustomHooks/useDebounce";
import TableSkeleton from "../../Component/TableSkeleton";
import AddEditPhotoCategoryModal from "../../modals/AddEditPhotoCategoryModal";

export default function Categories() {
  const tabsArray = [
    { label: "Faq Categories", value: "faq" },
    { label: "Forum Categories", value: "forum" },
    { label: "Photo Categories", value: "photo" },
    { label: "Blog Categories", value: "blog" },
  ];

  const options = [
    { label: "All", value: "all" },
    { label: "Active", value: "true" },
    { label: "In Active", value: "false" },
  ];
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );

  const anchorRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiCall, setIsApiCall] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openPopper, setOpenPopper] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [indexMap, setIndexMap] = useState(null);
  const [count, setCount] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [tabs, setTabs] = useState(tabsArray[0]);
  const [showDeleteModal, setShowDeleteModal] = useState();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [status, setStatus] = useState(options[0]);
  const debounced = useDebounce(search, 500);

  const tableElementWidth = ["20%", "20%", "20%", "20%", "20%"];
  ///////////////////// Popper Functions ///////////////////////
  const handleToggle = () => {
    setOpenPopper((prevOpen) => !prevOpen);
  };
  const handleActionClick = (flag) => {
    if (flag === "Delete") {
      setShowDeleteModal(true);
    }

    if (flag === "Edit") {
      if (tabs?.value === "photo") {
        setShowPhotoModal(true);
      } else {
        setModalOpen(true);
      }
    }
  };
  //////////////////////////////  GET DATA ///////////////
  const getCategories = async (
    pageNo = page,
    filterOption = status?.value,
    load = "main"
  ) => {
    const url = BaseURL(
      `categories/admin/all?page=${pageNo}&status=${filterOption}&search=${debounced}&type=${tabs?.value}`
    );
    setIsLoading(load);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setCategories(response?.data?.data?.data);
      setCount(response?.data?.data?.totalCount);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setPage(1);
    getCategories(1, status?.value, "main");
  }, [tabs, debounced]);

  //////////////////// ADD DATA ////////////////////////////

  const addCategoriHandler = async (Params, load = "main") => {
    setIsLoading(load);
    const response = await Post(
      BaseURL("categories/create"),
      Params,
      apiHeader(accessToken)
    );
    if (response) {
      toast.success("Category added successfully!");
      setCategories((prev) => [response?.data?.data, ...prev]);
    }

    setModalOpen(false);
    setIsLoading(false);
    setShowPhotoModal(false);
  };

  /////////////////////////////// UPDATE DATA ////////////////////
  const handleUpdate = async (body, load = "main") => {
    setIsLoading(load);
    const response = await Patch(
      BaseURL("categories/update"),
      body,
      apiHeader(accessToken)
    );

    if (response !== undefined) {
      toast.success("Category Updated Successfully");
      let index = categories?.findIndex(
        (ele) => ele?._id == response?.data?.data?._id
      );
      let tempArr = [...categories];
      tempArr?.splice(index, 1, response?.data?.data);

      {
        status?.value === options[0]?.value
          ? setCategories(tempArr)
          : setCategories(
              tempArr?.filter((item) => item?._id !== selectedItem?._id)
            );
      }
    }
    setModalOpen(false);
    setIsLoading(false);
    setShowPhotoModal(false);
  };

  //////////////////////////// DELETE CATEGORY ///////////////////////
  const handleDeleteCategory = async () => {
    setIsLoading(true);
    const response = await Delete(
      BaseURL(`categories/delete/${selectedItem?._id}`),
      apiHeader(accessToken)
    );

    if (response != undefined) {
      toast.success("Category Deleted Succesfully");
      setCategories(
        categories?.filter((item) => item?._id !== selectedItem?._id)
      );
    }
    setShowDeleteModal(false);
    setIsLoading(false);
  };

  return (
    <SideBarSkeleton header={<p className={classes.pageheading}>Categories</p>}>
      <div className={classes.filters}>
        <div className={classes.tabs}>
          <TabsComponent
            data={tabsArray}
            value={tabs.label}
            setter={(e) => {
              setTabs(e);
              setSearch("");
            }}
          />
        </div>
        <div className={classes.innerfilters}>
          <div className={classes.search}>
            <SearchInput
              setter={setSearch}
              placeholder="Search..."
              value={search}
            />
          </div>
          <div className={classes.btns}>
            <DropDown
              customStyle={{
                width: "150px",
              }}
              placeholder="Filter"
              options={options}
              value={status}
              setter={(e) => {
                setPage(1);
                setStatus(e);
                getCategories(1, e?.value, "main");
                setSearch("");
              }}
            />

            <Button
              onClick={() => {
                tabs.value === "photo"
                  ? setShowPhotoModal(true)
                  : setModalOpen(true);

                setSelectedItem(null);
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
        height:calc(100vh - 370px);
        overflow-y:auto;
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

    .table100.ver1{
      overflow-x:auto !important;
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
        overflow-x:auto !important;
        width:1100px
    
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
                    S No.
                  </th>
                  <th
                    class="cell100 column5 "
                    style={{
                      width: tableElementWidth?.[0],
                      textAlign: "center",
                    }}
                  >
                    Categories
                  </th>
                  <th
                    class="cell100 column5 "
                    style={{
                      width: tableElementWidth?.[1],
                      textAlign: "center",
                    }}
                  >
                    Status
                  </th>
                  <th
                    class="cell100 column5 "
                    style={{
                      width: tableElementWidth?.[2],
                      textAlign: "center",
                    }}
                  >
                    Created At
                  </th>

                  <th
                    class="cell100 column5"
                    style={{
                      width: tableElementWidth?.[3],
                      textAlign: "center",
                      paddingLeft: "25px",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          {isLoading == "main" ? (
            <TableSkeleton rowsCount={recordsLimit} colsCount={9} />
          ) : (
            <div class="table100-body js-pscroll ps ps--active-y">
              <table>
                <tbody>
                  {categories?.length > 0 ? (
                    categories?.map((item, index) => (
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
                            width: tableElementWidth?.[0],
                            textAlign: "center",
                          }}
                        >
                          {item?.name}
                        </td>

                        <td
                          class="cell100 column5 "
                          style={{
                            width: tableElementWidth?.[1],
                            textAlign: "center",
                          }}
                        >
                          <span className="active">
                            {item?.isActive === true ? "Active" : "non Active"}
                          </span>
                        </td>

                        <td
                          class="cell100 column5 "
                          style={{
                            width: tableElementWidth?.[2],
                            textAlign: "center",
                          }}
                        >
                          {moment(item?.createdAt).format("MMM Do YY")}
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
                    <NoData text={"No Categories found"} />
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
              getCategories(e, status?.value);
            }}
            currentPage={page}
          />
        </div>
      </div>

      {modalOpen && (
        <AddEditCategoryModal
          type={tabs}
          show={modalOpen}
          setShow={setModalOpen}
          data={selectedItem}
          onClick={selectedItem === null ? addCategoriHandler : handleUpdate}
          apiCalling={isLoading}
        />
      )}

      {showDeleteModal && (
        <AreYouSureModal
          show={showDeleteModal}
          setShow={setShowDeleteModal}
          onClick={handleDeleteCategory}
          isApiCall={isLoading}
        />
      )}

      {showPhotoModal && (
        <AddEditPhotoCategoryModal
          type={tabs}
          data={selectedItem}
          show={showPhotoModal}
          setShow={setShowPhotoModal}
          onClick={selectedItem === null ? addCategoriHandler : handleUpdate}
          apiCalling={isLoading}
        />
      )}
    </SideBarSkeleton>
  );
}
