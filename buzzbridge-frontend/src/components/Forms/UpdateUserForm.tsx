import { Box, Button, CardMedia, TextField } from "@mui/material";
import { useState } from "react";
import { User } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../helpers/customAxios";
import CustomImgUpload from "../Custom/CustomImgUpload";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useUser } from "../Providers/UserProvider";

const UpdateUserForm = ({
  user,
  signUp = false,
  setOpenModal,
}: {
  user: User | any;
  signUp?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  let currentPictureUrl =
    user?.picture?.toString() || process.env.PUBLIC_URL + "/user_avatar.png";
  const [formData, setFormData] = useState<any>({
    fileId: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const { expireCurrentUserSession } = useUser();
  const axiosInstance = useCustomAxios();

  const handleChange = async (e: any) => {
    setFormData((prev:any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const { picture, ...rest } = formData;
      let pictureUrl = user?.picture;
      let fileId = user?.fileId;
      if (picture) {
        const response = await axiosInstance.post(
          "/auth/imagekit/getImageUrl",
          { file: picture },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response && response.data) {
          pictureUrl = response.data.url;
          fileId = response.data.fileId;
        }
      }
      if (!formData.picture && user?.picture) {
        await axiosInstance.delete(
          `/auth/imagekit?url=${user?.picture}&fileId=${user?.fileId}`
        );
      }
      await axiosInstance.patch(`/user/${user?.id}`, {
        ...rest,
        picture: pictureUrl,
        fileId: fileId,
      });
      setLoading(false);
      setSuccess(true);
      showAlert("success", "User updated successfully");
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert("error", "Error updating user");
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 2,
          mt: "3%",
        }}
      >
        <CustomImgUpload
          setFormData={setFormData}
          width={"fit-content"}
          height={"min-content"}
          customText=" "
          borderRadius={"50%"}
          hover
          children={
            <CardMedia
              component="img"
              sx={{
                height: "200px",
                width: "200px",
                borderRadius: "50%",
              }}
              src={
                formData.picture
                  ? URL.createObjectURL(formData?.picture)
                  : currentPictureUrl
              }
              alt="green iguana"
            />
          }
        />
      </Box>
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        defaultValue={user?.name}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        variant="outlined"
        defaultValue={user?.email}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="About"
        name="about"
        variant="outlined"
        defaultValue={user?.about}
        multiline
        maxRows={6}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          columnGap: 1,
          mt: "3%",
        }}
      >
        <CustomLoadingButton
          loading={loading}
          success={success}
          handleSubmit={handleFormSubmit}
        />
        {!signUp && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenModal && setOpenModal(false)}
          >
            Cancel
          </Button>
        )}
      </Box>
    </form>
  );
};

export default UpdateUserForm;
