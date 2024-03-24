import {
  Box,
  Button,
  CardMedia,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CreateTopic } from '../../types/TopicTypes';
import { useAlert } from '../Providers/AlertProvider';

import useCustomAxios from '../../helpers/customAxios';
import CustomImgUpload from '../Custom/CustomImgUpload';
import { useUser } from '../Providers/UserProvider';
import CustomLoadingButton from '../Custom/CustomLoadingButton';

const CreateTopicForm = ({
  setOpenCreateTopicModal,
}: {
  setOpenCreateTopicModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState<CreateTopic>({
    title: null,
    description: null,
    picture: null,
  });
  // eslint-disable-next-line
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const handleChange = async (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { picture, ...rest } = formData;
      const responseImage = formData.picture
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
      const response = await axiosInstance.post('/topic', {
        ...rest,
        picture: responseImage?.data?.url || null,
        fileId: responseImage?.data?.fileId || null,
      });
      if (response.data === 'Succesful') {
        showAlert('success', 'Topic Created');
        setSuccess(true);
        setOpenCreateTopicModal(false);
      } else {
        showAlert('error', response.data);
        setSuccess(false);
      }
      setLoading(false);
    } catch (error: any) {
      showAlert('error', error.message);
      if (error.response.status === 401) {
        expireCurrentUserSession();
        setOpenCreateTopicModal(false);
      }
      setSuccess(false);
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="md">
      <Box
        style={{
          marginTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Add Topic
        </Typography>
        {formData.picture && (
          <CardMedia
            component="img"
            height="fit-content"
            src={URL.createObjectURL(formData?.picture)}
            alt="Question Picture"
            sx={{ mb: 2, height: '200px', width: '200px' }}
          />
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Title"
                name="title"
                onChange={handleChange}
              />
            </Grid>
            <Grid item lg={8} xs={12}>
              <TextField
                variant="outlined"
                multiline
                required
                fullWidth
                maxRows={19}
                label="Description"
                name="description"
                onChange={handleChange}
              />
            </Grid>
            <Grid item lg={4} xs={12} display={'flex'} alignItems={'center'}>
              <CustomImgUpload
                setFormData={setFormData}
                customText="Add an Image"
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              alignItems: 'center',
              columnGap: 1,
              mt: '3%',
            }}
          >
            <CustomLoadingButton
              loading={loading}
              success={success}
              handleSubmit={handleSubmit}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenCreateTopicModal(false)}
            >
              Close
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateTopicForm;
