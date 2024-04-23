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
import classes from "./AddEditFaqModal.module.css";
import TableSkeleton from "../../Component/TableSkeleton";
import { Skeleton } from "@mui/material";

const options = [
  { label: "Active", value: true },
  { label: "Non Active", value: false },
];

export default function AddEditFaqModal({
  show,
  setShow,
  data,
  apiCalling,
  onClick,
}) {
  const { access_token: accessToken } = useSelector(
    (state) => state?.authReducer
  );
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCategories = async () => {
    const url = BaseURL(`categories/admin/all?status=all&type=faq`);
    setIsLoading(true);
    const response = await Get(url, accessToken);
    if (response !== undefined) {
      setCategories(response?.data?.data?.data);
      setCategory(
        data
          ? Object.assign(
              {},
              response?.data?.data?.data?.filter(
                (value) => value?._id == data?.category?._id
              )
            )[0]
          : null
      );
      setIsLoading(false);
    }
  };

  const validator = () => {
    const body = {
      question,
      answer,
      category: category?._id,
      // ...(!data && { category: category?._id }),
      ...(data && { faqId: data?._id }),
      ...(data && { isActive: isActive?.value }),
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
    setQuestion(data?.question || "");
    setAnswer(data?.answer || "");
    setIsActive(
      data
        ? Object.assign(
            {},
            options?.filter((value) => value?.value == data?.isActive)
          )[0]
        : null
    );
  }, [data]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <ModalSkeleton
        show={show}
        setShow={setShow}
        width="700px"
        borderRadius="20px"
        header={data ? "Edit Faq" : " Add Faq"}
        showCloseIcon={true}
      >
        {isLoading ? (
          <Skeleton className={classes.skeleton} />
        ) : (
          <div className={classes._main}>
            <div className={classes._form}>
              {" "}
              <div className={classes._feild}>
                <DropDown
                  label={"Category"}
                  labelClassName={classes.dropDownLabelClass}
                  value={category}
                  setter={(e) => {
                    setCategory(e);
                  }}
                  options={categories}
                  optionLabel={"name"}
                  optionValue={"_id"}
                  placeholder={"Select Category"}
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
              {data && (
                <div className={classes.switchdiv}>
                  <DropDown
                    label={"Status"}
                    labelClassName={classes.dropDownLabelClass}
                    options={options}
                    placeholder={"Select Status"}
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
              )}
              <div className={classes._feild}>
                <Input
                  label={"Question"}
                  value={question}
                  setter={setQuestion}
                  customStyle={{
                    width: "100%",
                  }}
                  placeholder={"Enter Question"}
                />
              </div>
              <div className={classes._feild}>
                <TextArea
                  labelStyle={{
                    marginLeft: "8px",
                  }}
                  label={"Answer"}
                  value={answer}
                  setter={setAnswer}
                  customStyle={{
                    width: "100%",
                  }}
                  placeholder={"Enter Answer"}
                />
              </div>
              <div className={classes.btn__wrapper}>
                <Button
                  onClick={validator}
                  customStyle={{ width: "fit-content" }}
                  disabled={apiCalling}
                  label={
                    data
                      ? apiCalling
                        ? "loading..."
                        : "Update"
                      : apiCalling
                      ? "loading..."
                      : "Submit"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </ModalSkeleton>
    </>
  );
}
