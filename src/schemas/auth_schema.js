import * as Yup from "yup";

export const otpSchemas = Yup.object({
  full_name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const signUpSchemas = Yup.object({
  mobile_number: Yup.string()
    .required("Mobile Number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits "),
  password: Yup.string().required("Password is required"),
  confirm_password: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Password is not matching"),
});

export const loginSchemas = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const adminLoginSchemas = Yup.object({
  username: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required')
})