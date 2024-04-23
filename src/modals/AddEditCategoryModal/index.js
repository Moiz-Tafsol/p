import React, { useEffect } from "react";
import classes from "./AddEditCategoryModal.module.css";
import ModalSkeleton from "../ModalSkeleton";
import { useState } from "react";
import { Input } from "../../Component/Input";
import { Button } from "../../Component/Button/Button";
import {
  CreateFormData,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import { toast } from "react-toastify";
import { DropDown } from "../../Component/DropDown/DropDown";

export default function AddEditCategoryModal({
  type,
  show,
  setShow,
  data,
  apiCalling,
  onClick,
}) {
  const [category, setCategory] = useState();
  const [isActive, setIsActive] = useState(null);
  const options = [
    { label: "Active", value: true },
    { label: "Non Active", value: false },
  ];
  const validator = () => {
    let body = {
      ...(data && { categoryId: data?._id }),
      ...(data && { isActive: isActive?.value }),
      name: category,
      ...(!data && { type: type?.value }),
    };
    for (let key in body) {
      if ([0, "", null, undefined]?.includes(body[key])) {
        return toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field!`
        );
      }
    }
    const formData = CreateFormData(body);
    onClick(formData, "add-edit");
  };

  // const validatorupdate = () => {
  //   let body = {
  //     categoryId: data?._id,
  //     name: category,
  //     isActive: isActive?.value,
  //   };
  //   for (let key in body) {
  //     if ([0, "", null, undefined]?.includes(body[key])) {
  //       return toast.error(
  //         `Please change the ${key
  //           .replace(formRegEx, formRegExReplacer)
  //           .toLowerCase()} field!`
  //       );
  //     }
  //   }
  //   onClick(body, "add-edit");
  // };

  useEffect(() => {
    setCategory(data ? data?.name : "");
    setIsActive(
      data ? options?.find((ele) => ele?.value === data?.isActive) : null
    );
  }, [data]);

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={data ? "Edit Category" : " Add New Category"}
        showCloseIcon={true}
      >
        {/* <div className={classes._header}>
          <div className={classes._left}>
            <h6>{data ? "Edit" : "New"} Level</h6>
          </div>
          <div className={classes._right} onClick={() => setShow(false)}>
            <RxCrossCircled />
          </div>
        </div> */}

        <div className={classes._main}>
          <div className={classes._form}>
            <div className={classes._feild}>
              <Input
                label={"Category"}
                value={category}
                setter={setCategory}
                customStyle={{
                  width: "100%",
                }}
                placeholder={"Enter Category"}
              />
            </div>

            {data && (
              <div className={classes.switchdiv}>
                <DropDown
                  options={options}
                  placeholder={"Select Status"}
                  label={"Status"}
                  value={isActive}
                  setter={setIsActive}
                  customStyle={{
                    width: "100%",
                    backgroundColor: "var(--white-color)",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                  }}
                  indicatorColor="var(--main-color)"
                  placeholderColor="var(--label-color)"
                  labelStyle={{
                    color: "var(--text-color)",
                  }}
                  mainHoverStyle={{
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>
            )}

            <div className={classes.btn__wrapper}>
              <Button
                label={
                  data
                    ? apiCalling == "add-edit"
                      ? "loading..."
                      : "Update"
                    : apiCalling == "add-edit"
                    ? "loading..."
                    : "Submit"
                }
                onClick={validator}
                disabled={apiCalling}
              />
            </div>
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
}
