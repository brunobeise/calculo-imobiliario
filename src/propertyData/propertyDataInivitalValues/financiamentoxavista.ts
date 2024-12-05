import dayjs from "dayjs";

const data = {
  propertyValue: 500000,
  downPayment: 100000,
  subsidy: 0,
  installmentValue: 3477.4,
  initialRentValue: 2500,
  initialRentMonth: dayjs().add(1, "month").format("MM/YYYY"),
  initialFinancingMonth: dayjs().add(1, "month").format("MM/YYYY"),
  financingYears: 30,
  inCashFees: 17000,
  financingFees: 11000,
  financingFeesDate: dayjs().add(1, "month").format("MM/YYYY"),
  monthlyYieldRate: 0.8,
  rentMonthlyYieldRate: 0.8,
  personalBalance: 517000,
  finalYear: 7,
  propertyAppreciationRate: 10,
  rentAppreciationRate: 8,
  interestRate: 9.3764,
  outstandingBalance: 376150.25,
  brokerageFee: 6,
  PVDiscountRate: 8,
  isHousing: false,
  investTheRest: true,
  discharges: [],
  initialDate: dayjs().format("MM/YYYY"),
  cdi: undefined,
  considerCapitalGainsTax: true,
};

export default data;
