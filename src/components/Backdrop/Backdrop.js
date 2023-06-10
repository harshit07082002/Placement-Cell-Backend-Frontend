import React from "react";
import ReactDOM from "react-dom";
import classes from "./Backdrop.module.css";

const Backdrop = () => {
  return ReactDOM.createPortal(
    <div className={classes.backdrop}></div>,
    document.getElementById("backdrop")
  );
};

export default Backdrop;
