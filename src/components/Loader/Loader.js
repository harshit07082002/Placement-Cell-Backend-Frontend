import React from "react";
import loader from "../../image/loading.png";
import classes from "./Loader.module.css";
import ReactDOM from "react-dom";

const Loader = () => {
  return ReactDOM.createPortal(
    <img src={loader} alt="Loading.." id={classes.loading} />,
    document.getElementById("loading")
  );
};

export default Loader;
