import { PropertyData } from "@/propertyData/PropertyDataContext";
import {
  calcOutstandingBalance,
  calcPropertyValuation,
  calcRentValue,
  calcTotalInterestPaid,
} from "@/lib/calcs";
import { FinancingPlanningDetailedTable } from "./CaseData";
import dayjs from "dayjs";

export function calcCaseData(propertyData: PropertyData) {
  const detailedTable = calcDetailedTable(propertyData);

  const isFinancingFeesInitial =
    propertyData.financingFeesDate === propertyData.initialDate;

  const totalInvestment =
    propertyData.downPayment +
    (isFinancingFeesInitial ? propertyData.financingFees : 0) +
    detailedTable.reduce(
      (acc, val) => acc + val.investmentExcessPresentValue,
      0
    ) -
    propertyData.subsidy;

  const totalInterestPaid = detailedTable.reduce(
    (acc, val) => acc + val.interestPaid,
    0
  );
  const capitalGainsTax = calcCapitalGainsTax(totalInterestPaid, propertyData);
  const totalProfit = calcTotalProfit(
    detailedTable,
    totalInvestment,
    capitalGainsTax
  );

  return {
    totalInvestment:
      propertyData.downPayment +
      (isFinancingFeesInitial ? propertyData.financingFees : 0) +
      detailedTable[detailedTable.length - 1].rentalShortfall -
      propertyData.subsidy,
    investedEquity: 0,
    totalProfit: totalProfit.value,
    totalProfitPercent: totalProfit.percent,
    totalFinalEquity: totalProfit.finalEquity,
    investedEquityFinal: calcInvestedEquityFinal(detailedTable, propertyData),
    breakEven: calcBreakEvenPoint(detailedTable),
    totalRentalShortfall:
      detailedTable[detailedTable.length - 1].rentalShortfall,
    totalInterestPaid,
    capitalGainsTax,
    detailedTable,
    finalRow: detailedTable[detailedTable.length - 1],
    investedEquityPresentValue: calcInvestedEquityPresentValue(
      propertyData,
      detailedTable
    ),
    brokerageFee:
      (detailedTable[detailedTable.length - 1].propertyValue *
        propertyData.brokerageFee) /
      100,
  };
}

export function calcTotalProfit(
  detailedTable: FinancingPlanningDetailedTable[],
  investedEquityPresentValue: number,
  capitalGainsTax: number,
  row?: number
) {
  const finalRow = row
    ? detailedTable[row]
    : detailedTable[detailedTable.length - 1];
  const totalEquity = finalRow.finalValue;
  const operationProfitAmount = finalRow.monthlyProfit - capitalGainsTax;

  const operationProfitPercent =
    (operationProfitAmount / investedEquityPresentValue) * 100;

  return {
    value: operationProfitAmount,
    percent: operationProfitPercent,
    finalEquity: totalEquity,
  };
}

export function calcInvestedEquityPresentValue(
  propertyData: PropertyData,
  detailedTable: FinancingPlanningDetailedTable[]
) {
  const isFinancingFeesInitial = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).isSame(dayjs(propertyData.initialDate, "MM/YYYY"));

  const investmentExcessVpSum = detailedTable.reduce(
    (acc, val) => acc + val.investmentExcessPresentValue,
    0
  );

  return (
    propertyData.downPayment +
    (isFinancingFeesInitial ? propertyData.financingFees : 0) +
    investmentExcessVpSum
  );
}

export function calcInvestedEquityFinal(
  detailedTable: FinancingPlanningDetailedTable[],
  propertyData: PropertyData,
  month = propertyData.finalYear * 12
) {
  if (month > 0 && month <= detailedTable.length) {
    const rowForMonth = detailedTable[month - 1];

    return (
      rowForMonth.finalValue -
      rowForMonth.propertyValue +
      rowForMonth.outstandingBalance
    );
  } else {
    console.error("Month specified is out of range.");
    return 0;
  }
}

export function calcBreakEvenPoint(
  detailedTable: FinancingPlanningDetailedTable[]
) {
  let breakEvenPoint = 0;
  const initialCapital = detailedTable[0].initialCapital;

  for (const [index, row] of detailedTable.entries()) {
    if (row.initialCapital - initialCapital > row.outstandingBalance) {
      breakEvenPoint = index + 1;
      break;
    }
  }

  return breakEvenPoint;
}

export function calcCapitalGainsTax(
  totalInterestPaid: number,
  propertyData: PropertyData
) {
  if (!propertyData.considerCapitalGainsTax) return 0;

  const appreciatedPropertyValue = calcPropertyValuation(
    propertyData.propertyValue,
    propertyData.interestRate,
    propertyData.finalYear
  );

  return (
    (appreciatedPropertyValue -
      (propertyData.propertyValue + totalInterestPaid)) *
    0.15
  );
}

export function calcDetailedTable(propertyData: PropertyData) {
  const rows: FinancingPlanningDetailedTable[] = [];

  // Capital que o usuário tem aplicado
  let initialCapital = 0;

  // Valor inicial que o usuário precisa desembolsar
  let initialInvestment = propertyData.downPayment - propertyData.subsidy;

  // Verifica se a taxa de financiamento deve ser paga já no mês inicial
  const isFinancingFeesInitial = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).isSame(dayjs(propertyData.initialDate, "MM/YYYY"));

  if (isFinancingFeesInitial) {
    initialInvestment += propertyData.financingFees;
  }

  // Aluguel do primeiro mês
  let rentValue = propertyData.initialRentValue;

  // Quanto já foi investido a mais (por conta de aluguéis negativos, etc.)
  let totalRentalShortfall = 0;

  // Mapeia em que mês (1,2,3...) ocorrem desembolsos adicionais (discharges)
  const dischargesByMonth: Record<number, number> = {};
  propertyData.discharges.forEach((discharge) => {
    if (!dischargesByMonth[discharge.month]) {
      dischargesByMonth[discharge.month] = 0;
    }
    dischargesByMonth[discharge.month] += discharge.value;
  });

  // Soma todos os desembolsos que contam como parte do “down payment” (exceto juros de obra)
  const totalInvestmentDischarges = propertyData.discharges
    .filter((d) => !d.isConstructionInterest)
    .reduce((acc, val) => val.originalValue + acc, 0);

  // Total de meses financiados
  const totalMonths = propertyData.financingMonths;

  // Amortização fixa do SAC (valor principal / número de meses)

  const baseFinanced =
    (propertyData.propertyValue || 0) -
    (propertyData.downPayment || 0) -
    (totalInvestmentDischarges || 0) -
    (propertyData.subsidy || 0);

  // Aplica correção com taxa mensal composta
  const monthlyRate = (propertyData.financingCorrectionRate || 0) / 100;
  const months =
    dayjs(propertyData.initialFinancingMonth, "MM/YYYY").diff(
      dayjs(propertyData.initialDate, "MM/YYYY"),
      "month"
    ) - 1;

  const totalFinanced = parseFloat(
    (baseFinanced * Math.pow(1 + monthlyRate, months)).toFixed(2)
  );

  const amortizationFixed =
    propertyData.amortizationType === "SAC" ? totalFinanced / totalMonths : 0;

  // Saldo devedor inicial (PRICE ou SAC)
  let outstandingBalance = calcOutstandingBalance(
    totalFinanced,
    propertyData.interestRate,
    propertyData.financingMonths,
    0
  );

  // Diferença de meses entre o início do período e a data de taxa de financiamento
  const financingFeesMonthDiff = dayjs(
    propertyData.financingFeesDate,
    "MM/YYYY"
  ).diff(dayjs(propertyData.initialDate, "MM/YYYY"), "month");

  // Para o SAC, vamos controlar quantas parcelas já foram efetivamente pagas
  let sacPaidInstallments = 0;

  // Percorre mês a mês até o final estipulado (finalYear * 12)
  for (let month = 1; month <= propertyData.finalYear * 12; month++) {
    // yearIndex ajuda no reajuste do aluguel
    const yearIndex = Math.floor(month / 12);

    // Data (MM/YYYY) referente a este `month` dentro do loop
    const currentMonthDate = dayjs(propertyData.initialDate, "MM/YYYY").add(
      month,
      "month"
    );

    // Verifica se já está no período em que o aluguel é cobrado
    const rentIsActive = !currentMonthDate.isBefore(
      dayjs(propertyData.initialRentMonth, "MM/YYYY")
    );

    // Verifica se está no período em que o financiamento começa
    const installmentIsActive = !currentMonthDate.isBefore(
      dayjs(propertyData.initialFinancingMonth, "MM/YYYY")
    );

    // A cada 12 meses, reajuste do aluguel (caso não seja "isHousing")
    if (month % 12 === 1 || month === 1) {
      rentValue = propertyData.isHousing
        ? 0
        : calcRentValue(
            propertyData.initialRentValue,
            yearIndex,
            propertyData.rentAppreciationRate
          );
    }

    // Valor efetivamente pago de parcela neste mês
    let installmentValue = 0;

    // Só paga parcela se estiver no período do financiamento
    if (installmentIsActive) {
      if (propertyData.amortizationType === "PRICE") {
        // PRICE: parcela constante (installmentValue configurado)
        installmentValue = propertyData.installmentValue;
        // Atualiza o saldo devedor conforme a progressão do mês (quantas parcelas já pagas?)
        outstandingBalance = calcOutstandingBalance(
          totalFinanced,
          propertyData.interestRate,
          propertyData.financingMonths,
          month
        );
      } else if (propertyData.amortizationType === "SAC") {
        // SAC: incrementa a quantidade de parcelas efetivamente pagas
        sacPaidInstallments++;
        // Se ainda há parcelas a pagar, calcula a parcela do mês
        if (sacPaidInstallments <= propertyData.financingMonths) {
          const interest =
            outstandingBalance * (propertyData.interestRate / 100 / 12);
          installmentValue = amortizationFixed + interest;
          outstandingBalance -= amortizationFixed;
        }
      }
    }

    // Se o usuário configurou "installmentValue" e a parcela calculada for menor, gera uma diferença
    const installmentTax =
      propertyData.installmentValue > installmentValue
        ? propertyData.installmentValue - installmentValue
        : 0;

    // Aluguel líquido: aluguel (se ativo) menos a parcela paga
    const rentalAmount = (rentIsActive ? rentValue : 0) - installmentValue;

    // investmentExcess é quanto o investidor precisa colocar a mais (se o aluguel for insuficiente)
    let investmentExcess = 0;

    // Se ficou negativo (aluguel < parcela), precisa investir a diferença
    if (rentalAmount < 0) {
      investmentExcess = Math.abs(rentalAmount);
      totalRentalShortfall += investmentExcess;
      initialInvestment += investmentExcess;
    }

    // Desembolsos pontuais (discharges) neste mês
    if (dischargesByMonth[month]) {
      investmentExcess += dischargesByMonth[month];
      totalRentalShortfall += dischargesByMonth[month];
      initialInvestment += dischargesByMonth[month];
    }

    // *** Ajuste importante no SAC ***

    // Agora só somamos installmentTax ao investimento se:
    // 1) for SAC
    // 2) já estiver dentro do período de financiamento (installmentIsActive)
    // 3) E se esse "tax" realmente existir (ou seja, se a parcela desejada for maior que a real)
    if (
      propertyData.amortizationType === "SAC" &&
      installmentIsActive &&
      installmentTax > 0
    ) {
      investmentExcess += installmentTax;
    }

    // Se a taxa de financiamento não foi paga no mês inicial, pagar agora quando chegar financingFeesDate
    if (!isFinancingFeesInitial && month === financingFeesMonthDiff + 1) {
      investmentExcess += propertyData.financingFees;
      totalRentalShortfall += propertyData.financingFees;
      initialInvestment += propertyData.financingFees;
    }

    const annualYieldRate = propertyData.annualYieldRate / 100;
    const monthlyYieldRate = Math.pow(1 + annualYieldRate, 1 / 12) - 1;

    const capitalYield =
      initialCapital >= 0 ? initialCapital * monthlyYieldRate : 0;

    // Valor atualizado do imóvel (valorização)
    const propertyValue = calcPropertyValuation(
      propertyData.propertyValue,
      propertyData.propertyAppreciationRate,
      Math.floor(month / 12)
    );

    // Juros pagos acumulados até este mês (para exibir em tela, se quiser)
    const interestPaid =
      outstandingBalance > 0
        ? calcTotalInterestPaid(
            propertyData.propertyValue - propertyData.downPayment,
            propertyData.interestRate,
            propertyData.financingMonths,
            propertyData.installmentValue,
            month
          )
        : 0;

    // Valor final no mês (capital em mãos + valor do imóvel - saldo devedor)
    const finalValue = initialCapital + propertyValue - outstandingBalance;

    // Trazendo "investmentExcess" a valor presente
    const monthlyDiscountRate =
      Math.pow(1 + propertyData.PVDiscountRate / 100, 1 / 12) - 1;
    const investmentExcessPresentValue =
      investmentExcess / Math.pow(1 + monthlyDiscountRate, month);

    // Lucro do mês, considerando capital + imóvel, menos investimento e corretagem
    const monthlyProfit =
      finalValue -
      initialInvestment -
      propertyValue * (propertyData.brokerageFee / 100);

    // Cria o objeto da linha detalhada
    rows.push({
      totalCapital: initialCapital,
      initialCapital: initialCapital,
      initialCapitalYield: capitalYield,
      propertyValue: propertyValue,
      installmentValue: installmentValue,
      rentValue: rentIsActive ? rentValue : 0,
      rentalShortfall: totalRentalShortfall,
      rentalAmount: rentalAmount,
      outstandingBalance: Math.max(outstandingBalance, 0),
      interestPaid: interestPaid,
      finalValue: finalValue,
      monthlyProfit: monthlyProfit,
      investmentExcess: investmentExcess,
      investmentExcessPresentValue: investmentExcessPresentValue,
    });

    // Se o aluguel pagou tudo e ainda sobrou (rentalAmount > 0) e a opção investTheRest está ativa, soma ao capital
    if (rentalAmount > 0 && propertyData.investTheRest) {
      initialCapital += rentalAmount;
    }

    // Sempre soma o rendimento do capital
    initialCapital += capitalYield;
  }

  return rows;
}
