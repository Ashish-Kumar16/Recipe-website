import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { FilterBox } from "./RecipeGridStyles";

const FilterSection = ({
  dietFilter,
  setDietFilter,
  timeSort,
  setTimeSort,
  ratingSort,
  setRatingSort,
  setCurrentPage,
}) => (
  <FilterBox sx={{ mb: 4, display: "flex", gap: 2 }}>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel sx={{ color: "#3a5f3b" }}>Diet</InputLabel>
      <Select
        value={dietFilter}
        label="Diet"
        onChange={(e) => {
          setDietFilter(e.target.value);
          setCurrentPage(1);
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3a5f3b" },
        }}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="vegetarian">Vegetarian</MenuItem>
        <MenuItem value="non-vegetarian">Non-Veg</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel sx={{ color: "#3a5f3b" }}>Time</InputLabel>
      <Select
        value={timeSort}
        label="Time"
        onChange={(e) => {
          setTimeSort(e.target.value);
          setRatingSort("none");
          setCurrentPage(1);
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3a5f3b" },
        }}
      >
        <MenuItem value="none">Default</MenuItem>
        <MenuItem value="asc">Quick</MenuItem>
        <MenuItem value="desc">Slow</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel sx={{ color: "#3a5f3b" }}>Rating</InputLabel>
      <Select
        value={ratingSort}
        label="Rating"
        onChange={(e) => {
          setRatingSort(e.target.value);
          setTimeSort("none");
          setCurrentPage(1);
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3a5f3b" },
        }}
      >
        <MenuItem value="none">Default</MenuItem>
        <MenuItem value="desc">Top</MenuItem>
        <MenuItem value="asc">Low</MenuItem>
      </Select>
    </FormControl>
  </FilterBox>
);

export default FilterSection;