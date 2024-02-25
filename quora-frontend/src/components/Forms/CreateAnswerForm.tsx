import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../Providers/AlertProvider';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { CreateAnswer } from '../../types/AnswerTypes';

const CreateAnswerForm = ({
  questionId,
  setQuestion,
}: {
  questionId: number;
  setQuestion: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [formData, setFormData] = useState<CreateAnswer>({
    description: '',
    question: questionId,
  });
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const { showAlert } = useAlert();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log('Form Data: ', formData);
      const response = await axios.post(
        'http://localhost:3000/answer/',
        formData,
        { withCredentials: true },
      );
      if (response.status === 201 && response.data.message === 'Succesfully') {
        showAlert('success', 'Answer Posted');
        const answer = await axios.get(`http://localhost:3000/answer/${response.data.id}`)
        setQuestion((prev: any) => ({
          ...prev,
          answers: [...prev.answers,answer.data],
        }));
      } else {
        showAlert('error', 'Unexpected ERROR: ' + response.data);
      }
    } catch (error: any) {
      console.log(error);
      showAlert(
        'error',
        error.response.status + ' ' + error.response.statusText,
      );
      if (error.response.status === 401) {
        removeCookie('jwt');
        navigate('/login');
      }
    }
  };
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
          Post Answer
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                maxRows={16}
                label="Description"
                name="description"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            Post Answer
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={() => console.log('Should clear the description')}
            style={{ marginTop: '16px' }}
          >
            Cancel
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default CreateAnswerForm;