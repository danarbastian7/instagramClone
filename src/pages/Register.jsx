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

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        //1. Email unique
        //2. Username unique
        const emailResponse = await axiosInstance.get("/users", {
          params: {
            email: values.email,
          },
        })

        if (emailResponse.data.length) {
          toast({ title: "Email has already been used", status: "error" })
          return
        }
        const usernameResponse = await axiosInstance.get("/users", {
          params: {
            username: values.username,
          },
        })
        if (usernameResponse.data.length) {
          toast({ title: "Username has already been used", status: "error" })
          return
        }

        let newUser = {
          username: values.username,
          email: values.email,
          password: values.password,
          role: "user",
          profile_picture: "",
        }
        await axiosInstance.post("/users", newUser)
        toast({
          title: "Registration successfull",
          status: "success",
        })
      } catch (err) {
        console.log(err)
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      email: Yup.string().email().required(),
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
          border={"3px"}
          borderColor={"green.300"}
          borderStyle={"solid"}
          borderRadius={[10]}
        >
          <Text fontFamily={"serif"} fontWeight={"bold"} fontSize="4xl" mb="8">
            Register User
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formik.values.username}
                  name="username"
                  onChange={formChangeHandler}
                  _placeholder={"Input your name"}
                />
                <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formik.values.email}
                  name="email"
                  type={"email"}
                  onChange={formChangeHandler}
                  placeholder={"Input your valid email"}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
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
                Register
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default RegisterPage
