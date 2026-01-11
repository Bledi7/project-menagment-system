import { createSlice } from "@reduxjs/toolkit";

const initialTeamState = [];

const teamSlice = createSlice({
  name: "team",
  initialState: initialTeamState,
  reducers: {
    updateTeams: (state, action) => {
      return [...action.payload];
    },
    setTeam: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateTeams, setTeam } = teamSlice.actions;
export default teamSlice.reducer;
