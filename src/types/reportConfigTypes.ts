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
  PaymentConditionsConfig: PaymentConditionsConfig;
  paymentConditionsDescription: string;
}

export interface PaymentConditionsConfig {
  order: string[];
  downPaymentHeight: number;
  reinforcementsHeight: number;
  constructionInterestHeight: number;
  downPaymentCustomType: string;
}
