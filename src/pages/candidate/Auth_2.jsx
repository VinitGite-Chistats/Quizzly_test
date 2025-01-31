import React from "react";
import { useEffect, useState } from "react";
import logo from "../../images/logo.svg";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { signUpSchemas } from "../../schemas/auth_schema.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@nextui-org/react";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import axios from "axios";
import auth_bg from "../../images/auth_bg.svg";

const candidate_details = () => {
  const location = useLocation();
  const { data } = location.state;
  console.log("Data has been arrived to sign up form", data);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const URL = import.meta.env.VITE_URL_EXAM
  
  // Initial Login credentials
  const SignUpInitialValues = {
    full_name: "",
    email: "",
    mobile_number: "",
    password: "",
    confirm_password: "",
  };
  // Using for Sign in form
  const signUpFormik = useFormik({
    initialValues: SignUpInitialValues,
    validationSchema: signUpSchemas,
    onSubmit: async (values, action) => {
      try {
        const response = await axios.post(`${URL}/register`, {
          "full_name": data.values.full_name,  
          "email": data.values.email,
          "mobile_no": values.mobile_number,
          "password": values.password,
          "confirm_password": values.confirm_password
        })
        if (response.data.status == true) {
            // console.log(response);
            setTimeout(() => {
                setTimeout(() => {
                    navigate('/candidate_login', {
                        state: {
                            data: {
                               values
                            }
                        }
                    })
                  action.resetForm();
                }, 2000);
              toast.success('Registration Successful...');
            }, 1000);
        } else {
          toast.error('Registration Failed')
        }

        
        // setTimeout(() => {
        //   setTimeout(() => {
        //     navigate("/candidate_dashboard");
        //   }, 2000);
        //   toast.success("Registration Successfull..");
        //   localStorage.setItem("sign_up_user_email", values.email);
        // }, 1000);
        
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong...');
      }
    },
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    signUpFormik;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <section
      className="w-screen h-screen overflow-y-auto bg-cover xl:overflow-hidden lg:overflow-hidden md:overflow-y-auto sm:overflow-y-auto lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover "
      style={{ backgroundImage: `url(../../images/auth_bg.svg)` }}
    >
      <Toaster />

      <div className="flex items-center justify-center h-full gap-y-3">
        <form
          className="bg-white py-3 xl:w-[30%] lg:w-[40%] md:w-[70%] sm:w-[80%] w-full xl:mx-0 lg:mx-0 md:mx-0 sm:mx-0 mx-6  px-4 shadow-md rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center justify-center text-center lg:mt-1 md:mt-2">
            <img src={logo} alt="logo" className="w-[16%]" />
            <h2 className="mt-1 text-2xl font-semibold">Sign Up</h2>
            <h4>Let's sign up quickly to get started.</h4>
          </div>
          <div className="flex flex-col gap-y-2">
            <Input
              isRequired
              isReadOnly
              variant="subtle"
              className="pl-2"
              name="full_name"
              label="Full Name"
              labelPlacement="outside"
              value={data.values.full_name}
              disabled
            />

            <Input
              isRequired
              isReadOnly
              variant="subtle"
              className="pl-2 pt-1.5 disabled:cursor-not-allowed"
              name="email"
              label="Email"
              labelPlacement="outside"
              value={data.values.email}
              disabled
            />
            <Input
              isRequired
              variant="subtle"
              className="pt-1.5 pl-2"
              name="mobile_number"
              label="Mobile Number"
              placeholder="Enter your mobile number"
              value={values.mobile_number}
              onChange={handleChange}
              onBlur={handleBlur}
              labelPlacement={"outside"}
              isInvalid={errors.mobile_number && touched.mobile_number}
              errorMessage={`${errors.mobile_number}`}
            />
            <Input
              isRequired
              className="pl-2"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Password"
              placeholder="Enter your password"
              labelPlacement={"outside"}
              isInvalid={errors.password && touched.password}
              errorMessage={`${errors.password}`}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <BiHide className="text-2xl pointer-events-none text-default-400" />
                  ) : (
                    <BiShow className="text-2xl pointer-events-none text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />

            <Input
              isRequired
              className="pl-2"
              name="confirm_password"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              label="Confirm Password"
              placeholder="Enter your confirm password"
              labelPlacement={"outside"}
              isInvalid={errors.confirm_password && touched.confirm_password}
              errorMessage={`${errors.confirm_password}`}
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <BiHide className="text-2xl pointer-events-none text-default-400" />
                  ) : (
                    <BiShow className="text-2xl pointer-events-none text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-1 gap-y-1">
            <button
              type="submit"
              className="px-5 py-1.5 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-400"
            >
              SignUp
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default candidate_details;
