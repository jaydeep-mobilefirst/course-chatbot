import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { BiBookOpen, BiXCircle, BiRightArrowAlt } from 'react-icons/bi';
import { guidlines } from '../data/guidline';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const GuidlineBox = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: `${matches ? '70vw' : '90vw'}`,
    height: '70vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  return (
    <div>
      <Button onClick={handleOpen}>
        <BiBookOpen color="white" size="24px" /> &nbsp;
        <p
          className="flex items-center text-[#EDF4F4] text-[16px] font-bold cursor-pointer"
          style={{ textTransform: 'capitalize' }}
        >
          Guidelines
        </p>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">Guidelines</div>
              <button onClick={handleClose}>
                <BiXCircle size="24px" />
              </button>
            </div>
            <hr className="mt-4" />
            <div className="overflow-auto overflow-x-scroll">
              {guidlines.map((data, idx) => {
                return (
                  <div key={idx}>
                    <div className="mt-4 flex items-start">
                      <div className="mt-[5px]">
                        <BiRightArrowAlt />
                      </div>
                      <div>
                        <p className="font-semibold">{data?.text}</p>
                        <p className="">{data?.subText}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default GuidlineBox;
