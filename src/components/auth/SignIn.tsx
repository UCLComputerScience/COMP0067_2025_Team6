"use client";

import React from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { spacing, SpacingProps } from "@mui/system";

import {
  Alert as MuiAlert,
  Checkbox,
  FormControlLabel,
  Button as MuiButton,
  TextField as MuiTextField,
  Link,
  Typography as MuiTypography,
} from "@mui/material";

import useAuth from "@/hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

interface ButtonProps extends SpacingProps {
  component?: React.ElementType;
  to?: string;
  target?: string;
}

const Button = styled(MuiButton)<ButtonProps>(spacing);

const Centered = styled(MuiTypography)`
  text-align: center;
`;

interface TypographyProps extends SpacingProps {
  as?: string;
}

const Typography = styled(MuiTypography)<TypographyProps>(spacing);

function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();

  return (
    <Formik
      initialValues={{
        email: "demo@bootlab.io",
        password: "unsafepassword",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Use the signIn function from the useAuth hook to authenticate
          const result = await signIn(values.email, values.password);

          if (result?.error) {
            throw new Error(result.error); // Handle error if there's an issue
          }

          // Redirect on successful login
          router.push("/dashboard/lab1");
        } catch (error: any) {
          const message = error.message || "Something went wrong";

          setStatus({ success: false });
          setErrors({ submit: message });
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
          <Alert mt={3} mb={3} severity="info">
            Use <strong>demo@bootlab.io</strong> and{" "}
            <strong>unsafepassword</strong> to sign in
          </Alert>
          {errors.submit && (
            <Alert mt={2} mb={3} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label="Email Address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
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
            my={2}
          />

          <Typography as="div" mb={2} variant="caption">
            <Link href="reset-password" component={NextLink}>
              Forgot password?
            </Link>
          </Typography>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            mb={3}
          >
            Sign in
          </Button>
          <Centered>
            Don't have an account yet?{" "}
            <Link href="sign-up" component={NextLink}>
              Sign up
            </Link>
          </Centered>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
