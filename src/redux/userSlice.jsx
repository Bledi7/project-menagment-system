import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  _id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "",
  __v: "",
  accessToken: null,
  refreshToken: null,
  expiresTime: null,
  status: "pending",
  phoneNumber: "",
  address: "",
  birthday: "",
  gender: "",
  instagram: "",
  twitter: "",
  gitHub: "",
  facebook: "",
  profileImage: ""
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const userToUpdate = state.find(user => user._id === userId);
      if (userToUpdate) {
        userToUpdate.status = status;
      }
    },

    clearUser: () => {
      return initialUserState;
    },

    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setExpiresTime: (state, action) => {
      state.expiresTime = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setAccessToken,
  setRefreshToken,
  setExpiresTime,
  updateUserStatus,
} = userSlice.actions;

export default userSlice.reducer;
