import React, { useState } from "react";

const useInput = (checkValidity) => {
  const [InputValue, InputValueHandler] = useState("");
  const [showError, showErrorHandler] = useState(false);
  const [isValid, isValidHandler] = useState(false);
  const onChangeValue = (e) => {
    InputValueHandler(e.target.value);
    if (checkValidity(e.target.value)) { 
      showErrorHandler(false);
      isValidHandler(true);
    } else {
      isValidHandler(false);
    }
  };
  const onBlur = () => {
    const val = checkValidity(InputValue);
    isValidHandler(val);
    showErrorHandler(!val);
  };
  const onSubmit = () => {
    if (!isValid) {
      showErrorHandler(true);
    }
  };
  const reset = () => {
    isValidHandler(false);
    showErrorHandler(false);
    InputValueHandler("");
  };
  return {
    InputValue,
    showError,
    onBlur,
    onChangeValue,
    isValid,
    onSubmit,
    reset,
  };
};
export default useInput;
