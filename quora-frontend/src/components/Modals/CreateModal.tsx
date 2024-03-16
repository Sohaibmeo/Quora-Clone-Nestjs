import { Box, Modal } from '@mui/material';
import './style.css';

const CreateModal = ({
  openModal,
  setOpenModal,
  image = false,
  disableBackDrop = false,
  Children,
  width = 700,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  image?: boolean;
  disableBackDrop?: boolean;
  Children: React.ReactNode;
  width?: number | string;
}) => {
  const handleClose = () => {
    if (disableBackDrop) return;
    setOpenModal(false);
  };
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        className={image ? 'modalImage' : 'modalBox'}
        sx={{ width: { width }, boxShadow: 24, p: 4, borderRadius: '16px'}}
      >
        {Children}
      </Box>
    </Modal>
  );
};

export default CreateModal;
