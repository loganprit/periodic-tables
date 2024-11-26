import { ApplicationError } from "../types/error";

interface ErrorAlertProps {
  error: ApplicationError | null;
  className?: string;
}

/**
 * Displays an alert message for application errors
 * @param props - Component properties
 * @param props.error - Error object containing error details
 * @param props.className - Optional CSS class name for styling
 * @returns {JSX.Element | null} A Bootstrap danger alert containing the error message or null if no error
 */
function ErrorAlert({ error, className = "" }: ErrorAlertProps): JSX.Element | null {
  if (!error) return null;

  return (
    <div className={`alert alert-danger m-2 ${className}`.trim()}>
      Error: {error.message}
    </div>
  );
}

export default ErrorAlert;
