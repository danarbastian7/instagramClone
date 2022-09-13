import {
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Icon,
  Image,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Stack,
  Input,
  useToast,
} from "@chakra-ui/react"
import { useFormik, validateYupSchema } from "formik"
import { BsThreeDots } from "react-icons/bs"
import { useSelector } from "react-redux"
import authSlice from "../redux/features/authSlice"
import Comment from "./Comment"
import * as Yup from "yup"
import { axiosInstance } from "../api"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Post = ({ username, body, imagerUrl, userId, onDelete, postId }) => {
  const [comments, setComments] = useState([])

  const toast = useToast()
  const authSelector = useSelector((state) => state.auth)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const confirmDeleteBtnHandler = () => {
    onClose()
    onDelete()
  }

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get("/comments", {
        params: {
          postId,
          _expand: "user",
        },
      })

      setComments(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const renderComments = () => {
    return comments.map((val) => {
      return <Comment username={val.user.username} text={val.text} />
    })
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object({
      comment: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      try {
        let newComment = {
          text: values.comment,
          userId: authSelector.id,
          postId: postId,
        }
        await axiosInstance.post("/comments", newComment)
        fetchComments()
        formik.setFieldValue("comment", "")
        toast({
          position: "top",
          title: "Comment submitted",
          status: "success",
        })
      } catch (err) {
        console.log(err)
        toast({
          position: "top",
          title: "Comment not submitted",
          status: "error",
        })
      }
    },
  })

  return (
    <>
      <Box
        borderColor={"green.500"}
        borderWidth={"2px"}
        p={"6"}
        borderRadius={"8px"}
        mb={"10px"}
      >
        <HStack justifyContent={"space-between"}>
          <Text mt={"-5px"} fontWeight={"extrabold"} fontSize={"xl"}>
            <Link to={`/profile/${username}`}> {username || "Username"}</Link>
          </Text>

          {authSelector.id === userId ? (
            <Menu colorScheme={"messenger"}>
              <MenuButton>
                <Icon color={"green.600"} as={BsThreeDots} boxSize={"20px"} />
              </MenuButton>
              <MenuList>
                <MenuItem>Edit</MenuItem>
                <MenuItem onClick={onOpen}>Delete</MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </HStack>
        <Text mt={"-5px"} fontSize={"md"} fontFamily={"revert"}>
          {body || "Write your expression"}
        </Text>
        <Image
          borderRadius={"10px"}
          maxHeight={"250PX"}
          width={"100%"}
          objectFit={"cover"}
          mt={"15PX"}
          src={
            imagerUrl ||
            "https://images.unsplash.com/photo-1662390333792-14917e178a1f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2787&q=80"
          }
        />
        <Text fontWeight={"bold"} fontSize={"sm"} mt={"5px"} color={"blue.500"}>
          Comments
        </Text>
        <Stack mt={"3px"} spacing={"0.5px"}>
          {renderComments()}
          {/* <Comment /> */}
        </Stack>
        <form onSubmit={formik.handleSubmit}>
          <HStack mt={"3px"}>
            <Input
              borderRadius={"10PX"}
              borderColor={"green"}
              border={"1px"}
              onChange={({ target }) =>
                formik.setFieldValue(target.name, target.value)
              }
              size={"sm"}
              type={"text"}
              name="comment"
              value={formik.values.comment}
            />
            <Button mt={"5px"} type="submit" size={"sm"} colorScheme={"green"}>
              Add Comment
            </Button>
          </HStack>
        </form>
      </Box>
      <AlertDialog isCentered isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize={"lg"} fontWeight={"bold"}>
              Delete Post
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure to delete this post ? You can undo your post after
              choose the delete button.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button
                colorScheme={"red"}
                onClick={confirmDeleteBtnHandler}
                ml={"3"}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default Post
