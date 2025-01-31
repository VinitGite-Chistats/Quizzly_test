import React, { useEffect, useState } from "react";
import logo from "../../images/logo.svg";
import chistats_logo from "../../images/chistats_logo.svg";
import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import axios from "axios";
import ZoneIndicator from "../../components/ZoneIndicator";

const Analytics = () => {
  const location = useLocation();
  const { data } = location.state;
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL_ADMIN;
  console.log("Data Arrived at Analytics Pagee", data);
  const [examData, setExamData] = useState([]);

  const getUser = localStorage.getItem("login_admin");
  const handleDashboard = () => {
    navigate("/admin_dashboard");
  };

  useEffect(() => {
    loadUserDate();
  }, []);

  const loadUserDate = async () => {
    try {
      const response = await axios.get(`${url}/details?username=${data.email}`);
      const resp_data = response.data.exam_details;
      // console.log("Candidate Detailed Analytics data", resp_data);
      setExamData(resp_data);
    } catch (error) {
      console.error("Error at loading user data", error);
    }
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <section className="w-screen h-screen overflow-x-hidden bg-blue-50 ">
      {/* Navbar */}
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
              <DropdownItem>
                <Divider />
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={handleDashboard}
              >
                <p className="flex items-center gap-x-2">
                  <RiLogoutBoxRLine className="text-lg" />
                  <span>Admin Dashboard</span>
                </p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <img src={chistats_logo} alt="" className="w-[64%]" />
        </div>
      </nav>

      {/* Candidate Info */}
      <div className="px-6 py-3">
        <h3 className="text-lg font-semibold">Information of Candidate</h3>
        <div className="flex items-center justify-between">
          <div className="flex mt-3 gap-x-10">
            <div className="flex items-center gap-x-6">
              <h3 className="font-medium text-medium">Name</h3>
              <p className="px-3 py-1 bg-white rounded shadow text-medium">
                {data.full_name}
              </p>
            </div>
            <div className="flex items-center gap-x-6">
              <h3 className="font-medium text-medium">Email</h3>
              <p className="px-3 py-1 bg-white rounded shadow text-medium w-fit">
                {data.email}
              </p>
            </div>
          </div>

          {/* Report Card */}
          <div className="">
            <Button
              onPress={onOpen}
              className="px-4 py-1 text-base font-medium text-white bg-blue-400 rounded-md"
            >
              See Score
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalBody>
                      {/* Report Card */}
                      <div className="w-full">
                        <div className="mt-4 text-center">
                          <h3 className="text-lg font-semibold">Score card</h3>
                        </div>

                        {/* Gauge chart */}
                        <div className="flex justify-center mt-4">
                          <div className="w-[50%] max-w-full ml-5">
                            <ZoneIndicator data={data.zone} />
                          </div>
                        </div>

                        <Divider className="my-4" />

                        {/* Summary of Questions */}
                        <div className="flex flex-col my-4 gap-y-3">
                          <div className="flex justify-between px-4">
                            <h4 className="text-lg">
                              Total Number of Questions
                            </h4>
                            <h4 className="text-lg">
                              {data.report.total_questions}
                            </h4>
                          </div>
                          <div className="flex justify-between px-4">
                            <h4 className="text-lg">
                              Total number of correct questions
                            </h4>
                            <h4 className="text-lg">
                              {data.report.correct_answers}
                            </h4>
                          </div>
                        </div>

                        <Divider className="my-4" />

                        {/* Zone */}
                        <div className="flex justify-between px-4 my-4">
                          <h3 className="text-lg">Percentage</h3>
                          <h3 className="font-semibold text-large">
                            {/* {data.report.percentage} */}
                            {data.report.percentage === 100
                              ? "100"
                              : Math.floor(data.report.percentage * 100) / 100}
                            %
                          </h3>
                        </div>
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="flex flex-col mx-6">
        {/* Questions and Answers */}
        <div className="w-full py-3">
          <h2 className="text-lg font-semibold ">Total Questions</h2>
        </div>
        <div className="bg-[#DCECFF] max-h-[70vh] overflow-y-auto w-full scrollbar-custom">
          <div className="flex flex-col items-center justify-center mt-5 gap-y-4">
            {examData.map((item, index) => (
              <div
                className="w-full max-w-6xl p-3 bg-white rounded-md"
                key={index}
              >
                <div className="flex flex-col items-start gap-y-1">
                  <h1 className="font-medium w-fit">
                    Q.{index + 1}.{" "}
                    {item.Qtype === "text based" ? (
                      item.question
                    ) : (
                      <div className="h-full max-h-[50vh] overflow-y-auto">
                        <img
                          src={`data:image/png;base64,${item.question}`}
                          alt="question"
                          className="w-full "
                        />
                      </div>
                    )}
                  </h1>
                  {item.selected_answer === "null" && (
                    <span className="block text-red-700">(Not selected)</span>
                  )}
                </div>
                <ul>
                  {Object.entries(item.options).map(([key, value]) => (
                    <li
                      key={key}
                      className={`pl-1 py-0.5 mt-2 rounded border-[0.3px] border-gray-400 
                  ${
                    item.is_correct
                      ? key === item.correct_answer
                        ? "bg-green-100"
                        : ""
                      : key === item.correct_answer
                      ? "bg-green-100"
                      : key === item.selected_answer
                      ? "bg-red-100"
                      : ""
                  }
                `}
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;

{
  /* {examData.map((item, index) => {
              item.Qtype === "text based" ? (
                <div className="p-3 bg-white rounded-md w-fit" key={index}>
                  <h1 className="font-medium">
                    Q.1. Which data type is used to store a sequence of
                    characters in Python?
                  </h1>
                  <ul>
                    <li className="pl-1 py-0.5 mt-2 rounded border-[0.3px] border-gray-400">
                      List
                    </li>
                    <li className="pl-1 py-0.5 mt-3 rounded border-[0.3px] border-gray-400 bg-red-100">
                      Tuple
                    </li>
                    <li className="pl-1 py-0.5 mt-3 rounded border-[0.3px] border-gray-400">
                      Set
                    </li>
                    <li className="pl-1 py-0.5 mt-3 rounded border-[0.3px] border-gray-400 bg-green-100">
                      String
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="p-3 bg-white rounded-md w-fit">
                  <h1 className="font-medium">
                    Q.1. Which data type is used to store a sequence of
                    characters in Python?
                  </h1>
                  <ul>
                    <li className="pl-1 py-0.5 mt-2 rounded border-[0.3px] border-gray-400">
                      List
                    </li>
                    <li className="pl-1 py-0.5 mt-3 rounded border-[0.3px] border-gray-400 bg-red-100">
                      Tuple
                    </li>
                    <li className="pl-1 py-0.5 mt-3 rounded border-[0.3px] border-gray-400">
                      Set
                    </li>
                    <li className="pl-1 py-0.5 mt-3 rounded border-[0.3px] border-gray-400 bg-green-100">
                      String
                    </li>
                  </ul>
                </div>
              );
            })} */
}
