import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    margin: "1rem",
  },
  media: {
    height: 140,
  },
});

const Product = ({ product }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={product.imageUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          ${product.price}
        </Typography>
        <Button
          component={Link}
          to={`/products/${product.id}`}
          variant="contained"
          color="primary"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default Product;
