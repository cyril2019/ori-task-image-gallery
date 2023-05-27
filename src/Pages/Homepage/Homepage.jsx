import React from "react";
import Header from "./Components/Header";
import ImageGrid from "./Components/ImageGrid";

const Homepage = () => {
  const [query, setQuery] = React.useState("");
  return (
    <>
      <Header query={query} setQuery={setQuery} />
      <ImageGrid query={query} />
    </>
  );
};

export default Homepage;
