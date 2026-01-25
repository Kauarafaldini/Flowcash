import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
});

export function setUser(userId: string) {
  api.defaults.headers.common["x-user-id"] = userId;
}
