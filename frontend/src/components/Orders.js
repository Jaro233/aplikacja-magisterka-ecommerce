import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  productImage: {
    width: "100%",
    height: "auto",
  },
  orderItem: {
    display: "flex",
    alignItems: "center",
  },
}));

const Orders = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ORDER_SERVICE_URL}/api/orders`,
          { withCredentials: true }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };
    fetchOrders();
  }, []);

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      {orders.map((order) => (
        <Card key={order.id} className={classes.card}>
          <CardContent>
            <Typography variant="h6">Order ID: {order.id}</Typography>
            <Typography variant="subtitle1">Total: ${order.total}</Typography>
            <Typography variant="subtitle1">Items:</Typography>
            {order.items.map((item) => (
              <Grid
                container
                spacing={2}
                key={item.productId}
                className={classes.orderItem}
              >
                <Grid item xs={3}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={classes.productImage}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2">
                    Description: {item.description}
                  </Typography>
                  <Typography variant="body2">
                    Quantity: {item.quantity}
                  </Typography>
                  <Typography variant="body2">Price: ${item.price}</Typography>
                </Grid>
              </Grid>
            ))}
          </CardContent>
        </Card>
      ))}
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

export default Orders;
