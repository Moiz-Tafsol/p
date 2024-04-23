import { toast } from "react-toastify";
import { CreateFormData } from "../config/apiUrl";
import axios from "axios";

const ImagesPost = async (route, data, headers) => {
  try {
    const formData = CreateFormData();
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      formData.append(`${data?.length == 1 ? "image" : "image[]"}`, element);
    }
    return await axios.post(route, formData, headers);
  } catch (error) {
    return toast.error(error);
  }
};
export { ImagesPost };
