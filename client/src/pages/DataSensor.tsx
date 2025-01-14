import { useState } from "react";
import { Box } from "@mui/system";
import {
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { Header } from "../Components";
import { tokens } from "../common/theme";
import {
  DataSensorQueryParams,
  useQueryDataSensor,
} from "../queries/dataSensorQuery";
import { OrderByEnum, OrderEnum } from "../common/common";
import moment from "moment";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "temperature", headerName: "Nhiệt độ", width: 200 },
  { field: "humidity", headerName: "Độ ẩm", width: 200 },
  { field: "light", headerName: "Ánh sáng", width: 200 },
  {
    field: "createAt",
    headerName: "Thời gian",
    width: 200,
    valueFormatter: (params) =>
      moment(params?.value).format("DD/MM/YYYY hh:mm A"),
  },
];

const DataSensor = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // getData
  const [params, setParams] = useState<DataSensorQueryParams>({
    page: 1,
    limit: 10,
    order: OrderEnum.ASC,
    orderBy: OrderByEnum.CREATE_AT,
    searchBy: "",
    s: "",
  });

  const [searchUI, setSearchUI] = useState<string>(" ");
  const [searchInput, setSearchInput] = useState<string>("");

  const { data, isLoading, isFetching } = useQueryDataSensor(params);

  // console.log(data?.data);

  return (
    <>
      {/* Header */}
      <Header
        title="Data Sensor"
        subtitle="Thông tin chi tiết của cảm biến, đèn, quang trở"
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

export default DataSensor;
