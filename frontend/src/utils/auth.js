import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Function to get user information from the token stored in cookies
export const getUser = () => {
  const cookie = document.cookie
    .split(";")
    .find((item) => item.trim().startsWith("token="));
  if (cookie) {
    const token = cookie.split("=")[1];
    try {
      const decodedToken = jwtDecode(token);
      return { username: decodedToken.username }; // Adjust according to your token's payload structure
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }
  return null;
};

// Function to get the count of items in the cart
export const getCartItemCount = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_CART_SERVICE_URL}/api/cart`,
      { withCredentials: true }
    );
    const cartItems = response.data;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    return 0;
  }
};
