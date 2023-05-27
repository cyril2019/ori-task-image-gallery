import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

// The upper part of the homepage, containing the search bar.
const Header = (props) => {
  // query is the search term, setQuery is the function to set the search term.
  const { query, setQuery } = props;
  // options is the list of previous search terms, setOptions is the function to set the list of search terms.
  const [options, setOptions] = React.useState([]);

  useEffect(() => {
    // Assign the search terms from localStorage to options.
    setOptions(JSON.parse(localStorage.getItem("searchTerms")) || []);
  }, []);

  // Debounce function to prevent too many API calls.
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Debounce the handleSearch function.
  const handleSearch = debounce((e, v) => {
    handleSubmit(v);
  }, 500);

  // Handle the submit of the search bar.
  const handleSubmit = (str) => {
    let history = JSON.parse(localStorage.getItem("searchTerms"));
    if (history === null) history = ["clear_data_in_history"];
    history = [...new Set([str, ...history])];
    setOptions(history);
    localStorage.setItem("searchTerms", JSON.stringify(history));
    setQuery(str);
    console.log(query);
  };

  return (
    <Stack
      alignItems="center"
      gap={3}
      style={{
        backgroundColor: "black",
        paddingBlock: "50px",
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      <Typography align="center" fontWeight={900} fontSize={35} color={"white"}>
        Search Photos
      </Typography>

      {/* The search bar. */}
      <Paper
        style={{
          width: "40%",
          backgroundColor: "White",
          padding: "5px",
          paddingRight: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Autocomplete
          freeSolo
          options={options}
          style={{ flexGrow: 1 }}
          onInputChange={handleSearch}
          renderInput={(params) => (
            <FormControl style={{ width: "100%" }}>
              <TextField {...params} placeholder="Search" />
            </FormControl>
          )}
          renderOption={(props, option) => {
            if (option === "clear_data_in_history")
              return (
                <Box
                  key={option}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    type="reset"
                    color="error"
                    sx={{ marginRight: "10px" }}
                    onClick={() => {
                      localStorage.removeItem("searchTerms");
                      setOptions([]);
                    }}
                  >
                    Clear History
                  </Button>
                </Box>
              );
            else
              return (
                <li {...props} key={option}>
                  {option}
                </li>
              );
          }}
        />
        <SearchIcon
          style={{ color: "#d74d4d", cursor: "pointer", marginLeft: "10px" }}
          onClick={handleSubmit}
        />
      </Paper>
    </Stack>
  );
};

export default Header;
