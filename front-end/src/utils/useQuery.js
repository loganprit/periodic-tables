import { useLocation } from "react-router-dom";

/**
 * Custom hook to parse URL query parameters.
 * @example
 * const query = useQuery();
 * const date = query.get("date");
 * @returns {URLSearchParams} The URLSearchParams instance.
 */
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useQuery;
