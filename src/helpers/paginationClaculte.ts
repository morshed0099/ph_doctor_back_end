type Ioption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type IoptionResult = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  skip: number;
};

const calculatePaginationOption = (option: Ioption): IoptionResult => {
  const page: number = Number(option.page) || 1;
  const limit: number = Number(option.limit) || 10;
  const skip: number = (page - 1) * limit;
  const sortOrder = option.sortOrder || "desc";
  const sortBy = option.sortBy || "createdAt";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const helpers = {
  calculatePaginationOption,
};
