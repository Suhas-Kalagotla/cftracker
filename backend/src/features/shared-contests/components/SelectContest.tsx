"use client";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Contest } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { createSharedContest } from "../actions/GroupContestAction";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  color: "black",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  p: 4,
};

interface Props {
  parentContestId: number;
  onClose: () => void;
  onSelect: (contestId: number) => void;
  contests: Contest[];
}

export default function SelectContest({
  parentContestId,
  onClose,
  onSelect,
  contests,
}: Props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  useEffect(() => {
    console.log("parentContestId", parentContestId);
    if (parentContestId !== -2) handleOpen();
  }, [parentContestId]);

  contests[0].contestId;
  const columns: GridColDef[] = [
    { field: "contestId", headerName: "contestId", width: 90 },
    {
      field: "name",
      headerName: "name",
      width: 450,
    },
    {
      field: "Select",
      width: 150,
      renderCell: (params: GridRenderCellParams<any, Date>) => (
        <Button
          variant="contained"
          size="small"
          style={{ marginLeft: 16 }}
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={async () => {
            onSelect(params.row.contestId);
            if (parentContestId === -1) {
              await createSharedContest(
                params.row.contestId,
                params.row.contestId
              );
            } else {
              await createSharedContest(parentContestId, params.row.contestId);
            }
            handleClose();
          }}
        >
          Select
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={style}>
          <Typography id="parent-modal-title" variant="h6" component="h2">
            Parent ID:{parentContestId}
          </Typography>
          <Box>
            <DataGrid
              rows={contests}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 15]}
              disableRowSelectionOnClick
              slots={{ toolbar: GridToolbarQuickFilter }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
}
