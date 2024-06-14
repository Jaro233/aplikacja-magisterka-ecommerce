import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductDetail from "./components/ProductDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import PrivateRoute from "./components/PrivateRoute";
import { NotificationProvider } from "./context/NotificationContext";
import Notification from "./components/Notification";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);

  const checkAuth = async () => {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    const token = tokenCookie ? tokenCookie.split("=")[1] : null;
    // console.log("Cookies:", cookies); // Log all cookies
    // console.log("Token Cookie:", tokenCookie); // Log the token cookie
    // console.log("Token:", token); // Log the token value

    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      // console.log("there token ", token);
      setIsLoggedIn(true);
      // console.log(isLoggedIn);
      fetchCartItemsCount();
    } else {
      // console.log("theres no token");
      setIsLoggedIn(false);
      // console.log(isLoggedIn);
    }
  };

  const fetchCartItemsCount = async () => {
    try {
      const response = await axios.get(
        `${window._env_.REACT_APP_CART_SERVICE_URL}/api/cart/count`,
        {
          withCredentials: true,
        }
      );
      setCartItemCount(response.data.count);
    } catch (error) {
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <div>
        <NotificationProvider>
          <Navbar
            isLoggedIn={isLoggedIn}
            checkAuth={checkAuth}
            cartItemCount={cartItemCount}
            username={username}
          />
          {/* <ToastContainer position="top-center" /> */}
          {/* <Notifications /> */}
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/products/:id" component={ProductDetail} />
            <Route path="/login">
              <Login checkAuth={checkAuth} />
            </Route>
            <Route path="/register" component={Register} />
            <PrivateRoute
              path="/cart"
              component={Cart}
              isLoggedIn={isLoggedIn}
            />
            <PrivateRoute
              path="/orders"
              component={Orders}
              isLoggedIn={isLoggedIn}
            />
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </NotificationProvider>
      </div>
    </Router>
  );
};

export default App;
