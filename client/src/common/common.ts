export enum OrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}
export enum OrderByEnum {
  ID = "id",
  CREATE_AT = "createAt",
  TEMPERATURE = "temperature",
  HUMIDITY = "humidity",
  LIGHT = "light",
  ACTION = "action",
}

export type DefaultParams = {
  page?: number;
  limit?: number;
  order?: OrderEnum;
  s?: string;
  orderBy?: OrderByEnum | React.Key | string;
  searchBy?: OrderByEnum | React.Key | string;
};
