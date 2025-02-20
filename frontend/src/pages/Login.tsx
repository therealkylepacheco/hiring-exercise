import {
  Alert,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_TOKEN, CURRENT_USER_ID } from "../helpful/constants";
import { authenticate } from "../util/user/user";

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
      const auth = await authenticate(username, password);
      localStorage.setItem(AUTH_TOKEN, auth.auth_token);
      localStorage.setItem(CURRENT_USER_ID, auth.user._id);
      navigate("users");
    } catch (error) {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction="column"
        rowSpacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Typography variant="h3">Login</Typography>
        </Grid>
        {error && <Alert severity="error">Invalid Username/Password</Alert>}

        <Grid item xs={12}>
          <FormControl>
            <TextField
              required
              id="username"
              variant="outlined"
              label="Username"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <TextField
              required
              id="password"
              variant="outlined"
              label="Password"
              type="password"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" type="submit">
            Login
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
