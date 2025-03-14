import React, { ReactNode, useEffect } from "react";

import { ConfigProvider, ThemeConfig } from "antd";
import { UserProvider, useUserContext } from "../contexts/UserContext";
import { isAxiosError } from "axios";
import AxiosClient from "../helpers/AxiosClient";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { NotificationProvider } from "../contexts/NotificationContext";

interface RouteProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setUser, user } = useUserContext();
  const navigate = useNavigate();
  const token = Cookies.get("auth.token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await AxiosClient.get("/auth/@me");

        setUser(res.data.data);
      } catch (err) {
        if (isAxiosError(err)) {
          Cookies.remove("auth.token");
          Cookies.remove("auth.refresh_token");
        }
        navigate("/login");
        console.log(err);
      }
    };

    fetchUserData();
  }, [navigate, setUser, token]);

  useEffect(() => {
    if (user && ["/login", "/signup"].includes(location.pathname)) {
      if (!user.profile_created) {
        navigate(`/create`);
      } else {
        navigate(`/profile/@${user?.username}`);
      }
    }

    if (!user && ["/create", "/edit"].includes(location.pathname)) {
      navigate("/login");
    }
  }, [user, navigate]);

  return <>{children}</>;
};

const MainLayout: React.FC<RouteProps> = ({ children }) => {
  const themeConfig: ThemeConfig = {
    components: {
      DatePicker: {
        colorBgElevated: "#06080E",
        hoverBorderColor: "#05DF72",
        colorPrimary: "#05DF72",
        colorText: "#ffffff",
        colorTextDescription: "#ffffff",
        colorTextHeading: "#ffffff",
      },
      Upload: {
        colorPrimary: "#05DF72",
      },
      Input: {
        hoverBorderColor: "#05DF72",
        activeBorderColor: "#05DF72",
      },
      Button: {
        colorPrimary: "#0cc954",
        colorPrimaryActive: "#0cc954",
        colorPrimaryHover: "#05DF72",
        colorText: "#ffffff",
      },
      Modal: {
        contentBg: "rgb(6,8,14)",
        headerBg: "rgba(255,255,255,0)",
        titleColor: "rgba(255,255,255,0.88)",
        colorIcon: "rgba(255,255,255,0.88)",
        colorIconHover: "rgba(255,255,255,1)",
        colorText: "rgba(255,255,255,0.88)",
        colorTextDescription: "rgba(255,255,255,0.88)",
      },
    },
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <UserProvider>
        <NotificationProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </NotificationProvider>
      </UserProvider>
    </ConfigProvider>
  );
};

export default MainLayout;
