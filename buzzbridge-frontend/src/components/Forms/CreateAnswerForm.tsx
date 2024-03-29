import {
  CardMedia,
  Container,
  Grid,
  InputBase,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import { useNavigate } from "react-router-dom";
import { CreateAnswer } from "../../types/AnswerTypes";
import useCustomAxios from "../../helpers/customAxios";
import { useUser } from "../Providers/UserProvider";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import ArrowForward from "@mui/icons-material/ArrowForward";

const CreateAnswerForm = ({
  questionId,
  setAnswers,
}: {
  questionId: number;
  setAnswers: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [formData, setFormData] = useState<CreateAnswer>({
    description: null,
    question: questionId,
  });
  console.log(formData)
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession, getCurrentUser } = useUser();
  const user = getCurrentUser();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/answer/", {
        ...formData,
        question: questionId,
      });
      setFormData({ question: questionId, description: null });
      if (response.status === 201 && response.data.message === "Succesfully") {
        const answer = await axiosInstance.get(`/answer/${response.data.id}`);
        setSuccess(true);
        setLoading(false);
        showAlert("success", "Answer Posted");
        setAnswers((prev: any) => ([answer.data,...prev]));
      } else {
        throw new Error("Failed to post answer (UNEXPECTED ERROR)");
      }
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert(
        "error",
        error.response.status + " " + error.response.statusText
      );
      if (error.response.status === 401) {
        expireCurrentUserSession();
        navigate("/login");
      }
    }
  };
  return (
    <Container maxWidth="md">
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <Typography variant="h4" gutterBottom></Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                columnGap: 1,
              }}
            >
              <CardMedia
                component="img"
                sx={{ width: "45px", height: "45px", borderRadius: "50%" }}
                image={
                  user.picture?.toString() ||
                  process.env.PUBLIC_URL + "/user_avatar.png"
                }
                alt="user avatar"
              />
              <InputBase
                required
                maxRows={10}
                multiline
                value={formData.description || ""}
                style={{
                  width: "400px",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  border: "none",
                  padding: "3%",
                }}
                placeholder="Write Something..."
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <CustomLoadingButton
                loading={loading}
                success={success}
                Icon={<ArrowForward />}
              />
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default CreateAnswerForm;
