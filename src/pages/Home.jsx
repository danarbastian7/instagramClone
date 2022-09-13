import {
  Box,
  Container,
  Text,
  Heading,
  Stack,
  Textarea,
  HStack,
  Input,
  Button,
  useToast,
  Image,
  MenuButton,
  MenuList,
  Menu,
  Icon,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { axiosInstance } from "../api"
import ProtectedRoute from "../components/ProtectedRoute"
import { BsThreeDots } from "react-icons/bs"
import Post from "../components/Post"

const HomePage = () => {
  const authSelector = useSelector((state) => state.auth)
  const toast = useToast()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const formik = useFormik({
    initialValues: {
      body: "",
      image_url: "",
    },
    onSubmit: async (values) => {
      try {
        let newPosts = {
          body: values.body,
          image_url: values.image_url,
          userId: authSelector.id,
        }
        await axiosInstance.post("/posts", newPosts)

        formik.setFieldValue("body", "")
        formik.setFieldValue("image_url", "")

        toast({
          position: "top-right",
          title: "Uploaded",
          status: "success",
        })
        fetchPosts()

        // setPosts(Response.data())
      } catch (err) {
        console.log(err)
        // toast({
        //   position: "top-right",
        //   title: "Cant Uploaded",
        //   status: "error",
        // })
      }
    },
  })

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }
  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", {
        params: {
          _expand: "user",
          _sort: "id",
          _order: "desc",
          _limit: 3,
          _page: page,
        },
      })
      setTotalCount(response.headers["x-total-count"])
      if (page === 1) {
        setPosts(response.data)
      } else {
        setPosts([...posts, ...response.data])
      }
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

  const setMoreBtnHandler = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  return (
    <ProtectedRoute>
      <Container maxW={"container.md"} py={"4"}>
        <Heading>Expression Page</Heading>
        {authSelector.id ? (
          <Stack mt="4">
            <Textarea
              borderColor={"green.400"}
              placeholder="Show me your Expression"
              value={formik.values.body}
              name="body"
              onChange={inputChangeHandler}
            />
            <HStack>
              <Input
                borderColor={"green.400"}
                value={formik.values.image_url}
                onChange={inputChangeHandler}
                name="image_url"
                placeholder="Insert Image URL"
              />
              <Button
                onClick={formik.handleSubmit}
                isDisabled={formik.isSubmitting}
                colorScheme={"whatsapp"}
              >
                Post
              </Button>
            </HStack>
          </Stack>
        ) : null}
        <Stack mt={"8"} spacing={"2"}>
          {renderPost()}
          {!posts.length ? (
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>No posts found</AlertTitle>
            </Alert>
          ) : null}
        </Stack>
        {posts.length >= totalCount ? null : (
          <Button
            onClick={setMoreBtnHandler}
            mt={"6"}
            colorScheme={"green"}
            width={"100%"}
          >
            See More
          </Button>
        )}
      </Container>
    </ProtectedRoute>
  )
}

export default HomePage
