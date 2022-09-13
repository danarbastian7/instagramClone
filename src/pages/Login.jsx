import {
  Box,
  Text,
  Container,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { useState } from "react"
import { login } from "../redux/features/authSlice"
import { useDispatch } from "react-redux"

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const toast = useToast()
  const dispatch = useDispatch()

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axiosInstance.get("/users", {
          params: {
            username: values.username,
            password: values.password,
          },
        })
        // toast({ title: "Login Success", status: "success" })
        if (!response.data.length) {
          toast({ title: "Credentials doesn't macth", status: "error" })
          return
        }
        // dispatch(login(...response.data))
        localStorage.setItem("auth_data", response.data[0].id)
        dispatch(login(response.data[0]))
      } catch (err) {
        console.log(err)
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      password: Yup.string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }
  const tooglePassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <Box>
      <Container>
        <Box
          w={["full", "md"]}
          p={[9, 10]}
          marginLeft={"75px"}
          marginTop={"20px"}
          border={"2px"}
          borderColor={"whatsapp.400"}
          borderStyle={"solid"}
          borderRadius={[10]}
        >
          <Text fontFamily={"serif"} fontWeight={"bold"} fontSize="4xl" mb="8">
            Login User
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formik.values.username}
                  name="username"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    value={formik.values.password}
                    onChange={formChangeHandler}
                    name="password"
                    placeholder="Input your password"
                    size={"lg"}
                    type={showPassword ? "text" : "password"}
                  />

                  <InputRightElement width={"4.5rem"}>
                    <Button
                      h={"1.5rem"}
                      size="sm"
                      mt={"-0.05px"}
                      onClick={tooglePassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme={"whatsapp"}>
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage
