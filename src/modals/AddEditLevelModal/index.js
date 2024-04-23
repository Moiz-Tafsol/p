import React, { useEffect } from "react";
import classes from "./AddEditLevelModal.module.css";
import ModalSkeleton from "../ModalSkeleton";
import { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { Col, Row } from "react-bootstrap";
import { Input } from "../../Component/Input";
import { Button } from "../../Component/Button/Button";
import { formRegEx, formRegExReplacer } from "../../config/apiUrl";
import { toast } from "react-toastify";

export default function ({ show, setShow, data, apiCalling, onClick }) {
  const [levelName, setLevelName] = useState("");
  const [downloads, setDownloads] = useState("");
  const [limit, setLimit] = useState("");
  const [stage, setStage] = useState("");

  useEffect(() => {
    if (data) {
      setLevelName(data?.name || "");
      setDownloads(data?.downloadLimit || "");
      setLimit(data?.uploadLimit || "");
      setStage(data?.stage || "");
    }
  }, [data]);

  const validator = () => {
    const body = {
      name: levelName,
      downloadLimit: Number(downloads),
      uploadLimit: Number(limit),
      stage: Number(stage),
      ...(data && { id: data._id }),
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
    onClick(body, "addLoading");
  };

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={data ? "Edit Level" : "Add Level"}
        showCloseIcon={true}
      >
        <div className={classes._main}>
          <div className={classes._form}>
            <div className={classes._feild}>
              <Input
                label={"Level Name"}
                value={levelName}
                setter={setLevelName}
                customStyle={{
                  width: "100%",
                }}
                placeholder={"Name Here"}
              />
            </div>
            <div className={classes._feild}>
              <Input
                label={"No. Of Downloads"}
                value={downloads}
                setter={setDownloads}
                customStyle={{
                  width: "100%",
                }}
                placeholder={"Enter Number"}
                regexType={"number"}
              />
            </div>
            <div className={classes._feild}>
              <Input
                label={"Stage"}
                value={stage}
                setter={setStage}
                customStyle={{
                  width: "100%",
                }}
                placeholder={"Enter Stage Number"}
                regexType={"number"}
              />
            </div>
            <div className={classes._feild}>
              <Input
                regexType={"number"}
                label={"Upload Limit per week"}
                value={limit}
                setter={setLimit}
                customStyle={{
                  width: "100%",
                }}
                placeholder={"Enter Limit"}
              />
            </div>

            <div className={classes.btn__wrapper}>
              <Button
                label={
                  data
                    ? apiCalling == "addLoading"
                      ? "loading..."
                      : "Save"
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
