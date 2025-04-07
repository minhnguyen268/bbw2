import useGetListUserBank from "@/hooks/admin/useGetListUserBank";
import { convertDateTime } from "@/utils/convertTime";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import FormBank from "@/components/admin/settings/Bank/FormBank";
import DeleteIcon from "@mui/icons-material/Delete";
import BankService from "@/services/admin/BankService";
import { toast } from "react-toastify";

const ListUserBank = ({ ID }) => {
  const { data: dataQuery, isLoading, refetch } = useGetListUserBank({ userId: ID });
  const [selectedBank, setSelectedBank] = useState(null);
  const [deleteBank, setDeleteBank] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const GridRowsProp =
    dataQuery?.map((item, i) => ({
      id: item._id,
      action: item._id,
      stt: i + 1,
      tenNganHang: item.tenNganHang,
      soTaiKhoan: item.soTaiKhoan,
      tenChuTaiKhoan: item.tenChuTaiKhoan,
      createdAt: convertDateTime(item.createdAt),
    })) ?? [];

  const GridColDef = [
    { field: "stt", headerName: "STT", width: 100 },
    { field: "tenNganHang", headerName: "Tên ngân hàng", width: 200 },
    {
      field: "soTaiKhoan",
      headerName: "STK",
      width: 250,
    },
    { field: "tenChuTaiKhoan", headerName: "Chủ tài khoản", width: 250 },

    { field: "createdAt", headerName: "Thời gian tạo", width: 250 },
    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: 150,
      getActions: (params) => [
        <div sx={{ padding: "0px 10px", backgroundColor: "transparent !important" }}>
          <EditIcon sx={{ marginRight: "15px" }} onClick={() => setSelectedBank(params.row)} />
          <DeleteIcon sx={{ color: "red" }} onClick={() => setDeleteBank(params.row)} />
        </div>,
      ],
    },
  ];

  const handleUpdate = async (data) => {
    const res = await BankService.updateBankUser({
      id: selectedBank.id,
      data,
    });

    refetch();

    return res;
  };

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    await BankService.deleteBankUser({
      id: deleteBank.id,
    });
    setIsLoadingDelete(false);
    setDeleteBank(null);
    refetch();
    toast.success("Xoá ngân hàng thành công");
  };

  return (
    <>
      <h2
        className="title admin"
        style={{
          fontSize: "2.5rem",
        }}
      >
        Danh sách ngân hàng
      </h2>

      <Box
        sx={{
          textAlign: "center",
          color: "text.secondary",
          height: 500,
          width: "100%",
          "& .trangthai_hoantat": {
            color: "#1fc67c",
          },
          "& .trangthai_dangcho": {
            color: "#1a3e72",
          },

          "& .MuiPaper-root ": {
            color: "#000000",
          },
        }}
      >
        <DataGrid
          loading={isLoading}
          rows={GridRowsProp}
          columns={GridColDef}
          componentsProps={{
            panel: {
              sx: {
                "& .MuiTypography-root": {
                  color: "dodgerblue",
                  fontSize: 20,
                },
                "& .MuiDataGrid-filterForm": {
                  bgcolor: "lightblue",
                },
              },
            },
          }}
          sx={{
            color: "#000000",
            "& .MuiDataGrid-paper": {
              color: "#000000",
            },
            "& .MuiToolbar-root": {
              color: "#000000",
            },
            "& .MuiMenuItem-root": {
              color: "#000000",
            },
          }}
        />
      </Box>

      <Dialog
        open={selectedBank}
        onClose={() => {
          setSelectedBank(null);
        }}
        fullWidth
      >
        <DialogTitle>Thay đổi thông tin ngân hàng</DialogTitle>
        <DialogContent>
          <FormBank
            data={selectedBank}
            handleCancel={() => {
              setSelectedBank(null);
            }}
            handleOnSubmit={handleUpdate}
            isEditingUserBank
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteBank}
        onClose={() => {
          setDeleteBank(null);
        }}
        fullWidth
      >
        <DialogTitle>Bạn có chắc chắn muốn xoá ngân hàng này không?</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteBank(null);
            }}
            disabled={isLoadingDelete}
          >
            Huỷ
          </Button>
          <Button
            onClick={() => {
              handleDelete();
            }}
            loading={isLoadingDelete}
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ListUserBank;
