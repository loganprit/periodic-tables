import { useLocation } from "react-router-dom";
import { useMemo } from "react";

/**
 * Custom hook to parse URL query parameters.
 * Returns a memoized URLSearchParams instance to prevent unnecessary re-renders.
 * 
 * @example
 * const query = useQuery();
 * const date = query.get("date");
 * 
 * @returns {URLSearchParams} The memoized URLSearchParams instance
 * @throws {Error} If the URL search string is malformed
 */
function useQuery(): URLSearchParams {
  const { search } = useLocation();
  
  return useMemo(() => {
    try {
      return new URLSearchParams(search);
    } catch (error) {
      console.error("Failed to parse URL search params:", error);
      return new URLSearchParams();
    }
  }, [search]);
}

export default useQuery;
