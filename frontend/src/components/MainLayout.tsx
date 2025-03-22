import React, { ReactNode, useEffect, useState } from "react";

import { ConfigProvider, Spin, ThemeConfig } from "antd";
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

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
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, setUser, token]);

  useEffect(() => {
    if (loading) return;

    if (!token || !user) {
      if (["/create", "/edit"].includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    } else {
      if (["/login", "/signup"].includes(location.pathname)) {
        navigate(
          user.profile_created ? `/profile/@${user.username}` : "/create",
          { replace: true },
        );
      }
    }
  }, [user, navigate, token, loading]);

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" className="text-green-400 transform" />
      </div>
    );

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
      Switch: {
        colorPrimary: "#05DF72",
        colorPrimaryHover: "#05DF72",
        colorText: "#ffffff",
      },
      Spin: {
        colorPrimary: "#05DF72",
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
