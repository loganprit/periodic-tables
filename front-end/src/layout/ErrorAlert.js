import React from "react";

/**
 * Displays an alert message if the specified error is truthy.
 * @param {Object} props - Component properties.
 * @param {Object} props.error - An object with a `.message` property, typically an Error instance.
 * @returns {JSX.Element} A Bootstrap danger alert containing the error message.
 */
function ErrorAlert({ error }) {
  return (
    error && (
      <div className="alert alert-danger m-2">Error: {error.message}</div>
    )
  );
}

export default ErrorAlert;
