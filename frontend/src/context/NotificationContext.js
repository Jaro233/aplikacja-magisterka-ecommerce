import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io(`${window._env_.REACT_APP_NOTIFICATION_SERVICE_URL}`, {
      path: "/api/notifications",
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to notification server");
      // toast.success("Connected to notification server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from notification server");
      // toast.error("Disconnected from notification server");
    });

    socket.on("orderNotification", (order) => {
      const message = `Order ${order.id} created`;
      console.log(message);
      setNotifications((prev) => [...prev, message]);
      sendNotification(message, "order");
    });

    socket.on("cartNotification", (cartAction) => {
      const message = createCartMessage(cartAction);
      console.log(message);
      setNotifications((prev) => [...prev, message]);
      sendNotification(message, "cart");
    });

    socket.on("userNotification", (userAction) => {
      const message = createUserMessage(userAction);
      console.log(message);
      setNotifications((prev) => [...prev, message]);
      sendNotification(message, "user");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createCartMessage = (cartAction) => {
    const { action, productId } = cartAction;
    switch (action) {
      case "add":
        return `Item ${productId} added to cart`;
      case "remove":
        return `Item ${productId} removed from cart`;
      case "update":
        return `Item ${productId} updated in cart`;
      default:
        return `Cart updated`;
    }
  };
  const createUserMessage = (userAction) => {
    const {
      user: { username },
      event,
    } = userAction;
    switch (event) {
      case "user_login":
        return `User ${username} logged`;
      case "user_registration":
        return `User ${username} registered`;
      default:
        return `User logged`;
    }
  };

  const sendNotification = (message, type) => {
    switch (type) {
      case "order":
        toast.success(message);
        break;
      case "cart":
        toast.info(message);
        break;
      case "user":
        toast.success(message);
        break;
      default:
        toast.info(message);
        break;
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, sendNotification }}>
      {children}
      <ToastContainer position="top-center" />
    </NotificationContext.Provider>
  );
};

export { NotificationContext }; // Ensure this is exported
