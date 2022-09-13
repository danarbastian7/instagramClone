import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: 0,
  username: "",
  email: "",
  role: "",
  profile_picture: "",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.email = action.payload.email
      state.role = action.payload.role
      state.profile_picture = action.payload.profile_picture
    },
    logout: (state) => {
      state.id = 0
      state.username = ""
      state.role = ""
      state.email = ""
      state.profile_picture = ""
      //   return initialState
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
