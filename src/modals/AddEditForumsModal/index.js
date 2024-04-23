import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Get } from "../../Axios/AxiosFunctions";
import { Button } from "../../Component/Button/Button";
import { DropDown } from "../../Component/DropDown/DropDown";
import { Input } from "../../Component/Input";
import { TextArea } from "../../Component/TextArea";
import { BaseURL, formRegEx, formRegExReplacer } from "../../config/apiUrl";
import ModalSkeleton from "../ModalSkeleton";
import classes from "./AddEditForumsModal.module.css";

const options1 = [
  { label: "Active", value: true },
  { label: "Non Active", value: false },
];

const options2 = [
  { label: "Featured", value: "featured" },
  { label: "Non-Featured", value: "non featured" },
];

export default function AddEditForumsModal({
  show,
  setShow,
  data,
  onClick,
  loading,
}) {
  const [isActive, setIsActive] = useState(null);
  const [featured, setFeatured] = useState(null);

  const handleSubmit = () => {
    let body = {
      isActive: isActive?.value,
      isFeatured: featured?.value === "featured" ? true : false,
    };

    for (let key in body) {
      if (
        ["", undefined, null]?.includes(body[key]) ||
        body[key]?.length === 0
      ) {
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
    if (data) {
      setIsActive(data?.isActive === true ? options1[0] : options1[1]);
      setFeatured(data?.isFeatured === true ? options2[0] : options2[1]);
    }
  }, []);

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={data ? "Edit Forum" : " Add Forum"}
        showCloseIcon={true}
      >
        <div className={classes._main}>
          <div className={classes._form}>
            {data && (
              <>
                <div className={classes.switchdiv}>
                  <DropDown
                    label={"Status"}
                    labelClassName={classes.dropDownLabelClass}
                    options={options1?.filter(
                      (item) => item?.value !== isActive?.value
                    )}
                    placeholder={"Status"}
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
                  />
                </div>
                <div className={classes.switchdiv}>
                  <DropDown
                    label={"Feature"}
                    labelClassName={classes.dropDownLabelClass}
                    options={options2.filter(
                      (item) => item?.value !== featured?.value
                    )}
                    placeholder={"Feature"}
                    value={featured}
                    setter={setFeatured}
                    customStyle={{
                      width: "100%",
                      backgroundColor: "var(--white-color)",
                      color: "var(--text-color)",
                      border: "1px solid var(--border-color)",
                    }}
                    indicatorColor="var(--main-color)"
                    placeholderColor="var(--label-color)"
                  />
                </div>
              </>
            )}
            <div className={classes.btn__wrapper}>
              <Button
                onClick={handleSubmit}
                customStyle={{ width: "fit-content" }}
                label={`${!loading ? "Update" : "Updating..."}`}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </ModalSkeleton>
    </>
  );
}
