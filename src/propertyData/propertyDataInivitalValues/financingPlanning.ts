import dayjs from "dayjs";
import { PropertyData } from "../PropertyDataContext";

const data = {
  propertyValue: 500000,
  downPayment: 125000,
  subsidy: 0,
  installmentValue: 3373.77,
  initialRentValue: 2200,
  initialRentMonth: dayjs().add(1, "month").format("MM/YYYY"),
  initialFinancingMonth: dayjs().add(1, "month").format("MM/YYYY"),
  financingMonths: 420,
  inCashFees: 0,
  financingFees: 11000,
  financingFeesDate: dayjs().format("MM/YYYY"),
  annualYieldRate: 12,
  rentMonthlyYieldRate: 0.8,
  personalBalance: 0,
  finalYear: 7,
  propertyAppreciationRate: 10,
  rentAppreciationRate: 8,
  interestRate: 10,
  outstandingBalance: 363053.53,
  brokerageFee: 0,
  PVDiscountRate: 8,
  isHousing: false,
  investTheRest: true,
  discharges: [],
  initialDate: dayjs().format("MM/YYYY"),
  cdi: undefined,
  amortizationType: "PRICE",
  considerCapitalGainsTax: false,
} as PropertyData;

export default data;
