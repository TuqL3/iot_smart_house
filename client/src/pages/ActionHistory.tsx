import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import FilterVintageOutlinedIcon from "@mui/icons-material/FilterVintageOutlined";
import { useState } from "react";

import { tokens } from "../common/theme";
import { Header } from "../Components";
import moment from "moment";
import { OrderByEnum, OrderEnum } from "../common/common";
import {
  ActionHistoryQueryParams,
  useQueryActionHistory,
} from "../queries/actionHistory";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "device",
    headerName: "Thiết bị",
    width: 200,
    renderCell: (params) => (
      <>
        {params.value === "Fan" ? (
          <FilterVintageOutlinedIcon
            sx={{ verticalAlign: "middle", mr: 2 }}
            color="warning"
            fontSize="medium"
            style={{
              animation: `spin 1s linear infinite`,
            }}
          />
        ) : (
          <LightbulbIcon
            sx={{ verticalAlign: "middle", mr: 2 }}
            color="success"
            fontSize="medium"
            style={{
              animation: `neon
              1.5s ease-in-out infinite alternate`,
            }}
          />
        )}
        {params.value}
      </>
    ),
  },
  {
    field: "act",
    headerName: "Hành động",
    width: 200,
    renderCell: (params) => (
      <Chip
        sx={{ width: 60 }}
        label={params.value}
        color={params.value === "On" ? "success" : "error"}
      />
    ),
  },
  {
    field: "createAt",
    headerName: "Thời gian",
    width: 200,
    valueFormatter: (params) =>
      moment(params?.value).format("DD/MM/YYYY hh:mm A"),
  },
];

const ActionHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // getData
  const [params, setParams] = useState<ActionHistoryQueryParams>({
    page: 1,
    limit: 10,
    order: OrderEnum.ASC,
    orderBy: OrderByEnum.CREATE_AT,
    searchBy: "",
    s: "",
  });
  const [searchUI, setSearchUI] = useState<string>(" ");
  const [searchInput, setSearchInput] = useState<string>("");

  const { data, isLoading, isFetching } = useQueryActionHistory(params);

  // console.log(data?.data);

  return (
    <>
      {/* Header */}
      <Header
        title="Action History"
        subtitle="Thông tin chi tiết của hành động bật tắt bóng đèn, quạt"
      />

      {/* Search */}
      <Box display="flex" py={2}>
        {/* SEARCH BAR */}
        <Box display={"flex"}>
          <InputBase
            sx={{ flex: 1, backgroundColor: colors.primary[400], px: 2 }}
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setParams((prevState) => {
                  return {
                    ...prevState,
                    s: searchInput,
                    searchBy: searchUI === " " ? "" : searchUI,
                  };
                });
              }
            }}
          />
        </Box>
        <FormControl sx={{ width: 200, px: 1 }}>
          <InputLabel id="demo-simple-select-label">Tìm kiếm theo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={searchUI}
            label="Age"
            onChange={(e) => {
              setSearchUI(e.target.value);
            }}
            sx={{ flex: 1, backgroundColor: colors.primary[400] }}
          >
            <MenuItem value={" "}>Tất cả</MenuItem>
            {columns.map((value, index) => (
              <MenuItem value={value.field} key={index}>
                {value.headerName}
              </MenuItem>
            ))}
            {/* <MenuItem value={20}>Độ ẩm</MenuItem>
            <MenuItem value={30}>Ánh sáng</MenuItem>
            <MenuItem value={30}>Thời gian</MenuItem> */}
          </Select>
        </FormControl>
        <IconButton
          type="button"
          sx={{ p: 2 }}
          onClick={() =>
            setParams((prevState) => {
              return {
                ...prevState,
                s: searchInput,
                searchBy: searchUI === " " ? "" : searchUI,
              };
            })
          }
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Data */}

      <div style={{ height: "60vh", width: "100%" }}>
        <DataGrid
          loading={isLoading || isFetching}
          rows={data ? data.data.data : []}
          columns={columns}
          pagination
          sortingMode="server"
          filterMode="server"
          paginationMode="server"
          onPaginationModelChange={(model) => {
            console.log(model);

            setParams((prev) => ({
              ...prev,
              page: model.page + 1,
              limit: model.pageSize,
            }));
          }}
          onSortModelChange={(model) =>
            setParams((prev) => ({
              ...prev,
              order:
                model.length === 1 && model[0].sort
                  ? (model[0].sort.toUpperCase() as OrderEnum)
                  : OrderEnum.ASC,
              orderBy:
                model.length === 1 && model[0].field
                  ? (model[0].field as OrderByEnum)
                  : OrderByEnum.ID,
              // page: model.page + 1,
              // limit: model.pageSize,
            }))
          }
          // onFilterModelChange={(model) => console.log(model)}
          initialState={{
            pagination: {
              paginationModel: {
                page: params.page! - 1,
                pageSize: params.limit!,
              },
            },
          }}
          // paginationModel={{
          //   page: params.page!,
          //   pageSize: params.limit!,
          // }}
          // paginationModel={{
          //   page: data ? data.data.page - 1 : 0,
          //   pageSize: data ? data.data.totalPage : 0,
          // }}
          rowCount={data?.data.total || 0}
          // onRowModesModelChange={(row) => console.log(row)}
          pageSizeOptions={[5, 10, 20, 100]}
          disableRowSelectionOnClick
          // sx={{}}
        />
      </div>
    </>
  );
};

export default ActionHistory;
