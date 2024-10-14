import dayjs from "dayjs";

const data = {
  propertyValue: 500000,
  downPayment: 125000,
  subsidy: 500,
  installmentValue: 3373.77,
  initialRentValue: 2200,
  initialRentMonth: dayjs().add(1, "month").format("MM/YYYY"),
  initialFinancingMonth: dayjs().add(1, "month").format("MM/YYYY"),
  financingYears: 35,
  inCashFees: 0,
  financingFees: 14000,
  monthlyYieldRate: 0.9,
  rentMonthlyYieldRate: 0.8,
  personalBalance: 0,
  finalYear: 7,
  propertyAppreciationRate: 10,
  rentAppreciationRate: 8,
  interestRate: 10,
  outstandingBalance: 363053.53,
  brokerageFee: 6,
  PVDiscountRate: 8,
  isHousing: false,
  investTheRest: false,
  discharges: [],
  initialDate: dayjs().format("MM/YYYY"),
  cdi: undefined,
};

export default data;
