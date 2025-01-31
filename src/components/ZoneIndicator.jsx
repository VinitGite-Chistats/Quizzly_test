import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";

const ZoneIndicator = ({ data }) => {
  const [value, setValue] = useState(0.0);

  useEffect(() => {
    if (data === "green zone") {
      setValue(0.83);
    } else if (data === "yellow zone") {
      setValue(0.5);
    } else if (data === "red zone") {
      setValue(0.16);
    }
  }, [data]);
  return (
    <div>
      <div className="w-[90%]">
        <GaugeChart
          id="gauge-chart3"
          nrOfLevels={3}
          colors={["#FF0000", "#FFA500", "#4CAF50"]} // Red, Yellow, Green
          arcWidth={0.3}
          percent={value} // Dynamically set the percent value
          textColor={"black"}
          hideText={true}
          cornerRadius={0}
          animDelay={50}
          animate={true}
        />
      </div>

      {/* Score text */}
      <div className="mb-6 text-center">
        <h4 className={`${data === 'red zone' && 'text-red-600'} ${data === 'green zone' && 'text-green-600'} ${data === 'yellow zone' && 'text-yellow-500'} font-extrabold text-medium`}>{data.toUpperCase()}</h4>
      </div>
    </div>
  );
};

export default ZoneIndicator;
