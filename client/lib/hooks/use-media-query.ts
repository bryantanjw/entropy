import React from "react";

export function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const matchQueryList = window.matchMedia(query);
    function handleChange(e) {
      setMatches(e.matches);
    }
    matchQueryList.addEventListener("change", handleChange);
    return () => {
      matchQueryList.removeEventListener("change", handleChange);
    };
  }, [query]);
  return matches;
}
