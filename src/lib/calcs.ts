export function calcRentValue(
  valorInicial: number,
  ano: number,
  rentAppreciationRate: number
): number {
  return Number(
    (valorInicial * Math.pow(1 + rentAppreciationRate / 100, ano)).toFixed(2)
  );
}

export function calcPropertyValuation(
  propertyValue: number,
  interestRate: number,
  finalYear: number
): number {
  return propertyValue * Math.pow(1 + interestRate / 100, finalYear);
}

export function calcInstallmentValue(
  financedAmount: number,
  annualInterestRate: number,
  financingYears: number,
  amortizationType: string = "PRICE"
) {
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalMonths = financingYears * 12;

  if (amortizationType === "SAC") {
    const fixedAmortization = financedAmount / totalMonths;
    const firstInstallment = fixedAmortization + financedAmount * monthlyRate;
    return firstInstallment;
  } else {
    return (
      (financedAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  }
}

export function calcOutstandingBalance(
  financedAmount: number,
  annualInterestRate: number,
  totalFinancingYears: number,
  paymentsMade: number,
  amortizationType: string = "PRICE"
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalInstallments = totalFinancingYears * 12;

  if (amortizationType === "SAC") {
    const fixedAmortization = financedAmount / totalInstallments;
    const remainingBalance = financedAmount - fixedAmortization * paymentsMade;
    return remainingBalance > 0 ? remainingBalance : 0;
  } else {
    let outstandingBalance =
      financedAmount *
      ((Math.pow(1 + monthlyRate, totalInstallments) -
        Math.pow(1 + monthlyRate, paymentsMade)) /
        (Math.pow(1 + monthlyRate, totalInstallments) - 1));

    if (outstandingBalance < 0) {
      outstandingBalance = 0;
    }

    return outstandingBalance;
  }
}

export function calcTotalInterestPaid(
  loanAmount: number,
  interestRate: number,
  totalYearsOfLoan: number,
  installmentValue: number,
  paymentsMade: number
) {
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = totalYearsOfLoan * 12;

  const balanceBeforePayment =
    loanAmount *
    ((Math.pow(1 + monthlyInterestRate, totalPayments) -
      Math.pow(1 + monthlyInterestRate, paymentsMade - 1)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1));

  const balanceAfterPayment =
    loanAmount *
    ((Math.pow(1 + monthlyInterestRate, totalPayments) -
      Math.pow(1 + monthlyInterestRate, paymentsMade)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1));

  const principalPaid =
    installmentValue - (balanceBeforePayment - balanceAfterPayment);

  return principalPaid;
}

export function calculatePresentValue(
  futureCashFlows: number[],
  discountRate: number,
  periods: number[]
): number {
  const monthlyDiscountRate = Math.pow(1 + discountRate / 100, 1 / 12) - 1;
  let presentValue = 0;

  for (let i = 0; i < futureCashFlows.length; i++) {
    presentValue +=
      futureCashFlows[i] / Math.pow(1 + monthlyDiscountRate, periods[i]);
  }

  return Number(presentValue.toFixed(2));
}
