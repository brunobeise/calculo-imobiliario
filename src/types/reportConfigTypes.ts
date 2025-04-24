export interface ReportConfig {
  separateDocumentation: boolean;
  groupMonthlyInstallments: boolean;
  displayFinancingTime: boolean;
  photoViewer: boolean;
  requestName: boolean;
  displayAccepted: boolean;
  saveSessions: boolean;
  pageViewMap: boolean[];
  highlightSumPaymentsValues: boolean;
  displaySummary: boolean;
  paymentConditionsConfig: {
    order: string[];
    downPaymentHeight: number;
    reinforcementsHeight: number;
    contructionInterestHeight: number;
  };
  paymentConditionsDescription: string;
}
