import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import {
  CreateFormData,
  formRegEx,
  formRegExReplacer,
} from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./ReportEditModal.module.css";

const options = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];
export default function ReportEditModal({
  show,
  setShow,
  data,
  apiCalling,
  onClick,
}) {
  const [isActive, setIsActive] = useState(null);

  const validator = () => {
    let body = { reportId: data?._id, status: isActive?.value };
    for (let key in body) {
      if ([0, "", null, undefined]?.includes(body[key])) {
        return toast.error(
          `Please fill the ${key
            .replace(formRegEx, formRegExReplacer)
            .toLowerCase()} field!`
        );
      }
    }
    onClick(body);
  };

  useEffect(() => {
    setIsActive(
      data ? options?.find((ele) => ele?.value === data?.status) : null
    );
  }, [data]);

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={"Update Report"}
        showCloseIcon={true}
      >
        <div className={classes._main}>
          <div className={classes._form}>
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
                label={apiCalling ? "loading..." : "Update"}
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
