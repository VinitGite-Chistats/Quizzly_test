import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

const ImageBasedQuestions = ({ actions }) => {
  const [img, setImg] = useState();
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];
  const url = import.meta.env.VITE_URL_ADMIN;

  // Validation Schema using Yup
  const ValidationSchema = Yup.object().shape({
    category: Yup.string()
      .required("Category is required")
      .not([""], "Please select a category"),
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
    options: {
      a: "",
      b: "",
      c: "",
      d: "",
    },
    answer: "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (!img) {
      toast.error("Please select an image");
      return;
    }

    setQuestionSubmitting(true);
    try {
      const updated_img = img.replace('data:image/png;base64,', '')
      const Textquestions = {
        category: values.category,
        question: updated_img,
        options: values.options,
        answer: values.answer,
        type: actions,
      };

      const response = await axios.post(`${url}/add-question`, Textquestions);
      console.log(response.data);
      toast.success("Question added successfully");
      resetForm();
      setImg(null);
    } catch (error) {
      toast.error("Error while submitting question");
      console.log(error);
    } finally {
      setQuestionSubmitting(false);
    }
  };

  const imgTobase64 = (e) => {
    if (e.target.files[0]) {
      const data = new FileReader();
      data.addEventListener("load", () => {
        setImg(data.result);
      });
      data.readAsDataURL(e.target.files[0]);
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

              <div className="mb-4 w-[80%] flex-col flex">
                <label>Select Image for question</label>
                <input
                  type="file"
                  className="w-full mt-1 border rounded"
                  accept=".jpg,.jpeg,.png"
                  onChange={imgTobase64}
                />
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

export default ImageBasedQuestions;
