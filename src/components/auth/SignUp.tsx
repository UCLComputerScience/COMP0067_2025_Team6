import React from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

import {
  Alert as MuiAlert,
  Button as MuiButton,
  TextField as MuiTextField,
  Typography,
  Link,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "@/hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const Centered = styled(Typography)`
  text-align: center;
`;

function SignUp() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        organisation: "",
        email: "",
        password: "",
        confirmPassword: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required("First name is required"),
        lastName: Yup.string().max(255).required("Last name is required"),
        organisation: Yup.string().max(255).required("Organisation is required"),
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string()
          .min(12, "Must be at least 12 characters")
          .max(255)
          .required("Required"),
        confirmPassword: Yup.string().oneOf(
          // @ts-ignore
          [Yup.ref("password"), null],
          "Passwords must match"
        ),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Signup failed");
          }

          // Redirect user to login page
          router.push("/auth/sign-in");
        } catch (error: any) {
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          {errors.submit && (
            <Alert mt={2} mb={1} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="text"
            name="firstName"
            label="First name"
            value={values.firstName}
            error={Boolean(touched.firstName && errors.firstName)}
            fullWidth
            helperText={touched.firstName && errors.firstName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="lastName"
            label="Last name"
            value={values.lastName}
            error={Boolean(touched.lastName && errors.lastName)}
            fullWidth
            helperText={touched.lastName && errors.lastName}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="text"
            name="organisation"
            label="Organisation"
            value={values.organisation}
            error={Boolean(touched.organisation && errors.organisation)}
            fullWidth
            helperText={touched.organisation && errors.organisation}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="email"
            name="email"
            label="Email address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <TextField
            type="password"
            name="confirmPassword"
            label="Confirm password"
            value={values.confirmPassword}
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            fullWidth
            helperText={touched.confirmPassword && errors.confirmPassword}
            onBlur={handleBlur}
            onChange={handleChange}
            my={3}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            mb={3}
          >
            Sign up
          </Button>
          <Centered>
            Already have an account?{" "}
            <Link href="sign-in" component={NextLink}>
              Log in
            </Link>
          </Centered>
        </form>
      )}
    </Formik>
  );
}

export default SignUp;
