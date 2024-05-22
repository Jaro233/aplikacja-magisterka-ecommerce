import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, makeStyles } from "@material-ui/core";
import Product from "./Product";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(8),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_PRODUCT_SERVICE_URL}/api/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Product product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Home;
