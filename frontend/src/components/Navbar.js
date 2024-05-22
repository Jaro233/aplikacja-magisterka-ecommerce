import React from "react";
import { useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Badge,
  makeStyles,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    cursor: "pointer", // Add cursor pointer to indicate it's clickable
  },
  button: {
    margin: theme.spacing(1),
  },
  welcome: {
    marginRight: theme.spacing(2),
  },
}));

const Navbar = ({ isLoggedIn, username, cartItemCount, checkAuth }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    checkAuth();
    history.push("/login");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => history.push("/")}
          >
            E-Commerce
          </Typography>
          {isLoggedIn ? (
            <>
              <Typography className={classes.welcome}>
                Welcome, {username}
              </Typography>
              <Button
                color="inherit"
                className={classes.button}
                onClick={() => history.push("/cart")}
              >
                <Badge badgeContent={cartItemCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </Button>
              <Button
                color="inherit"
                className={classes.button}
                onClick={() => history.push("/orders")}
              >
                Orders
              </Button>
              <Button
                color="inherit"
                className={classes.button}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                className={classes.button}
                onClick={() => history.push("/login")}
              >
                Login
              </Button>
              <Button
                color="inherit"
                className={classes.button}
                onClick={() => history.push("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
