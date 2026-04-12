import axios from "axios";

export const teacherNoticesApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
