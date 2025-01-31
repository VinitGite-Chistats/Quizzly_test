import React from "react";
import bg_img from "../../images/report_bg.svg";
import Confetti from "../../components/Confetti";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { FaUser } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import chistats_logo from "../../images/chistats_logo.svg"; 
import logo from "../../images/logo.svg";
import ZoneIndicator from "../../components/ZoneIndicator";
import { MdSpaceDashboard } from "react-icons/md";

const Report = () => {
  const location = useLocation();
  const { data } = location.state;
  // console.log("Data came to Report", data);

  const getUser = localStorage.getItem("login_user");
  const navigate = useNavigate("/");
  const handleDashboard = () => {
    const examStatus = 'Completed'
    navigate("/candidate_dashboard", {
      state: {
        data: {
          examStatus
        }
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("quiz_submitted");
    localStorage.removeItem("login_user");
    localStorage.clear()
    navigate("/");
  };
  return (
    <section
      className="flex flex-col w-screen h-screen overflow-y-auto bg-cover xl:overflow-hidden lg:overflow-hidden md:overflow-hidden sm:overflow-y-auto lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover "
      style={{ backgroundImage: `url(../../images/report_bg.svg)` }}
    >
      {/* Nav */}
      <nav className="flex justify-between w-full p-3 bg-white border-b-2 gap-x-1">
        <div className="flex gap-x-2">
          <img src={logo} alt="" className="w-[60%]" />
          <h2 className="text-2xl font-bold">Quizly</h2>
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
              <DropdownItem onClick={handleDashboard}>
                <p className="flex items-center gap-x-2">
                  <MdSpaceDashboard className="text-lg" />
                  <span>Dashboard</span>
                </p>
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
      {/* Main */}
      <div className="flex items-start mt-[6%] justify-center h-full">
        <div className="flex flex-col justify-start px-[10%] bg-white rounded-md shadow-md w-fit gap-y-10">
          <h1 className="mt-10 text-4xl font-extrabold text-center">
            Well Done!!! <br />
            You have successfully submitted <br />
            your exam
          </h1>
          <div className="">
            <h2 className="text-lg font-semibold text-center">
              Your Scoring zone
            </h2>
            <div className="flex justify-center mt-4">
              <ZoneIndicator data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-[40%] left-[50%]">
        <Confetti />
      </div>
    </section>
  );
};

export default Report;
