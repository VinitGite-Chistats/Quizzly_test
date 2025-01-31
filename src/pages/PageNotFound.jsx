import React from "react";
import bg_img from "../images/page_not_found.svg";

const PageNotFound = () => {
  return (
    <section className="w-screen h-screen overflow-hidden">
      <div className="flex items-center justify-center mt-10">
        <img src={bg_img} alt="image" className="w-[33%]" />
      </div>

      <div className="flex justify-center">
        <h3 className="mt-3 text-lg font-semibold">The Page your trying to access is not present..</h3>
      </div>
    </section>
  );
};

export default PageNotFound;
