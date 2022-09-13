import {
  Box,
  Container,
  Text,
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Wrap,
  WrapItem,
  HStack,
  Stack,
  Center,
  StatHelpText,
  FormControl,
  FormLabel,
  Button,
  Input,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Params, useParams } from "react-router-dom"
import { axiosInstance } from "../api"
import Post from "../components/Post"
import ProfilePage from "./Profile"
import { login } from "../redux/features/authSlice"

const MyProfile = () => {
  const authSelector = useSelector((state) => state.auth)
  const [posts, setPosts] = useState([])
  const [editMode, setEditMode] = useState(false)
  const dispatch = useDispatch()
  const toast = useToast()

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          userId: authSelector.id,
          _expand: "user",
        },
      })
      setPosts(response.data)
    } catch (err) {
      console.log(err)
    }
  }
  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`)

      fetchPosts()
      toast({ title: "Post Deleted", status: "info" })
    } catch (err) {
      console.log(err)
    }
  }
  const renderPost = () => {
    return posts.map((val) => {
      return (
        <Post
          key={val.id.toString()}
          username={val.user.username}
          body={val.body}
          imagerUrl={val.image_url}
          userId={val.userId}
          onDelete={() => deleteBtnHandler(val.id)}
          postId={val.id}
        />
      )
    })
  }
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      profile_picture: "",
    },
    onSubmit: async (values) => {
      try {
        const emailResponse = await axiosInstance.get("/users", {
          params: {
            email: values.email,
          },
        })
        if (emailResponse.data.length && values.email !== authSelector.email) {
          toast({ title: "Email has already been used", status: "error" })
          return
        }
        const usernameResponse = await axiosInstance.get("/users", {
          params: {
            username: values.username,
          },
        })
        if (
          usernameResponse.data.length &&
          values.username !== authSelector.username
        ) {
          toast({ title: "Username has already been used", status: "error" })
          return
        }
        let newUser = {
          username: values.username,
          email: values.email,
          profile_picture: values.profile_picture,
        }

        await axiosInstance.patch(`/users/${authSelector.id}`, newUser)
        const userResponse = await axiosInstance.get(
          `/users/${authSelector.id}`
        )
        dispatch(login(userResponse.data))
        setEditMode(false)
        toast({ title: "Profile editted", status: "info" })
      } catch (err) {
        console.log(err)
      }
    },
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <Container maxW={"container.lg"} py="4" pb="10">
      <Center>
        <Box
          width={"500px"}
          borderColor="green.400"
          borderWidth="1px"
          p="6"
          borderRadius="8px"
        >
          <HStack spacing={"15px"}>
            <Avatar
              size={"2xl"}
              name={authSelector.username}
              src={authSelector.profile_picture}
            />
            {editMode ? (
              <Stack>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    onChange={formChangeHandler}
                    name="username"
                    defaultValue={authSelector.username}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    onChange={formChangeHandler}
                    name="email"
                    defaultValue={authSelector.email}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Profile Picture</FormLabel>
                  <Input
                    onChange={formChangeHandler}
                    name="profile_picture"
                    defaultValue={authSelector.profile_picture}
                  />
                </FormControl>
              </Stack>
            ) : (
              <Stack>
                <Text fontSize={"2xl"} fontWeight="semibold">
                  {authSelector.username}
                </Text>
                <Text fontSize={"lg"}>{authSelector.email}</Text>
                <Text fontSize={"lg"}>{authSelector.role}</Text>
              </Stack>
            )}
          </HStack>

          {editMode ? (
            <Button
              onClick={formik.handleSubmit}
              mt={"8"}
              width={"100%"}
              colorScheme={"green"}
            >
              Save
            </Button>
          ) : (
            <Button
              colorScheme={"green"}
              mt={"8"}
              width={"100%"}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Center>
      <Center>
        <Stack width={"750px"} mt={"15px"}>
          {renderPost()}
        </Stack>
      </Center>
    </Container>
  )
}

export default MyProfile
