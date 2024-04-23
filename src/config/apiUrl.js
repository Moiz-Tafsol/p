export const apiUrl = "https://9053-39-51-64-163.ngrok-free.app";
export const s3Url = "https://tron-bucket-live.s3.amazonaws.com";
export const imageUrl = (url) => `${s3Url}/${url}`;
export const PAYPAL_CLIENT_ID = "";
export const BaseURL = (link) => {
  return `${apiUrl}/api/v1/${link}`;
};

export const apiHeader = (token, isFormData) => {
  if (token && !isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    };
  }
  if (token && isFormData) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "69420",
      },
    };
  }
  if (!token && !isFormData) {
    return {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
      },
    };
  }

  if (!token && isFormData) {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "69420",
      },
    };
  }
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const CreateFormData = (data) => {
  const formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  return formData;
};

export const firebaseVapidObject = {
  vapidKey: "",
};

export const formRegEx = /([a-z])([A-Z])/g;
export const formRegExReplacer = "$1 $2";

export var recordsLimit = 10;
export var recordsLimit50 = 50;

export const ReturnFormatedNumber = (number) => {
  let newNumber = number?.slice(2);
  newNumber = newNumber?.replace(/(\d{3})(\d{3})(\d{4})/, "($1) - $2 $3");
  return newNumber;
};

export const falsyArray = [
  null,
  undefined,
  "",
  0,
  false,
  NaN,
  "null",
  "undefined",
  "false",
  "0",
  "NaN",
];

export const numberRegEx = /[^0-9]+/g;

/**
 * Validates if the provided URL matches the URL regex pattern for specific types like www.example.com.
 *
 * @param {string} url - The URL to be validated.
 * @return {boolean} Returns true if the URL matches the specific regex pattern, false otherwise.
 */
export function validateURL(url) {
  const urlRegex = /^(https?:\/\/)?(www\..+\.com)(.*)$/;
  return urlRegex.test(url);
}
