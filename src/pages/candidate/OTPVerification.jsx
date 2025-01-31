import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import otp_quiz_logo from "../../images/OTP_Quiz_app_logo.svg";
import email_otp from "../../images/email_otp_logo.svg";
import footer_logo from "../../images/Footer_logo.svg";
import otp_bg from "../../images/otp_bg.svg";
import axios from "axios";
const OTPVerification = () => {
  const location = useLocation();
  const { data } = location.state;
  const [otp, setOtp] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_URL_EXAM

  const resendOTP = async() => {
    try {
      const response = await axios.get(`${URL}/send_otp?email=${data.values.email}`)
      setMinutes(5);
      setSeconds(0);
      toast.success("OTP resend");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error;
    }
  };

  useEffect(() => {
    console.log('Data has been comes to OTP Verify Page',data);
  }, [])

  // Timer functions
  useEffect(() => {
    const interval = setInterval(() => {
      // Decrease the seconds if greater than 0
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      // When seconds reach 0, decrease minutes if greater than 0
      if (seconds === 0) {
        if (minutes === 0) {
          // Stop the countdown when both seconds and minutes are 0
          clearInterval(interval);
        } else {
          // Reset seconds to 59 and decrease minutes by 1
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      // cleanup functions = Stop the interval when component is unmounts
      clearInterval(interval);
    };
  }, [seconds]); // Re-run this effects whenever the seconds is changed

  // Verify OTP
  const verify_otp = async() => {
    try {
      const response = await axios.post(`${URL}/verify-otp`, {
        'email': data.values.email,
        'user_otp': otp
      })
    if(response.data.status == true){
      toast.success(`${response.data.message}`)
      setOtp("");
      setMinutes(0);
      setSeconds(0);
      setTimeout(() => {
        navigate("/candidate_details", {
          state: {
            data: data
          }
        });
      }, 3000);
    }else{
      toast.error(`${response.data.message}`)
    }
    } catch (error) {
      console.log('Error in OTP verification', error);
      
    }
  };

  return (
    <section
      className="bg-gradient-to-t from-slate-50 to-[#d6eaff] w-screen h-screen overflow-hidden flex flex-col lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover bg-cover "
      style={{ backgroundImage: `url(../../images/otp_bg.svg)` }}
    >
      <Toaster />

      <div className="">
        <img
          src={otp_quiz_logo}
          alt="otp_quiz_logo"
          className="xl:w-[10%] lg:w-[15%] md:w-[18%] sm:w-[26%] w-[35%] mt-10 mx-auto"
        />
      </div>

      {/* OTP Card */}
      <div className="flex flex-col justify-center p-6 mt-12 text-center bg-white rounded-md shadow-md xl:w-[40%] lg:w-[65%] md:[75%] sm:w-[85%] w-full items-center gap-y-2 z-10 xl:mx-auto lg:mx-auto md:mx-auto sm:mx-auto px-6">
        <img src={email_otp} alt="" className="w-[10%] mb-3" />
        <h2 className="text-3xl font-bold text-center ">OTP Verification</h2>
        <p className="mt-2 text-lg">
          {/* OTP has been send to <span className='font-semibold'>test@gmail.com</span> <br />Please verify it */}
          We have mailed you a 6-digit code. Please check your email & enter the
          code here to complete the verification
        </p>

        <div className="mt-4">
          <input
            type="text"
            maxLength={6}
            className="px-2 py-1 text-center border-black rounded-md border-[0.3px]"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
        </div>

        <div className="flex justify-between mt-3 text-lg gap-x-16">
          <p>
            OTP will expire in
            <span className="font-bold">
              {minutes < 10 ? ` 0${minutes}:` : minutes}
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </p>

          <button
            disabled={seconds > 0 || minutes > 0}
            className={`${
              seconds > 0 || minutes > 0
                ? "text-[#adadad] disabled:cursor-not-allowed"
                : " text-dark-blue cursor-pointer"
            }`}
            onClick={resendOTP}
          >
            Resend OTP
          </button>
        </div>

        <div className="flex justify-center mt-3">
          <button
            className={`px-4 py-2 font-medium text-white rounded-sm bg-dark-blue w-fit disabled:bg-[#adadad] disabled:cursor-not-allowed`}
            disabled={seconds === 0 && minutes === 0}
            onClick={verify_otp}
          >
            Verify OTP
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex justify-center mt-auto ">
        <img
          src={footer_logo}
          alt="footer_logo"
          className="xl:w-[15%] lg:w-[18%] md:w-[25%] sm:w-[30%] w-[40%] mb-2"
        />
      </footer>
    </section>
  );
};

export default OTPVerification;
