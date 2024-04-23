import { toast } from "react-toastify";

export const quillValidateHandler = (
  params,
  toastMessage = "Please fill the home cms field!"
) => {
  let flag = true;
  for (let key in params) {
    const parsedHTML = new DOMParser().parseFromString(
      params[key],
      "text/html"
    );
    const plainText = parsedHTML.body.textContent || "";
    if (plainText?.trim() === "") {
      toast.error(toastMessage);
      flag = false;
      break;
    }
  }
  return flag;
};
