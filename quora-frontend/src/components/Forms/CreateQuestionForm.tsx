import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAlert } from '../Providers/AlertProvider';
import { CreateQuestion } from '../../types/QuestionTypes';
import { TopicTypes } from '../../types/TopicTypes';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';

const CreateQuestionForm = ({
  setOpenCreateQuestionModal,
}: {
  setOpenCreateQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [topics, setTopics] = useState<TopicTypes[]>([]);
  const [formData, setFormData] = useState<CreateQuestion>({
    title: '',
    assignedTopics: [],
    picture: null,
  });
  const axiosInstance = customAxios();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { picture, ...rest } = formData;
      const responseUrl = formData.picture
        ? await axiosInstance.post(
            '/auth/imagekit/getImageUrl',
            { file: picture },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
        : null;
      const response = await axiosInstance.post('/question/', {
        ...rest,
        picture: responseUrl?.data || null,
      });
      if (response.status === 201 && response.data === 'Succesful') {
        showAlert('success', 'Question Created');
        setOpenCreateQuestionModal(false);
        navigate(0);
      } else {
        showAlert('error', 'Unexpected ERROR: ' + response.data);
      }
    } catch (error: any) {
      showAlert(
        'error',
        error.response.status + ' ' + error.response.statusText,
      );
      if (error.response.status === 401) {
        removeCookie('jwt');
        setOpenCreateQuestionModal(false);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/topic/');
        setTopics(response.data);
      } catch (error: any) {
        showAlert('error', error.message);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert]);
  return (
    <Container maxWidth="md">
      <div
        style={{
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add Question
        </Typography>
        {formData.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={formData.picture?.toString()}
            alt="Question Picture"
            sx={{ mb: 2 }}
          />
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                maxRows={16}
                label="Question"
                name="title"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={8}>
              <TextField
                select
                value={formData.assignedTopics}
                fullWidth
                placeholder="Select Topics"
                name="assignedTopics"
                label="Topics"
                SelectProps={{
                  multiple: true,
                }}
                onChange={(e: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              >
                {topics.map((topic) => (
                  <MenuItem key={topic.id} value={topic.id}>
                    {topic.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4} display={'flex'} alignItems={'center'}>
              <CustomImgUpload setFormData={setFormData} height={'90%'} />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              mt: '3%',
              columnGap: 1,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!formData.picture}
              style={{ marginTop: '16px' }}
            >
              Post
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCreateQuestionModal(false)}
              style={{ marginTop: '16px' }}
            >
              Close
            </Button>
          </Box>
        </form>
      </div>
    </Container>
  );
};

export default CreateQuestionForm;
