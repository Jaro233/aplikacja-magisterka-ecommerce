import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import { Container, Typography, Button, makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import { NotificationContext } from "../context/NotificationContext"; // Import NotificationContext

const useStyles = makeStyles((theme) => ({
  body: {
    maxWidth: "100%", // Ensure it doesn't exceed the container's width
    margin: "0px", // Center the component horizontally
    // padding: theme.spacing(2),
    boxSizing: "border-box",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "center",
    marginTop: theme.spacing(8),
    marginLeft: "auto",
    marginRight: "auto",
    // textAlign: "start",
    maxWidth: "500px",
  },
  media: {
    height: 300,
    // alignSelf: "flex-start", // Align image to the left
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "start",
    // width: "100%",
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  const classes = useStyles();
  const { sendNotification } = useContext(NotificationContext);

  useEffect(() => {
    axios
      .get(`${window._env_.REACT_APP_PRODUCT_SERVICE_URL}/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(
          error.response && error.response.status === 404
            ? "Product not found"
            : "Error fetching product"
        );
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    const token = document.cookie
      .split(";")
      .find((item) => item.trim().startsWith("token="));
    if (!token) {
      toast.error("You must be logged in to add items to the cart.");
      history.push("/login");
      return;
    }

    axios
      .post(
        `${window._env_.REACT_APP_CART_SERVICE_URL}/api/cart`,
        { productId: id },
        { withCredentials: true }
      )
      .then((response) => {
        // toast.success("Product added to cart");
        // sendNotification("Product added to cart", "cart");
      })
      .catch((error) => toast.error("Error adding to cart"));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container className={classes.container}>
      <img
        src={product.imageUrl}
        alt={product.name}
        className={classes.media}
      />
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {product.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        ${product.price}
      </Typography>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={addToCart}
        >
          Add to Cart
        </Button>
        <Button
          variant="contained"
          color="success"
          className={classes.button}
          onClick={() => history.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default ProductDetail;
