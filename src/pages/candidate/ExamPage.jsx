import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import logo from "../../images/logo.svg";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import chistats_logo from "../../images/chistats_logo.svg";
import { Toaster, toast } from "react-stacked-toast";

const ExamPage = () => {
  const getUser = localStorage.getItem("login_user");
  const [questions, setQuestions] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestionNumber, setTotalQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [submitQuiz, setSubmitQuiz] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate("/");
  const toastTimerRef = useRef();
  const exitAttemptRef = useRef(0);
  const [count, setCount] = useState(0);
  const [tabChangeCount, setTabChangeCount] = useState(0);
  const URL = import.meta.env.VITE_URL_EXAM;

  const getReport = async () => {
    // Ensure all questions are stored, even if unanswered
    const accessToken = localStorage.getItem("token");
    const allAnswers = { ...selectedAnswer };
    questions.forEach((category, catIndex) => {
      category.questions.forEach((question, qIndex) => {
        const categoryName = category.name;
        if (!allAnswers[categoryName]) {
          allAnswers[categoryName] = {};
        }
        if (!allAnswers[categoryName][`question${qIndex}`]) {
          allAnswers[categoryName][`question${qIndex}`] = {
            questionIndex: qIndex,
            selectedOption: "null", // Indicate unanswered
            question: question.question,
            answer: "null",
            type: question.type,
          };
        }
      });
    });

    try {
      const response = await axios.post(
        `${URL}/submit`,
        {
          username: getUser,
          category_info: allAnswers,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response) {
        toast.error("Something went wrong");
      }
      let compDate = sessionStorage.getItem("comp_date");
      if (!compDate || compDate === "------") {
        const currentDate = new Date();
        compDate = `${String(currentDate.getDate()).padStart(2, "0")}/${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}/${currentDate.getFullYear()}`;
        sessionStorage.setItem("comp_date", compDate);
      }
      const isFullscreenSupported = document.fullscreenEnabled !== undefined;
      setTimeout(() => {
        setTimeout(() => {
          navigate("/report", { state: { data: response.data.zone } });
          if (isFullscreenSupported && document.fullscreenElement) {
            document.exitFullscreen();
          }
        }, 3000);
        toast.success("Quiz submitted successfully...");
        // localStorage.setItem("quiz_submitted", true);
        console.log(allAnswers);
        setSubmitQuiz(true);
      }, 500);

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLogout = () => {
    getReport();
  };

  // We try to get the questions through API
  const getQuestions = async () => {
    try {
      const response = await axios.get(`${URL}/quiz`);
      setQuestions(response.data.categories);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    // setFullScreen(true);
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      if (!showAlert) {
        setCount((count) => count + 1);
        if (count < 1) {
          setShowAlert(true);
        } else {
          getReport();
        }
      }
    }
  };

  const closePopupAndStayFullscreen = () => {
    setShowAlert(false);
    if (count === 2) {
      setShowAlert(false);
    }
  };

  useEffect(() => {
    enterFullscreen();
    getQuestions();
  }, []);

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
          getReport();
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

  useEffect(() => {
    enterFullscreen();

    const handleKeyPress = (event) => {
      if (
        event ||
        (event.ctrlKey && event.key === "r") ||
        (event.ctrlKey && event.key === "c") ||
        (event.ctrlKey && event.key === "x")
      ) {
        event.preventDefault();
        if (!showToast) {
          toast.error("Don't press any keys from keyboard", {
            duration: 1000,
          });
          setShowToast(true);
        }
      }
    };

    const handleRightClick = (event) => {
      event.preventDefault(); // Prevent context menu
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowAlert(true);
        setTabChangeCount((prevCount) => {
          const newCount = prevCount + 1;
          if (newCount > 1) {
            setShowAlert(false);
            getReport();
          }
          return newCount;
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("contextmenu", handleRightClick); // Block right-click
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      // Clean up the timer functions
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [showAlert]);

  // const enterFullscreen = () => {
  // }
  const getTotalQuestionCount = (upToCategory) => {
    let count = 0;
    for (let i = 0; i < upToCategory; i++) {
      count += questions[i].questions.length;
    }
    return count;
  };

  const handleNext = () => {
    const currentCategory = questions[currentCategoryIndex];
    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      // If there are more questions in current category, go to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTotalQuestionNumber(totalQuestionNumber + 1);
    } else if (currentCategoryIndex < questions.length - 1) {
      // If we're at last question of category, go to next category
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentQuestionIndex(0);
      setTotalQuestionNumber(totalQuestionNumber + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // If not at first question of category, go to previous question
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTotalQuestionNumber(totalQuestionNumber - 1);
    } else if (currentCategoryIndex > 0) {
      // If at first question of category, go to previous category's last question
      setCurrentCategoryIndex(currentCategoryIndex - 1);
      setCurrentQuestionIndex(
        questions[currentCategoryIndex - 1].questions.length - 1
      );
      setTotalQuestionNumber(totalQuestionNumber - 1);
    }
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentCategory = questions[currentCategoryIndex];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];

  const isLastQuestion = () => {
    return (
      currentCategoryIndex === questions.length - 1 &&
      currentQuestionIndex ===
        questions[currentCategoryIndex].questions.length - 1
    );
  };

  const handleOptionSelect = (optionKey) => {
    const categoryName = currentCategory.name;

    setSelectedAnswer({
      ...selectedAnswer,
      [categoryName]: {
        ...selectedAnswer[categoryName],
        [`question${currentQuestionIndex}`]: {
          questionIndex: currentQuestionIndex,
          selectedOption: optionKey,
          question: currentQuestion.question,
          answer: optionKey,
          type: currentQuestion.type,
        },
      },
    });

    setAnsweredQuestions({
      ...answeredQuestions,
      [`${currentCategoryIndex}-${currentQuestionIndex}`]: true,
    });
  };

  const handleQuestionSelect = (categoryIndex, questionIndex) => {
    setCurrentCategoryIndex(categoryIndex);
    setCurrentQuestionIndex(questionIndex);
    setTotalQuestionNumber(
      getTotalQuestionCount(categoryIndex) + questionIndex + 1
    );
  };

  // Add this function to calculate total questions across all categories
  const getTotalQuestions = () => {
    return questions.reduce((total, category) => {
      return total + category.questions.length;
    }, 0);
  };

  return (
    <section className="w-screen h-screen bg-[#E0EFFF] overflow-y-auto">
      <Toaster limit={3} position="center" />
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
                  <span>End Exam</span>
                </p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <img src={chistats_logo} alt="" className="w-[64%]" />
        </div>
      </nav>

      {/* Main Body */}
      <div className="flex ">
        {/* Left Side */}
        <div className="h-[91vh] bg-gray-50 w-[19vw] flex flex-col">
          {/* Pagination */}
          <div className="flex flex-col w-full gap-4 p-4 mt-6  py-[1.8%] ">
            {questions.map((category, catIndex) => (
              <div key={`category-${catIndex}`} className="">
                <h3 className="mb-2 font-semibold">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.questions.map((_, qIndex) => {
                    const questionNumber =
                      getTotalQuestionCount(catIndex) + qIndex + 1;
                    const isActive =
                      catIndex === currentCategoryIndex &&
                      qIndex === currentQuestionIndex;
                    const isAnswered =
                      answeredQuestions[`${catIndex}-${qIndex}`];

                    return (
                      <button
                        key={`question-${catIndex}-${qIndex}`}
                        onClick={() => handleQuestionSelect(catIndex, qIndex)}
                        className={`w-8 h-8 rounded-full ${
                          isActive
                            ? "bg-blue-400 text-white"
                            : isAnswered
                            ? "bg-green-500 text-white" // Answered questions will be green
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Divider className="my-6" />
          {/* Navigation Buttons */}
          <div className="flex flex-col items-center justify-center w-full gap-4 px-6 mt-6">
            <button
              onClick={handlePrevious}
              disabled={
                currentCategoryIndex === 0 && currentQuestionIndex === 0
              }
              className={`bg-[#CAB123] px-8 py-1.5 font-medium text-white rounded-md w-fit ${
                currentCategoryIndex === 0 && currentQuestionIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Previous
            </button>
            {isLastQuestion() ? (
              <button
                onClick={getReport}
                className="bg-[#3B9F3B] px-10 py-1.5 font-medium text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed w-fit"
                disabled={submitQuiz}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#3B9F3B] px-12 py-1.5 font-medium text-white rounded-md w-fit"
              >
                Next
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col w-full">
          {/* Question and Timer */}
          <div className="flex justify-between w-full px-3 pt-4">
            <p className="bg-dark-blue text-white px-3 py-2.5 w-fit rounded-md font-medium">
              Questions{" "}
              <span className="font-extrabold">
                {totalQuestionNumber} / {getTotalQuestions()}
              </span>
            </p>

            <p className="bg-dark-blue text-white px-3 py-2.5 w-fit rounded-md font-medium">
              Time Remaining -{" "}
              <span className="font-extrabold">
                {minutes < 10 ? ` 0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </p>
          </div>
          {/* Main Content */}
          <div className="flex items-center justify-center mx-auto overflow-y-auto">
            {currentQuestion.type === "text based" ? (
              <div className="flex flex-col p-6 mx-auto mt-[16%] overflow-y-auto bg-white rounded-md shadow-md h-fit w-fit">
                <p className="text-lg font-semibold">
                  Q.{totalQuestionNumber} {currentQuestion.question}
                </p>
                {/* For text based questions */}
                <ol className="flex flex-col mt-3 list-inside gap-y-5">
                  {Object.entries(currentQuestion.options).map(
                    ([key, value]) => {
                      const categoryName = currentCategory.name;
                      const isSelected =
                        selectedAnswer[categoryName]?.[
                          `question${currentQuestionIndex}`
                        ]?.selectedOption === key;

                      return (
                        <li
                          key={`option-${key}`}
                          onClick={() => handleOptionSelect(key)}
                          className={`px-2 py-1 border-[0.6px] border-black rounded-md text-base cursor-pointer 
                                      ${
                                        isSelected
                                          ? "bg-green-600 text-white font-semibold"
                                          : "hover:bg-gray-100"
                                      }
                                      transition-colors duration-200`}
                        >
                          {key}. {value}
                        </li>
                      );
                    }
                  )}
                </ol>
              </div>
            ) : (
              <div className="flex flex-col p-6 mx-6 mt-3 overflow-y-auto bg-white rounded-md shadow-md h-fit">
                <p className="text-lg font-semibold text-left">
                  {" "}
                  Q.{totalQuestionNumber}
                </p>
                <div className="w-full h-auto overflow-y-auto bg-gray-200 max-h-[40vh] ">
                  <img
                    src={`data:image/png;base64,${currentQuestion.question}`}
                    alt="Question"
                    className="object-contain w-full h-auto"
                  />
                </div>
                {/* For image based questions - same change */}
                <ol className="flex flex-col mt-3 list-inside gap-y-5">
                  {Object.entries(currentQuestion.options).map(
                    ([key, value]) => {
                      const categoryName = currentCategory.name;
                      const isSelected =
                        selectedAnswer[categoryName]?.[
                          `question${currentQuestionIndex}`
                        ]?.selectedOption === key;

                      return (
                        <li
                          key={`option-${key}`}
                          onClick={() => handleOptionSelect(key)}
                          className={`px-2 py-1 border-[0.6px] border-black rounded-md text-base cursor-pointer 
                                      ${
                                        isSelected
                                          ? "bg-green-600 text-white font-semibold"
                                          : "hover:bg-gray-100"
                                      }
                                      transition-colors duration-200`}
                        >
                          {key}. {value}
                        </li>
                      );
                    }
                  )}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {
        showAlert && (
          // Alert Modal
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                  adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                  deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Ok
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
        )
      } */}

      {showAlert && (
        // <div
        //   style={{
        //     position: "fixed",
        //     top: 0,
        //     left: 0,
        //     width: "100%",
        //     height: "100%",
        //     backgroundColor: "rgba(0, 0, 0, 0.5)",
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        // >
        //   <div
        //     style={{
        //       backgroundColor: "#fff",
        //       padding: "20px",
        //       borderRadius: "8px",
        //       textAlign: "center",
        //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        //     }}
        //   >
        //     <h2>You pressed esc</h2>
        //     <h2>Esc from full screen = {count}</h2>
        //     <h2>Tab Changed = {tabChangeCount}</h2>
        //     <button
        //       onClick={closePopupAndStayFullscreen}
        //       style={{
        //         margin: "10px",
        //         padding: "10px 20px",
        //         fontSize: "16px",
        //         cursor: "pointer",
        //       }}
        //     >
        //       OK
        //     </button>
        //   </div>
        // </div>
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="w-full max-w-sm p-6 text-center bg-white rounded-lg shadow-lg">
        //     <h2 className="mb-4 text-xl font-semibold text-gray-800">Alert</h2>
        //     <p className="mb-6 text-gray-600">Esc from full screen = {count}</p>
        //     <p className="mb-6 text-gray-600">Tab Changed = {tabChangeCount}</p>
        //     <button
        //       onClick={closePopupAndStayFullscreen}
        //       className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
        //     >
        //       OK
        //     </button>
        //   </div>
        // </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.29 3.86L1.82 18a1 1 0 00.86 1.5h18.64a1 1 0 00.86-1.5l-8.47-14.14a1 1 0 00-1.72 0zM12 9v4m0 4h.01"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="mb-2 text-xl font-bold text-yellow-600">Warning</h2>

            {/* Content */}
            <p className="mb-4 text-gray-700">
              Suspicious activity detected. This may disrupt certain features or
              functionalities.
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Esc from full screen:</strong> {count}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Tab changes detected:</strong> {tabChangeCount}
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Please make sure to stay on the current tab for uninterrupted
              usage. Press "OK" to continue.
            </p>

            {/* Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={closePopupAndStayFullscreen}
                className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {
        tabChangeCount > 0 && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>You pressed esc</h2>
              <h2>Tab Change = {tabChangeCount}</h2>
              <button
                onClick={closePopupAndStayFullscreen}
                style={{
                  margin: "10px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )
      } */}
    </section>
  );
};

export default ExamPage;
