import {
  Box,
  Text,
  Button,
  Tabs,
  TabList,
  Tab,
  HStack,
  Flex,
  Spacer,
  IconButton,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Routes, Route, Link } from "react-router-dom"
import HomePage from "./pages/Home"
import { login } from "./redux/features/authSlice"
import { logout } from "./redux/features/authSlice"
import { axiosInstance } from "./api"
import Dashboard1 from "./pages/admin/Dashboard1"
import Dashboard2 from "./pages/admin/Dashboard2"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import ProfilePage from "./pages/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import GuestRoute from "./components/GuestRoute"
import NotFoundPage from "./pages/404"
import MyProfile from "./pages/MyProfile"
import { MoonIcon } from "@chakra-ui/icons"

const App = () => {
  const [authCheck, setAuthCheck] = useState(false)
  const dispatch = useDispatch()

  const authSelector = useSelector((state) => state.auth)
  const keepUserLoggedIn = async () => {
    try {
      const auth_id = localStorage.getItem("auth_data")

      if (!auth_id) {
        setAuthCheck(true)
        return
      }

      const response = await axiosInstance.get(`/users/${auth_id}`)

      dispatch(login(response.data))
      setAuthCheck(true)
    } catch (err) {
      console.log(err)
      setAuthCheck(true)
    }
  }
  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_data")
    dispatch(logout())
  }

  const renderAdminRoutes = () => {
    if (authSelector.role === "admin") {
      return (
        <>
          <Route path="admin/dashboard1" element={<Dashboard1 />} />
          <Route path="admin/dashboard2" element={<Dashboard2 />} />
        </>
      )
    }
    return null
  }
  useEffect(() => {
    keepUserLoggedIn()
  }, [])
  if (!authCheck) {
    return <div>Loading...</div>
    // setAuthCheck(true)
  }

  return (
    <Box backgroundColor={"gray.100"}>
      <HStack>
        <Text
          // border={"AppWorkspace"}
          color={"green.400"}
          fontFamily={"sans-serif"}
          fontSize="4xl"
          fontWeight={"bold"}
        >
          Welcome to this Universe, {authSelector.username}
        </Text>
        <Spacer />
        <Button mt={"7px"} colorScheme={"red"} onClick={logoutBtnHandler}>
          Logout
        </Button>
      </HStack>
      <Tabs
        backgroundColor={"whatsapp.400"}
        fontWeight={"extrabold"}
        color={"whitesmoke"}
        size="md"
        display={"run-in"}
        shadow={"lg"}
      >
        <TabList mb="1em">
          <Tab>
            <Link to="/"> Home</Link>
          </Tab>
          <Tab>
            <Link to="/register">Register </Link>
          </Tab>
          <Tab>
            <Link to="/login">Login </Link>
          </Tab>
          <Tab>
            <Link to="/me">Profile </Link>
          </Tab>
        </TabList>
      </Tabs>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        {renderAdminRoutes()}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Box>
  )
}

export default App
