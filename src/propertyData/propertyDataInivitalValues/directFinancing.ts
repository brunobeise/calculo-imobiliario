import dayjs from "dayjs";
import { PropertyData } from "../PropertyDataContext";

const data = {
  propertyValue: 2319800,
  downPayment: 463960,
  subsidy: 0,
  installmentValue: 0,
  initialRentValue: 10000,
  initialRentMonth: dayjs().add(1, "month").format("MM/YYYY"),
  initialFinancingMonth: dayjs().add(1, "month").format("MM/YYYY"),
  financingMonths: 0,
  inCashFees: 0,
  financingFees: 14000,
  financingFeesDate: dayjs().format("MM/YYYY"),
  monthlyYieldRate: 0.9,
  rentMonthlyYieldRate: 0.8,
  personalBalance: 0,
  finalYear: 7,
  propertyAppreciationRate: 10,
  rentAppreciationRate: 8,
  interestRate: 0,
  outstandingBalance: 0,
  brokerageFee: 6,
  PVDiscountRate: 8,
  isHousing: false,
  investTheRest: false,
  discharges: [
    {
      type: "Anual",
      month: 1,
      value: 225178,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 225178,
    },
    {
      type: "Anual",
      month: 13,
      value: 236227.5311922725,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 225178,
    },
    {
      type: "Anual",
      month: 25,
      value: 247819.2651733121,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 225178,
    },
    {
      type: "Anual",
      month: 37,
      value: 259979.8079464896,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 225178,
    },
    {
      type: "Anual",
      month: 49,
      value: 272737.0710772828,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 225178,
    },
    {
      type: "Mensal",
      month: 1,
      value: 9665.83,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 2,
      value: 9704.49332,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 3,
      value: 9743.31129328,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 4,
      value: 9782.284538453121,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 5,
      value: 9821.413676606933,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 6,
      value: 9860.69933131336,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 7,
      value: 9900.142128638614,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 8,
      value: 9939.742697153168,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 9,
      value: 9979.50166794178,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 10,
      value: 10019.41967461355,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 11,
      value: 10059.497353312,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 12,
      value: 10099.73534272525,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 13,
      value: 10140.13428409615,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 14,
      value: 10180.69482123254,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 15,
      value: 10221.41760051747,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 16,
      value: 10262.30327091954,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 17,
      value: 10303.35248400322,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 18,
      value: 10344.56589393923,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 19,
      value: 10385.94415751498,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 20,
      value: 10427.48793414504,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 21,
      value: 10469.19788588162,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 22,
      value: 10511.07467742515,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 23,
      value: 10553.11897613485,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 24,
      value: 10595.33145203939,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 25,
      value: 10637.71277784755,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 26,
      value: 10680.26362895894,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 27,
      value: 10722.98468347478,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 28,
      value: 10765.87662220867,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 29,
      value: 10808.94012869751,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 30,
      value: 10852.1758892123,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 31,
      value: 10895.58459276915,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 32,
      value: 10939.16693114022,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 33,
      value: 10982.92359886479,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 34,
      value: 11026.85529326025,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 35,
      value: 11070.96271443329,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 36,
      value: 11115.24656529102,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 37,
      value: 11159.70755155218,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 38,
      value: 11204.34638175839,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 39,
      value: 11249.16376728542,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 40,
      value: 11294.16042235457,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 41,
      value: 11339.33706404399,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 42,
      value: 11384.69441230016,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 43,
      value: 11430.23318994936,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 44,
      value: 11475.95412270916,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 45,
      value: 11521.8579392,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 46,
      value: 11567.9453709568,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 47,
      value: 11614.21715244062,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 48,
      value: 11660.67402105038,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 49,
      value: 11707.31671713459,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 50,
      value: 11754.14598400313,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 51,
      value: 11801.16256793914,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 52,
      value: 11848.36721821089,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 53,
      value: 11895.76068708374,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 54,
      value: 11943.34372983207,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 55,
      value: 11991.1171047514,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 56,
      value: 12039.08157317041,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 57,
      value: 12087.23789946309,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 58,
      value: 12135.58685106094,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 59,
      value: 12184.12919846519,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
    {
      type: "Mensal",
      month: 60,
      value: 12232.86571525905,
      indexType: "INCC - M",
      indexValue: 0.4,
      initialMonth: 1,
      isDownPayment: false,
      originalValue: 9665.83,
    },
  ],
  initialDate: dayjs().format("MM/YYYY"),
  cdi: undefined,
  amortizationType: "PRICE",
  considerCapitalGainsTax: true,
} as PropertyData;

export default data;
