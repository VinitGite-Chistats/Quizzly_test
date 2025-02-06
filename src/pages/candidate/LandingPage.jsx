import React from "react";
// import bg_img from "../assets/bg_rectangle.svg";
import bg_img from "../../images/Landing_page.svg";
import underline from "../../images/underline.svg";
import online_test from "../../images/online_test_bg.svg";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg";
import chistats_logo from "../../images/chistats_logo.svg";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import admin_img from "../../images/admin_login.svg";

const LandingPage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/candidate_login");
  };

  const handleAdminLogin = () => {
    navigate("/admin_login");
  };
  return (
    <section
      className="w-screen h-screen overflow-y-auto bg-cover xl:overflow-hidden lg:overflow-hidden md:overflow-y-auto sm:overflow-y-auto lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover "
      style={{ backgroundImage: `url(../../images/Landing_page.svg)` }}
    >
      {/* Navbar */}
      <nav className="fixed z-20 flex items-center justify-between w-full p-3 pr-12 shadow-lg xl:w-full xl:shadow-none lg:shadow-lg md:shadow-lg sm:shadow-lg lg:w-full md:w-full xl:backdrop-blur-none lg:backdrop-blur-md md:backdrop-blur-lg sm:backdrop-blur backdrop-blur-md xl:bg-transparent xl:flex lg:flex md:flex sm:fixed">
        <div className="flex gap-x-1">
          <img src={logo} alt="" className="" />
          <h2 className="text-3xl font-bold">Quizzly</h2>
        </div>

        <div className="flex items-center justify-center gap-x-20">
          <img src={chistats_logo} alt="company_logo" className="w-[90%] " />
          <Dropdown>
            <DropdownTrigger className="p-1.5 mt-1 bg-white rounded-full ">
                <button className="w-full" title="Admin">
                  <img src={admin_img} alt="admin_image" className="w-[90%] " />
                </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="delete"
                className=""
                color="primary"
                onClick={handleAdminLogin}
              >
                <p className="flex items-center gap-x-2">
                  <RiLogoutBoxRLine className="text-lg" />
                  <span>Admin Login</span>
                </p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </nav>

      {/* Title */}
      <div className="relative flex justify-center mx-auto mt-32 text-center xl:mt-20 lg:mt-20 md:mt-24 sm:mt-28">
        <h1 className="xl:w-[65%] lg:w-[70%] md:w-auto sm:w-auto w-auto  text-5xl sm:text-5xl xl:leading-[120%] lg:leading-[140%] md:leading-[120%] sm:leading-[130%] leading-[120%] z-10 lg:mx-0 md:mx-6 sm:mx-6 mx-6">
          Challenge Your Knowledge and Elevate Your Skills on{" "}
          <span className="font-semibold">Quizzly</span>
        </h1>
        <img
          src={underline}
          alt="underline_img"
          className="absolute xl:top-[80.5%] xl:right-[37.6%] lg:hidden md:hidden sm:hidden hidden xl:block w-[11%]"
        />
      </div>

      {/* About */}
      <div className="flex justify-center mx-auto mt-5 text-center lg:mt-5 md:mt-6 sm:mt-5 ">
        <p className="lg:w-[50%] md:w-[80%] sm:w-full w-full lg:mx-0 md:mx-4 sm:mx-6 mx-6 text-lg font-normal">
          <span className="font-medium">Quizzly</span> is an interactive quiz app
          that lets you test your knowledge across various topics while having
          fun. Complete each quiz and get instant feedback, with a personalized
          scorecard displayed at the end to track your performance.
        </p>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-4 gap-x-12 ">
        {/* <button
          className="bg-white text-dark-blue px-8 py-1.5 rounded text-lg font-medium shadow-md shadow-gray-400 hover:shadow-none cursor-pointer border-dark-blue border-1"
          onClick={handleAdminLogin}
        >
          Admin Login
        </button> */}
        <button
          className="bg-dark-blue text-white px-4 py-1.5 rounded text-lg font-medium shadow-md shadow-blue-400 hover:shadow-none cursor-pointer  "
          onClick={handleNavigate}
        >
          Candidate login
        </button>
      </div>

      {/* Image */}
      <div className="flex justify-center">
        <img src={online_test} alt="" className="lg:w-[25%] " />
      </div>
    </section>
  );
};

export default LandingPage;
