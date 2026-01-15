import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    addProjects: (state, action) => {
      return [...state, ...action.payload];
    },
    changeProjects: (state, action) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});

export const { setProjects, changeProjects, addProjects } =
  projectSlice.actions;
export default projectSlice.reducer;

export const selectProjects = (state) => state.projects;
