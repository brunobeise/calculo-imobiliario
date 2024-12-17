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
  financingMonths: number,
  amortizationType: string = "PRICE"
) {
  const monthlyRate = annualInterestRate / 100 / 12;

  if (amortizationType === "SAC") {
    const fixedAmortization = financedAmount / financingMonths;
    const firstInstallment = fixedAmortization + financedAmount * monthlyRate;
    return firstInstallment;
  } else {
    return (
      (financedAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, financingMonths))) /
      (Math.pow(1 + monthlyRate, financingMonths) - 1)
    );
  }
}

export function calcOutstandingBalance(
  financedAmount: number,
  annualInterestRate: number,
  totalFinancingMonths: number,
  paymentsMade: number,
  amortizationType: string = "PRICE"
): number {
  const monthlyRate = annualInterestRate / 100 / 12;

  if (amortizationType === "SAC") {
    const fixedAmortization = financedAmount / totalFinancingMonths;
    const remainingBalance = financedAmount - fixedAmortization * paymentsMade;
    return remainingBalance > 0 ? remainingBalance : 0;
  } else {
    let outstandingBalance =
      financedAmount *
      ((Math.pow(1 + monthlyRate, totalFinancingMonths) -
        Math.pow(1 + monthlyRate, paymentsMade)) /
        (Math.pow(1 + monthlyRate, totalFinancingMonths) - 1));

    if (outstandingBalance < 0) {
      outstandingBalance = 0;
    }

    return outstandingBalance;
  }
}

export function calcTotalInterestPaid(
  loanAmount: number,
  interestRate: number,
  financingMonths: number,
  installmentValue: number,
  paymentsMade: number
) {
  const monthlyInterestRate = interestRate / 100 / 12;

  const balanceBeforePayment =
    loanAmount *
    ((Math.pow(1 + monthlyInterestRate, financingMonths) -
      Math.pow(1 + monthlyInterestRate, paymentsMade - 1)) /
      (Math.pow(1 + monthlyInterestRate, financingMonths) - 1));

  const balanceAfterPayment =
    loanAmount *
    ((Math.pow(1 + monthlyInterestRate, financingMonths) -
      Math.pow(1 + monthlyInterestRate, paymentsMade)) /
      (Math.pow(1 + monthlyInterestRate, financingMonths) - 1));

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
