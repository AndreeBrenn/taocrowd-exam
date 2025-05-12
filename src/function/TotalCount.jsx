import axios from "axios";
import React, { useEffect, useState } from "react";

export const TotalCount = () => {
  const [totalCount, setTotalCount] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getLaunches = async () => {
      try {
        const res = await axios.get(`https://api.spacexdata.com/v3/launches`, {
          signal: controller.signal,
        });

        setTotalCount(res.data);
      } catch (error) {
        console.log(error);
        alert("Something went wrong");
      }
    };

    getLaunches();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return totalCount.length;
};
