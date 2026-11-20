import { Children, createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import httpStatus from "http-status";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:8080/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  const [userData, setUserData] = useState(authContext);

  const router = useNavigate();

  const handleSignUp = async (name, username, password) => {
    try {
      const request = await client.post("/signup", {
        name: name,
        username: username,
        password: password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (e) {
      throw e.response.data.message;
    }
  };

  const handleSignIn = async (username, password) => {
    try {
      const request = await client.post("/signin", {
        username: username,
        password: password,
      });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
      }
      return request.data.message;
    } catch (e) {
      throw e.response.data.message;
    }
  };

  const handleAddHistory = async (meetingCode) => {
    let request = await client.post("/addHistory", {
      token: localStorage.getItem("token"),
      meetingCode: meetingCode,
    });

    return request;
  };

  const handleGetHistory = async () => {
    try {
      let request = await client.get("/userHistory", {
        params: { token: localStorage.getItem("token") },
      });

      return request.data;
    } catch (e) {
      return e;
    }
  };

  const data = {
    userData,
    setUserData,
    handleSignUp,
    handleSignIn,
    handleAddHistory,
    handleGetHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
