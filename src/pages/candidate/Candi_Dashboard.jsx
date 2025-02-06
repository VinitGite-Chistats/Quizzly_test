import React, { useEffect, useState } from "react";
import logo from "../../images/logo.svg";
import bg_img from "../../images/candidate_bg.svg";
// import bg_circle from '../assets/bg_circle.svg'
import { IoCalendarOutline } from "react-icons/io5";
import status_logo from "../../images/status_logo.svg";
import { RiLogoutBoxRLine } from "react-icons/ri";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import footer_logo from "../../images/Footer_logo.svg";
import chistats_logo from "../../images/chistats_logo.svg";
import axios from "axios";
import toast from "react-stacked-toast";

const Candi_Dashboard = () => {
  const location = useLocation()
  const { data } = location.state
  console.log('Data arrvied at Candidate Dashboard', data.examStatus);
  const dateStatus = sessionStorage.getItem('comp_date')

  const getUser = localStorage.getItem("login_user");
  const [getQuizStatus, setQuizStatus] = useState(false)
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL_EXAM
  useEffect(() => {
    if (data.examStatus !== 'Completed') {
      setQuizStatus(true)
    } else {
      setQuizStatus(false)
    }
  }, [])

  const handleLogout = () => {
    // localStorage.removeItem('quiz_submitted')
    navigate("/");
    localStorage.removeItem("login_user");
    sessionStorage.removeItem('comp_date');
  };

  // const navigateExamPage = async () => {
  //   try {
  //     const response = await axios.get(`${url}StartExam?username=${getUser}`)
  //     if (response.data.status === true) {
  //       setQuizStatus(true)
  //       setTimeout(() => {
  //         navigate("/exam");
  //       }, 1500)
  //     } else {
  //       setQuizStatus(false);
  //       const errorMessage = response.data.detail.split(": ").pop();
  //       toast.error(errorMessage)
  //     }

  //   } catch (error) {
  //     setQuizStatus(false)
  //     // Check if error response contains a detail message
  //     if (error.response && error.response.status === 500) {
  //       toast.error('Internal Server Error. Please try again later.');
  //     } else {
  //       // Handle other error types (e.g., network errors, 404)
  //       toast.error('An error occurred. Please try again later.');
  //     }
  //     console.error('Error occurred:', error);
  //   }

  // };
  const navigateExamPage = async () => {
    try {
      const response = await axios.get(`${url}/StartExam?username=${getUser}`);
      if (response.data.status === true) {
        setQuizStatus(true);
        navigate("/exam");
      }
    } catch (error) {
      setQuizStatus(false);
      toast.error('You cannot take the exam as it has already started or completed.')
    }
  };
  return (
    <section
      className="flex flex-col w-screen h-screen overflow-x-hidden overflow-y-auto bg-cover xl:overflow-hidden lg:overflow-hidden md:overflow-hidden sm:overflow-y-auto lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover"
      style={{ backgroundImage: `url(../../images/candidate_bg.svg)` }}
    >
      {/* Navbar */}
      <nav className="flex justify-between w-full p-3 bg-white border-b-2 gap-x-1">
        <div className="flex gap-x-2">
          <img src={logo} alt="" className="w-[60%]" />
          <h2 className="text-2xl font-bold">Quizzly</h2>
        </div>

        <div className="flex justify-between w-fit">
          <Dropdown>
            <DropdownTrigger className="">
              <button className="p-2 bg-gray-200 rounded-full">
                <FaUser />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem>
                <User name={`${getUser}`} />
              </DropdownItem>
              <DropdownItem>
                <Divider />
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={handleLogout}
              >
                <p className="flex items-center gap-x-2">
                  <RiLogoutBoxRLine className="text-lg" />
                  <span>Logout</span>
                </p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <img src={chistats_logo} alt="" className="w-[64%]" />
        </div>
      </nav>

      {/* Dashboard */}
      <h2 className="mt-3 text-2xl font-semibold text-center">Dashboard</h2>
      <div className="p-6 bg-white xl:w-[60%] lg:w-[70%] md:w-[80%] sm:w-[90%] w-auto xl:mx-auto lg:mx-auto md:mx-auto sm:mx-auto mx-5 flex flex-col items-center justify-center mt-3 rounded-lg shadow-lg gap-y-4">
        {/* Exam Card*/}
        <div className="flex flex-col items-center justify-center text-center border-4 border-gray-300 gap-y-4 xl:w-[45%] lg:w-[55%] md:w-[65%] sm:w-[75%] w-full xl:mx-3 lg:mx-4 md:mx-5 sm:mx-6 mx-8 mt-1 pb-4 rounded-md">
          <h2 className="mt-3 text-3xl font-semibold">Internship Exam</h2>
          {getQuizStatus ? (
            <button
              className="p-2 font-medium bg-green-300 rounded-md cursor-pointer w-fit text hover:bg-green-200"
              onClick={navigateExamPage}
            >
              Start Exam
            </button>
          ) : (
            <button
              className="p-2 font-medium bg-gray-300 rounded-md cursor-not-allowed w-fit text hover:bg-gray-200"
              disabled={getQuizStatus}
            >
              Exam Submitted
            </button>
          )}
          <Divider className="w-[90%]" />
          <h3 className="font-semibold">Details</h3>

          {/* Details */}
          <div className="flex flex-col w-full px-6 gap-y-3">
            <div className="flex justify-between w-auto lg:w-auto md:w-auto sm:w-auto">
              <div className="flex gap-x-2">
                <IoCalendarOutline className="text-[130%]" />
                <p>Date</p>
              </div>
              {/* {dateStatus ? (
                <p>----</p>
              ) : (
                <p>{new Date().toLocaleDateString("en-GB")}</p>

              )} */}
              <p>{dateStatus}</p>
            </div>
            <div className="flex justify-between w-auto lg:w-auto md:w-auto sm:w-auto">
              <div className="flex gap-x-2">
                <img src={status_logo} alt="date_img" />
                <p>Status</p>
              </div>
              {getQuizStatus ? <p>Incomplete</p> : <p>Completed</p>}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="flex flex-col w-full">
          <div>
            <h2 className="text-xl font-semibold">Exam Rules</h2>
          </div>

          <ol type="1" className="list-decimal list-inside">
            <li>Copying, external assistance, and suspicious behavior are strictly prohibited. </li>
            <li>Changing tabs, exiting full-screen mode, or using multiple logins will result in violations.</li>
            <li>Two violations will trigger automatic exam submission.</li>
            <li>Answers can be modified until the exam is submitted or the timer ends.</li>
            <li>Ensure a stable internet connection to avoid disruptions.</li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center mb-3 mt-7 xl:mt-auto lg:mt-4 md:mt-5 sm:mt-6">
        <img
          src={footer_logo}
          alt="footer_logo"
          className="xl:w-[14%] lg:w-[18%] md:w-[22%] sm:w-[26%] w-[40%]"
        />
      </div>
    </section>
  );
};

export default Candi_Dashboard;
