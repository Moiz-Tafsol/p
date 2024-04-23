import React from "react";
import Pagination from "@mui/material/Pagination";

const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <>
      <style>{`
        .MuiPagination-ul li .Mui-selected {
            background: var(--main-color) !important;
            color: var(--white-color) !important;
            font-size:16px !important;
            min-width: 28px !important;
            height: 28px !important;
            font-family: var(--ff-primary-reg) !important;
        }
        .MuiPagination-ul li button {
            color: var(--light-gray-color) !important;
            font-size:16px !important;
            font-family: var(--ff-primary-bold);
        }
    `}</style>
      <div>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          shape="rounded"
        />
      </div>
    </>
  );
};

export default PaginationComponent;
