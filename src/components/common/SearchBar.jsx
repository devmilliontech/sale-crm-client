import React from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ query, setQuery, handleClick }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };
  return (

    <TextField
      onKeyDown={handleKeyDown}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={ "Search..."}
      variant="outlined"
      size="small"
      sx={{
        width: "475px",
        borderRadius: "50px",
        backgroundColor: "#fff",

        "& .MuiOutlinedInput-root": {
          borderRadius: "50px",
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon onClick={handleClick} color="action" sx={{ cursor: "pointer" }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;
