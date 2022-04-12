import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal(props) {
    
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Vote details
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <p>Stock: {props.response.stock_symbol}</p>
            <p>Current price: {props.response.start_price}</p>
            <p>Vote: {props.response.response_value}</p>
            <p>Expiration date: {props.response.expiration_time}</p>
            <label>
                Enter email to get notifications for this vote:
                <input></input>
            </label>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}