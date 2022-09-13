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
  useToast,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, Navigate } from "react-router-dom"
import { axiosInstance } from "../api"
import Post from "../components/Post"
import MyProfile from "./MyProfile"

const ProfilePage = () => {
  const authSelector = useSelector((state) => state.auth)

  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const params = useParams()
  const toast = useToast()

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          username: params.username,
        },
      })
      setUser(response.data[0])
    } catch (err) {
      console.log(err)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          userId: user.id,
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

  useEffect(() => {
    fetchUserProfile()
    // fetchPosts()
  }, [])
  useEffect(() => {
    if (user.id) {
      fetchPosts()
    }
  }, [user.id])

  if (params.username === authSelector.username) {
    return <Navigate replace to="/me" />
  }
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
              size="2xl"
              name={user.username}
              // src="https://i.pinimg.com/originals/b0/fc/61/b0fc61a60710300edb950cb7b55a7e22.jpg"
            />
            <Stack spacing={"0.5"}>
              <Text fontSize={"2xl"} fontWeight={"semibold"}>
                {user.username}
              </Text>
              <Text fontSize={"lg"}>{user.email}</Text>
              <Text fontSize={"lg"}>{user.role}</Text>
            </Stack>
          </HStack>
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

export default ProfilePage
