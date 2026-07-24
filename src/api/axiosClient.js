import axios from "axios";
import Swal from "sweetalert2";

// Base URL for our local json-server instance (run with `npm run server`)
const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Central place to react to failed requests. If json-server isn't running,
// axios will fail with no `error.response`, which we treat as a connection
// problem and surface with a SweetAlert2 popup instead of a silent console error.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      Swal.fire({
        title: "Connection Error",
        text: "Could not reach the server. Make sure json-server is running (npm run server).",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
