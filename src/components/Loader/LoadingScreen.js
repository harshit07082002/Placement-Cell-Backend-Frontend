import React from "react";
import Loader from "./Loader";
import Backdrop from "../Backdrop/Backdrop";

const LoadingScreen = () => {
  return (
    <div>
      <Backdrop />
      <Loader />
    </div>
  );
};

export default LoadingScreen;
