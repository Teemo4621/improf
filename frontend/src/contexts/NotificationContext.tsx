import React, { createContext, useContext } from "react";
import { message } from "antd";

interface NotificationContextType {
    loading: (content: string) => Promise<void>;
    success: (content: string) => Promise<void>;
    error: (content: string) => Promise<void>;
    info: (content: string) => Promise<void>;
    warning: (content: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const notify: NotificationContextType = {
        loading: (content: string) =>
            new Promise<void>((resolve) => {
                const hide = messageApi.loading(content, 0);
                setTimeout(() => {
                    hide(); // ปิดการแจ้งเตือน loading
                    resolve();
                }, 2000); // หรือเปลี่ยนระยะเวลาได้
            }),
        success: (content: string) =>
            new Promise<void>((resolve) => {
                messageApi.open({
                    type: "success",
                    content,
                    onClose: resolve,
                });
            }),
        error: (content: string) =>
            new Promise<void>((resolve) => {
                messageApi.open({
                    type: "error",
                    content,
                    onClose: resolve,
                });
            }),
        info: (content: string) =>
            new Promise<void>((resolve) => {
                messageApi.open({
                    type: "info",
                    content,
                    onClose: resolve,
                });
            }),
        warning: (content: string) =>
            new Promise<void>((resolve) => {
                messageApi.open({
                    type: "warning",
                    content,
                    onClose: resolve,
                });
            }),
    };

    return (
        <NotificationContext.Provider value={notify}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
