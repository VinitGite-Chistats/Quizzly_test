import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const TextBasedQuestion = ({ actions }) => {
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];
  const url = import.meta.env.VITE_URL_ADMIN;

  // Validation Schema using Yup
  const ValidationSchema = Yup.object().shape({
    category: Yup.string()
      .required("Category is required")
      .not([""], "Please select a category"),
    question: Yup.string().required("Question is required"),
    options: Yup.object().shape({
      a: Yup.string().required("Option A is required"),
      b: Yup.string().required("Option B is required"),
      c: Yup.string().required("Option C is required"),
      d: Yup.string().required("Option D is required"),
    }),
    answer: Yup.string()
      .required("Correct answer is required")
      .not([""], "Please select correct answer"),
  });

  const initialValues = {
    category: "",
    question: "",
    options: {
      a: "",
      b: "",
      c: "",
      d: "",
    },
    answer: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    setQuestionSubmitting(true);
    try {
      const Textquestions = {
        ...values,
        type: actions,
      };

      const response = await axios.post(`${url}/add-question`, Textquestions);
      console.log(response.data);
      toast.success("Question added successfully");
      resetForm();
    } catch (error) {
      toast.error("Error while submitting question");
      console.log(error);
    } finally {
      setQuestionSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Toaster />
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="flex justify-start gap-x-10">
              <div className="mb-4">
                <label>Category</label>
                <Field
                  as="select"
                  name="category"
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                {errors.category && touched.category && (
                  <div className="text-sm text-red-500">{errors.category}</div>
                )}
              </div>

              <div className="mb-4 w-[80%]">
                <label>Enter Question</label>
                <Field
                  as="textarea"
                  name="question"
                  className="w-full p-2 border rounded"
                  rows={1}
                />
                {errors.question && touched.question && (
                  <div className="text-sm text-red-500">{errors.question}</div>
                )}
              </div>
            </div>

            <div>
              <label>Options</label>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {["a", "b", "c", "d"].map((key) => (
                <div key={key} className="mt-2">
                  <label>Option {key.toUpperCase()}</label>
                  <Field
                    type="text"
                    name={`options.${key}`}
                    className="w-full p-2 border rounded"
                  />
                  {errors.options?.[key] && touched.options?.[key] && (
                    <div className="text-sm text-red-500">
                      {errors.options[key]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label>Correct Answer</label>
              <Field
                as="select"
                name="answer"
                className="w-full p-2 border rounded"
              >
                <option value="">Select correct option</option>
                {["a", "b", "c", "d"].map((key) => (
                  <option key={key} value={key}>
                    Option {key.toUpperCase()}
                  </option>
                ))}
              </Field>
              {errors.answer && touched.answer && (
                <div className="text-sm text-red-500">{errors.answer}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={questionSubmitting}
              className="px-4 py-2 text-white bg-blue-500 rounded disabled:bg-blue-300"
            >
              {questionSubmitting ? "Adding Question..." : "Add Question"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TextBasedQuestion;
