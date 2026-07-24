import axios from "axios";
import Swal from "sweetalert2";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      Swal.fire({
        title: "Connection Error",
        text: "Could not reach the server. Please try again later.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
