import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Paper, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  function onSubmit(data) {
    if (data.password && data.password !== data.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    updateUser(data);
    alert("Profile updated successfully!");
  }

  return (
    <Paper sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>Profile Settings</Typography>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password")}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("confirmPassword")}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Save Changes
        </Button>
      </form>
    </Paper>
  );
}
