import React, { useEffect } from "react";
import classes from "./UpdateStatus.module.css";
import ModalSkeleton from "../ModalSkeleton";
import { useState } from "react";
import { Button } from "../../Component/Button/Button";
import { formRegEx, formRegExReplacer } from "../../config/apiUrl";
import { toast } from "react-toastify";
import { DropDown } from "../../Component/DropDown/DropDown";
const options = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "system-deactivated" },
];
export default function UpdateStatusModal({
  active,
  show,
  setShow,
  data,
  apiCalling,
  onClick,
}) {
  const [status, setStatus] = useState(options[0]);

  useEffect(() => {
    if (data) {
      setStatus(
        options.find((ele) => ele?.value === data?.active) || options[0]
      );
    }
  }, [data]);

  const validator = () => {
    const body = {
      userId: data?._id,
      active: status?.value,
    };
    for (let key in body) {
      if ([0, "", null, undefined]?.includes(body[key])) {
        return toast.error(
          `Please change the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field!`
        );
      }
    }
    onClick(body, "addLoading");
  };

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={"Change Status"}
        showCloseIcon={true}
      >
        <div className={classes._main}>
          <div className={classes._form}>
            <div className={classes._feild}>
              <DropDown
                value={status}
                setter={setStatus}
                options={options}
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
            <div className={classes.btn__wrapper}>
              <Button
                label={
                  data
                    ? apiCalling == "addLoading"
                      ? "loading..."
                      : "Update"
                    : apiCalling == "addLoading"
                    ? "loading..."
                    : "Submit"
                }
                onClick={validator}
                disabled={apiCalling == "addLoading" ? true : false}
              />
            </div>
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
}
