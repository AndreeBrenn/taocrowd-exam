import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import LaunchCard from "../components/LaunchCard";
import { TotalCount } from "../function/TotalCount";
import { AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [launches, setLaunches] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [toggleView, setToggleView] = useState({});
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const count = TotalCount();

  const loadMore = () => {
    if (!hasMore || loading) return;

    if (launches.length == count) {
      setHasMore(false);
    } else {
      setLimit((prev) => prev + 10);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && !loading && searchData == "") {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const timer = setTimeout(() => {
      if (loaderRef.current) {
        observer.observe(loaderRef.current);

        const rect = loaderRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible && !loading) {
          loadMore();
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, count, loadMore]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    setLoading(true);
    const getLaunches = async () => {
      try {
        const res = await axios.get(
          searchData != ""
            ? "https://api.spacexdata.com/v3/launches"
            : `https://api.spacexdata.com/v3/launches?limit=${limit}`,
          {
            signal: controller.signal,
          }
        );

        setLaunches(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getLaunches();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [limit]);

  return (
    <div className="w-full relative  justify-center items-center flex flex-col p-3">
      <input
        onChange={(e) => setSearchData(e.target.value)}
        className="max-w-[60rem] min-w-[30rem] border border-gray-500 p-2 sticky top-0"
        placeholder="search..."
      />
      <AnimatePresence>
        {launches
          .filter((fil) =>
            fil.mission_name
              .toString()
              .toLowerCase()
              .includes(searchData.toString().toLowerCase())
          )
          .map((item) => (
            <LaunchCard
              item={item}
              setToggleView={setToggleView}
              toggleView={toggleView}
            />
          ))}
      </AnimatePresence>

      <div ref={loaderRef} className="py-4 text-center">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : hasMore ? (
          <p className="text-gray-500">Scroll down for more</p>
        ) : (
          <p className="text-gray-500">End Result</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
