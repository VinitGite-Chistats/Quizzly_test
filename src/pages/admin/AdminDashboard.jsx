import React, { Suspense, useEffect, useMemo, useState } from "react";
import bg_img from "../../images/admin_bg.svg";
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
  Pagination,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
  User,
} from "@nextui-org/react";
// const Button = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Button }))
// );
// const Divider = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Divider }))
// );
// const Dropdown = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Dropdown }))
// );
// const DropdownItem = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.DropdownItem }))
// );
// const DropdownMenu = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.DropdownMenu }))
// );
// const DropdownTrigger = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.DropdownTrigger }))
// );
// const Modal = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Modal }))
// );
// const ModalBody = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.ModalBody }))
// );
// const ModalContent = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.ModalContent }))
// );
// const ModalHeader = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.ModalHeader }))
// );
// const Pagination = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Pagination }))
// );
// const Radio = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Radio }))
// );
// const RadioGroup = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.RadioGroup }))
// );
// const Table = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.Table }))
// );
// const TableBody = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.TableBody }))
// );
// const TableCell = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.TableCell }))
// );
// const TableColumn = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.TableColumn }))
// );
// const TableHeader = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.TableHeader }))
// );
// const TableRow = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.TableRow }))
// );
// const User = React.lazy(() =>
//   import("@nextui-org/react").then((mod) => ({ default: mod.User }))
// );


import { FaUser } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import TextBasedQuestion from "../../components/TextBasedQuestion";
import ImageBasedQuestions from "../../components/ImageBasedQuestions";
// import { useDisclosure } from "@nextui-org/react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_URL_ADMIN;
  const getUser = localStorage.getItem("login_admin");
  const [candiData, setCandiData] = useState([]);
  const [page, setPage] = useState(1);
  const [actions, setActions] = useState("text based");
  const [questionsData, setQuestionsData] = useState({
    category: "",
    question: "",
    options: {
      a: "",
      b: "",
      c: "",
      d: "",
    },
    answer: "",
  });
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const rowsPerPage = 10;
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4"];
  const [img, setImage] = useState();

  useEffect(() => {
    getCandidateInfo();
  }, []);

  const pages = Math.ceil(candiData.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return candiData.slice(start, end);
  }, [page, candiData]);

  const getCandidateInfo = async () => {
    try {
      const response = await axios.get(`${url}/UsersInfo`);
      // console.log(response.data.user_report);
      const data = response.data.user_report;
      setCandiData(data);
      // console.log("Candidate data", data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("login_admin");
    navigate("/");
  };

  const handleAnalytics = (name, email, zone, exam_report) => {
    setTimeout(() => {
      navigate("/analytics", {
        state: {
          data: {
            full_name: name,
            email: email,
            zone: zone,
            report: exam_report,
          },
        },
      });
      // console.log("Full Name", name);
      // console.log("Email", email);
      // console.log("Zone", zone);
      // console.log("Exam Report", exam_report);
    }, 500);
  };

  const deleteUser = async (email) => {
    const confirmation = confirm("Do you really want to delete candidate");
    console.log(confirmation);
    if (confirmation) {
      try {
        const response = await axios.delete(`${url}/delete-user/${email}`);
        const resp_data = response.data.message;
        toast.success(`${resp_data}`);
        getCandidateInfo();
      } catch (error) {
        toast.error("Failed to delete user");
        console.log(error);
      }
    }
  };

  const dateConverstion = (d) => {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    console.log(day, month, year);

    return `${day}/${month}/${year}`;
  };

  const handleTextQuestionInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("option")) {
      const key = name.split("-")[1]; // Gets A, B, C, D
      setQuestionsData((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          [key]: value,
        },
      }));
    } else {
      setQuestionsData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTextQuestionSubmit = async (e) => {
    e.preventDefault();
    setQuestionSubmitting(true);
    try {
      const Textquestions = {
        category: questionsData.category,
        quesiton: questionsData.question,
        options: {
          a: questionsData.options.a,
          b: questionsData.options.b,
          c: questionsData.options.c,
          d: questionsData.options.d,
        },
        answer: questionsData.answer,
        type: actions,
      };
      const response = await axios.post(`${url}/add-question`, Textquestions);
      console.log(response.data);
      toast.success("Question added");
      setQuestionsData({
        category: "",
        question: "",
        options: {
          a: "",
          b: "",
          c: "",
          d: "",
        },
        answer: "",
      });
      setQuestionSubmitting(false);
    } catch (error) {
      toast.error("Error while submitting text based question");
      console.log(error);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <section
      className="flex flex-col w-screen h-screen overflow-y-auto bg-cover xl:overflow-hidden lg:overflow-hidden md:overflow-hidden sm:overflow-y-auto lg:bg-center md:bg-center sm:bg-none xl:bg-center xl:bg-cover md:bg-cover sm:bg-cover "
      style={{ backgroundImage: `url(../../images/admin_bg.svg)` }}
    >
      <Toaster />
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
            <DropdownMenu aria-label="User Actions">
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

      {/* Content */}
      <div className="flex justify-between px-6 mt-6">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <Button
          className="px-4 py-2 text-lg font-medium text-white bg-blue-500 rounded-md hover:b g-blue-400"
          onPress={onOpen}
        >
          Add Questions
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center">
                <h2 className="text-2xl">Add Questions</h2>
              </ModalHeader>
              <ModalBody>
                <div>
                  {/* Selection of question type */}
                  <form>
                    <h2 className="font-medium">
                      In which format does question is
                    </h2>
                    <RadioGroup
                      defaultValue="text based"
                      orientation="horizontal"
                      className="mt-3"
                    >
                      <Radio
                        value="text based"
                        onChange={() => setActions("text based")}
                      >
                        Text Based
                      </Radio>
                      <Radio
                        value="image based"
                        onChange={() => setActions("image based")}
                      >
                        Image Based
                      </Radio>
                    </RadioGroup>
                  </form>
                  {actions === "text based" ? (
                    <div>
                      <TextBasedQuestion actions={actions} />
                    </div>
                  ) : (
                    <div>
                      <ImageBasedQuestions actions={actions} />
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="px-6 mt-3">
        <p>The table shows the number of students appeared for the exam</p>
      </div>

      <div className="px-6 mt-3">
        <Suspense fallback={<p>Loading...</p>}>
          <Table
            className="w-full"
            aria-label="Candidate examination data table"
            bottomContent={
              <div className="flex justify-center w-full">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            classNames={{
              wrapper: "min-h-[100px]",
            }}
          >
            <TableHeader>
              <TableColumn className="w-[10%] text-medium text-center">
                Sr. No.
              </TableColumn>
              <TableColumn className="w-[30%] text-medium text-center">
                Candidate Name
              </TableColumn>
              <TableColumn className="w-[12%] text-medium text-center">
                Exam Complition Date
              </TableColumn>
              <TableColumn className="w-[10%] text-medium text-center">
                Actions
              </TableColumn>
            </TableHeader>

            <TableBody items={items}>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {(page - 1) * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.full_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.exam_date === null ? (
                      <p>Not Completed</p>
                    ) : (
                      <p>{dateConverstion(item.exam_date)}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.exam === "Completed" ? (
                      <p
                        className="cursor-pointer hover:text-blue-500 hover:transition-all hover:underline hover:ease-in-out hover:duration-75"
                        onClick={() =>
                          handleAnalytics(
                            item.full_name,
                            item.email,
                            item.zone,
                            item.exam_report
                          )
                        }
                      >
                        Show Analytics
                      </p>
                    ) : (
                      <p>----</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Suspense>
      </div>
    </section>
  );
};

export default AdminDashboard;
