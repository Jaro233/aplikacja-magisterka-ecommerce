import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
  },
  productContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: theme.spacing(2),
  },
  productDetails: {
    flexGrow: 1,
  },
  quantityField: {
    width: 60,
    marginRight: theme.spacing(2),
  },
  removeButton: {
    marginLeft: theme.spacing(2),
  },
  orderButton: {
    marginRight: theme.spacing(2),
  },
}));

const Cart = () => {
  const classes = useStyles();
  const [cartItems, setCartItems] = useState([]);
  const history = useHistory();

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CART_SERVICE_URL}/api/cart`,
        { withCredentials: true }
      );
      setCartItems(response.data || []);
    } catch (error) {
      toast.error("Error fetching cart items");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/${productId}`,
        { withCredentials: true }
      );
      toast.success("Product removed from cart");
      fetchCartItems();
    } catch (error) {
      toast.error("Error removing product from cart");
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        toast.error("Quantity must be greater than 0");
        return;
      }

      await axios.put(
        `${process.env.REACT_APP_CART_SERVICE_URL}/api/cart/count`,
        { productId, quantity },
        { withCredentials: true }
      );

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: Number(quantity) } : item
        )
      );
      toast.success("Cart updated successfully");
    } catch (error) {
      toast.error("Error updating cart");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      await axios.post(
        `${process.env.REACT_APP_ORDER_SERVICE_URL}/api/orders`,
        { items: orderItems },
        { withCredentials: true }
      );
      toast.success("Order placed successfully");
      setCartItems([]);
      history.push("/orders"); // Redirect to orders page
    } catch (error) {
      toast.error("Error placing order");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty</Typography>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className={classes.productContainer}>
            <img
              src={item.imageUrl}
              alt={item.name}
              className={classes.productImage}
            />
            <div className={classes.productDetails}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body1">{item.description}</Typography>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                className={classes.quantityField}
                inputProps={{ min: 1 }}
              />
              <Typography variant="body2">
                Price: ${item.price * item.quantity}
              </Typography>
            </div>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRemove(item.id)}
              className={classes.removeButton}
            >
              REMOVE
            </Button>
          </div>
        ))
      )}
      {cartItems.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlaceOrder}
          className={classes.orderButton}
        >
          PLACE ORDER
        </Button>
      )}
      <Button
        variant="contained"
        color="success"
        className={classes.button}
        onClick={() => history.push("/")}
      >
        Back to Home
      </Button>
    </Container>
  );
};

export default Cart;
