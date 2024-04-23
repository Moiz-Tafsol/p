import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { Post } from "../../Axios/AxiosFunctions";
import {
  BaseURL,
  CreateFormData,
  apiHeader,
  imageUrl,
} from "../../config/apiUrl";
import classes from "./QuillInput.module.css";
import { Spinner } from "react-bootstrap";

function QuillInput({
  value,
  setter,
  quillClass = "",
  placeholder = "",
  labelClass,
  label,
}) {
  const { access_token } = useSelector((state) => state.authReducer);
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  // upload image to s3
  const uploadImageHandler = async (e) => {
    const url = BaseURL("users/upload");
    let params = {};
    const formData = CreateFormData(params);
    formData.append("photos", e);
    setLoading(true);
    const response = await Post(url, formData, apiHeader(access_token, true));
    if (response !== undefined) {
      return response?.data?.keys?.[0];
    }
    setLoading(false);
  };
  // Define the imageHandler within the component
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        // Use your function to upload the image and get the URL
        const image = await uploadImageHandler(file);
        if (image) {
          let url = imageUrl(image);
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", url);
          setLoading(false);
        }
      }
    };
  }, []);

  // Modules object needs to be memoized or defined outside the component
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  ); // Include imageHandler in the dependency array

  return (
    <>
      {label && (
        <label className={`${classes.label} ${labelClass && labelClass}`}>
          {label}
        </label>
      )}
      <div className={loading && classes.loaderDiv}>
        <div className={classes.quillInput}>
          <ReactQuill
            className={`${classes.quill} ${quillClass}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setter(e)}
            modules={modules}
            ref={quillRef}
          />
        </div>
        {loading && (
          <div className={classes.loader}>
            <Spinner animation="border" variant="white" />
          </div>
        )}
      </div>
    </>
  );
}

export default QuillInput;
