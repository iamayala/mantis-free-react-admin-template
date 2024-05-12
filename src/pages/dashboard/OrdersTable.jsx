import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

// project import
import Dot from 'components/@extended/Dot';
import MainCard from 'components/MainCard';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useCallback, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ headCells, hasAction }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
          >
            {headCell}
          </TableCell>
        ))}

        {hasAction &&
        <TableCell>
            ACTION
          </TableCell>}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable({headCells, data,hasAction=true, canView=true, canEdit=true, canDelete=true, onPressAction}) {

  const handlePressAction = useCallback((action, row) => {
    onPressAction(action, row)
  }, [onPressAction])

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <MainCard  content={true} style={{ width: '100%' }}>

        <Dialog
  // selectedValue={selectedValue}
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
>
   <DialogTitle id="alert-dialog-title">
          You are to delete a record
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to delete this item, note that this action can not be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">Cancel</Button>
          <Button onClick={handleClose} variant="contained" autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
</Dialog>
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead headCells={headCells} hasAction={hasAction} />
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={index}
                >
                  {Object.entries(row).map(([key, value]) => (
                    <TableCell key={key}>
                      {key === 'status' ? (
                        <OrderStatus status={value} />
                      ) : (
                        value
                      )}
                    </TableCell>
                  ))}
                {hasAction &&
                  <TableCell>
                    <Stack direction={"row"}  gap={"10px"}>
                      {canView &&
                          <IconButton color="success" size="small" onClick={() => handlePressAction("VIEW", row)}>
                            <EyeOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton> }

                        {canEdit &&
                          <IconButton color="warning" size="small" onClick={() => handlePressAction("EDIT", row)}>
                            <EditOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton> }
                          
                          {canDelete &&
                          <IconButton color="error" size="small" onClick={() => {handleClickOpen(); handlePressAction("DELETE", row)}}>
                              <DeleteOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton> }
                    </Stack>
                  </TableCell> }
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
      </MainCard >

  );
}

OrderTable.propTypes = { OrderTable: PropTypes.arrayOf(PropTypes.any), data: PropTypes.arrayOf(PropTypes.any), hasAction: PropTypes.bool, canView: PropTypes.bool, canEdit: PropTypes.bool, canDelete: PropTypes.bool, onPressAction: PropTypes.func};

OrderTableHead.propTypes = { headCells: PropTypes.arrayOf(PropTypes.any), hasAction: PropTypes.bool };

OrderStatus.propTypes = { status: PropTypes.number };
