import React from "react";
import { BiSearch } from "react-icons/bi";
import { Input } from "../Input";

function SearchInput({
  value,
  setter,
  placeholder = "Search...",
  customStyle = {
    height: "48px",
    border: "none",
    borderRadius: "12px",

    padding: "0px",
  },
  inputStyle = {
    padding: "0px 14px",
    fontSize: "14px",
    border: "1px solid var(--main-color)",
  },
}) {
  return (
    <Input
      setter={setter}
      value={value}
      customStyle={customStyle}
      inputStyle={inputStyle}
      placeholder={placeholder}
      rightIcon={<BiSearch size={22} color={"var(--main-color)"} />}
    />
  );
}

export default SearchInput;
