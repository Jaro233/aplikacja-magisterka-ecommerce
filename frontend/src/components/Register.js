import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  TextField,
  Container,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(8),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = () => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_USER_SERVICE_URL}/api/users/register`,
        { username, password, email }
      );
      toast.success("Registered successfully!");
      history.push("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <form className={classes.form} onSubmit={handleRegister}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Username"
          name="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
