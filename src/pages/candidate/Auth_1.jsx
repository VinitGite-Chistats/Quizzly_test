import React from "react";
import { useState } from "react";
import logo from "../../images/logo.svg";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { otpSchemas } from "../../schemas/auth_schema.js";
import { useNavigate } from "react-router-dom";
import { Input } from "@nextui-org/react";
import axios from "axios";
// import auth_bg from "../../images/auth_bg.svg";
import auth_bg from "../../images/auth_bg.svg";

const candidate_signup = () => {
  const navigate = useNavigate()
  const [button, setButton] = useState(true)

  const URL = import.meta.env.VITE_URL_EXAM
  // Initial Login credentials
  const OTPInitialValues = {
    full_name: "",
    email: "",
  };

  // Using for Sign in form
  const OTPFormik = useFormik({
    initialValues: OTPInitialValues,
    validationSchema: otpSchemas,
    onSubmit: async (values, action) => {
      try {
        setButton(false)
        const response = await axios.post(`${URL}/send-otp?email=${values.email}`)
        // const response = await axios.get(`${URL}/send-otp`, {
        //   email: values.email
        // })
        if (response) {
          // console.log(response);
          // localStorage.setItem('registred_username', values.full_name)
          // localStorage.setItem('registred_email', values.email)
          setTimeout(() => {
            setTimeout(() => {
              navigate('/otp_verify', {
                state: {
                  data: {
                    values
                  }
                }
              })
            }, 2000);
            toast.success(`${response.data.message}`);
          }, 1000);
        }
        // setTimeout(() => {
        //   setTimeout(() => {
        //     navigate("/otp_verify", {
        //       state: {
        //         data: {
        //           values,
        //         },
        //       },
        //     });
        //   }, 2000);
        //   toast.success("OTP sent Successful");
        //   //   localStorage.setItem("sign_up_user_email", values.email);
        // }, 1000);
        action.resetForm();
      } catch (error) {
        console.log(error);
        toast.error;
      }
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    OTPFormik;

  // useEffect(() => {
  //   console.log(errors);
  // }, [errors]);

  const handleForm = () => {
    navigate('/candidate_login')
  };
  return (
    <section
      className="w-screen h-screen overflow-y-auto bg-cover xl:overflow-hidden lg:overflow-hidden md:overflow-y-auto sm:overflow-y-auto lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover "
      style={{ backgroundImage: `url(../../images/auth_bg.svg)` }}
    >
      <Toaster />

      <div className="flex items-center justify-center h-full">
        <form
          className="bg-white py-3 xl:w-[30%] lg:w-[40%] md:w-[70%] sm:w-[80%] w-full xl:mx-0 lg:mx-0 md:mx-0 sm:mx-0 mx-6  px-4 shadow-md rounded-lg flex flex-col gap-y-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center justify-center text-center lg:mt-1 md:mt-2">
            <img src={logo} alt="logo" className="w-[16%]" />
            <h2 className="mt-1 text-2xl font-semibold">Sign Up</h2>
            <h4>Let's sign up quickly to get started.</h4>
          </div>
          <div className="flex flex-col gap-y-4">
            <Input
              isRequired
              variant="subtle"
              className="pl-2"
              name="full_name"
              value={values.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              labelPlacement={"outside"}
              label="Full Name"
              placeholder="Enter your full name"
              isInvalid={errors.full_name && touched.full_name}
              errorMessage={`${errors.full_name}`}
            />

            <Input
              isRequired
              variant="subtle"
              className="pl-2"
              name="email"
              label="Email"
              placeholder="Enter your email"
              labelPlacement="outside"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={errors.email && touched.email}
              errorMessage={`${errors.email}`}
            />
          </div>
          <div className="flex items-center justify-center mt-1 gap-y-1">
            <button
              type="submit"
              className="px-5 py-1.5 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-400 disabled:bg-[#adadadad] disabled:cursor-not-allowed"
              disabled={!button}
            >
              Send OTP
            </button>
          </div>
          {/* <OTPModal /> */}
          <p className="flex justify-center mt-3 gap-x-2">
            Already have account?{" "}
            <span
              className="font-medium cursor-pointer text-dark-blue hover:underline"
              onClick={handleForm}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </section>
  );
};

export default candidate_signup;
