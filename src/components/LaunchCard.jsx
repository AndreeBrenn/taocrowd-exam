import React from "react";
import TimeAgo from "timeago-react";

const LaunchCard = ({ item, setToggleView, toggleView }) => {
  return (
    <div className="max-w-[30rem] flex flex-col min-w-[30rem] shadow-sm shadow-gray-400 p-2 my-3 rounded-md">
      <div className="flex">
        <span className="font-bold text-[1.3rem]">{item.mission_name}</span>
        <span
          className={`ml-3 px-1 text-[0.8rem] text-center font-semibold ${
            item.upcoming == true
              ? "bg-cyan-500 text-gray-600"
              : item.launch_success == true
              ? "bg-green-500 text-gray-700"
              : "bg-red-600 text-white"
          }
          `}
        >
          {item.upcoming == true
            ? "upcoming"
            : item.launch_success == true
            ? "success"
            : "failed"}
        </span>
      </div>

      <div className="flex flex-col">
        {toggleView[item.flight_number] && (
          <>
            <div className="flex">
              <TimeAgo
                className="text-gray-400 text-[0.8rem]"
                datetime={item.launch_date_local}
              />{" "}
              {item.links?.article_link && (
                <>
                  <p className="mx-2">|</p>{" "}
                  <a className="text-blue-700" href={item.links?.article_link}>
                    Article
                  </a>
                </>
              )}
              {item.links?.video_link && (
                <>
                  <p className="mx-2">|</p>{" "}
                  <a className="text-blue-700" href={item.links?.video_link}>
                    Video
                  </a>
                </>
              )}
            </div>
            <p className="flex items-center">
              {item.links?.mission_patch_small && (
                <img
                  className="object-cover w-[10rem] h-[10rem] mx-1"
                  src={item.links?.mission_patch_small}
                  onError={(e) => {
                    e.currentTarget.src = "/vite.svg";
                  }}
                />
              )}
              {item.details ?? "No details yet"}
            </p>
          </>
        )}
      </div>

      <button
        onClick={() => {
          setToggleView((prev) => ({
            ...prev,
            [item.flight_number]: !prev[item.flight_number],
          }));
        }}
        className="bg-blue-700 text-white w-[5rem] rounded-md mt-3 p-2"
      >
        {toggleView[item.flight_number] ? "HIDE" : "VIEW"}
      </button>
    </div>
  );
};

export default LaunchCard;
