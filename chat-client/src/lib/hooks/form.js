import { useState } from "react";

// custom hook for input elements
export const useInput = (name, defaultValue, validate, regex) => {
  // set up the state for the input item and error
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(null);

  // handle the onChange event
  const handleChange = (e) => {
    // set the state no matter what
    setValue(e.target.value);
    setError(null);
  }

  // handle onBlur event
  const handleBlur = () => {
    handleValidate();
  }

  // call validate if supplied and set error appropriately
  const handleValidate = () => {
    const valid = validate && validate(value, regex)
    setError(!valid);
    return valid;
  }

  return {
    props: {
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      error
    },
    validate: handleValidate
  };
};

export const useSubmit = (inputs, success) => {
  // set up the state for the inputs causing errors
  const [errorItems, setErrorItems] = useState(null);
 
  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault(); //prevent page refresh
    //validate every input (in case there was no blur event)
    const errorItems = inputs.filter(input => !input.validate());
    //persist the error items to state
    setErrorItems(errorItems);
    // if no errors, call success with name, value pairs as parameter
    if (errorItems && errorItems.length === 0) {
      success &&
        success(
          inputs.map(({ props: { name, value } }) => ({
            name,
            value
          }))
        );
    } 
  }
 
  return {
    props: {
      onSubmit: handleSubmit
    },
    errorItems
  };
 }