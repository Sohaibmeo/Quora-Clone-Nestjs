import { Box, Modal, useMediaQuery } from '@mui/material';
import './style.css';
import CustomCloseIcon from '../Custom/CustomCloseIcon';

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
  const displaySizeLarge = useMediaQuery('(max-width:900px)');
  console.log(displaySizeLarge)
  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box
        className={image ? 'modalImage' : 'modalBox'}
        sx={{
          width: displaySizeLarge ? 300 : { width },
          maxHeight: '70%',
          overflowY: 'auto',
          boxShadow: 24,
          p: 4,
          borderRadius: '16px',
        }}
      >
        <CustomCloseIcon setOpenModal={setOpenModal} />
        {Children}
      </Box>
    </Modal>
  );
};

export default CreateModal;
