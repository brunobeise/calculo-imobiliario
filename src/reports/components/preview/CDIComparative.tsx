{
  /* {!!propertyData.cdi &&
            propertyData.cdi !== 0 &&
            isPageViewActive(5) && (
              <div ref={page6Ref} className="w-full px-12 ">
                <p className="text-primary mt-2 mb-5">
                  Comparativo com CDI e Reinvestimento do Lucro Mensal
                </p>
                <div className="text-primary col-span-2 mb-10">
                  <p>
                    No cálculo mensal do investimento imobiliário, a diferença
                    entre o aluguel recebido e a parcela do financiamento pode
                    resultar em um lucro positivo, que, quando reinvestido em
                    renda fixa, gera rentabilidade e aumenta o patrimônio ao
                    longo do tempo. Ao comparar com a taxa do CDI, o retorno do
                    reinvestimento pode ser inferior ou superior ao que seria
                    obtido aplicando o capital na taxa do CDI. Isso ressalta a
                    importância de avaliar diferentes opções de investimento, já
                    que o CDI oferece uma taxa média, enquanto o investimento
                    imobiliário pode trazer ganhos adicionais por valorização e
                    renda passiva, tornando a estratégia de reinvestimento mais
                    sólida e sustentável.
                  </p>
                </div>

                <CDIComparation
                  monthlyContributions={caseData.detailedTable.map(
                    (i) => i.rentalAmount
                  )}
                  cdiRate={propertyData.cdi}
                  initialCapital={
                    propertyData.downPayment + propertyData.financingFees
                  }
                  profitValues={caseData.detailedTable.map(
                    (i) => i.finalValue - caseData.capitalGainsTax
                  )}
                />

                <div className="grid grid-cols-2 text-primary  mt-10">
                  <InfoItemReais
                    text="Valor inicial:"
                    value={
                      propertyData.downPayment + propertyData.financingFees
                    }
                  />

                  <InfoItemReais
                    text="Aportes adicionais:"
                    value={caseData.finalRow.rentalShortfall}
                  />

                  <InfoItemReais
                    text="Patrimônio final (CDI):"
                    value={(() => {
                      const cdiRate = propertyData.cdi;
                      const initialCapital =
                        propertyData.downPayment + propertyData.financingFees;
                      const monthlyContributions = caseData.detailedTable.map(
                        (i) => i.rentalAmount
                      );

                      let accumulatedValue = initialCapital;

                      for (
                        let i = 0;
                        i < monthlyContributions.length - 1;
                        i++
                      ) {
                        const monthlyCdiRate =
                          Math.pow(1 + cdiRate / 100, 1 / 12) - 1;
                        const interest = accumulatedValue * monthlyCdiRate;
                        const discharge =
                          monthlyContributions[i] < 0
                            ? monthlyContributions[i] * -1
                            : 0;
                        accumulatedValue += discharge + interest;
                      }

                      return accumulatedValue;
                    })()}
                  />

                  <p>
                    Juros considerados:{" "}
                    <span className="font-bold">
                      {propertyData.cdi + "%/ano"}
                    </span>
                  </p>
                </div>

                <div className="text-primary mt-10">
                  <p className="font-bold text-center mb-2">Lucro Percentual</p>

                  <div className="flex justify-between px-10">
                    <p className="text-center">
                      investindo em CDI:{" "}
                      <span className="font-bold">
                        {(() => {
                          const initialCapital =
                            propertyData.downPayment +
                            propertyData.financingFees;
                          const patrimonioFinal = (() => {
                            let accumulatedValue = initialCapital;
                            const monthlyContributions =
                              caseData.detailedTable.map((i) => i.rentalAmount);
                            for (
                              let i = 0;
                              i < monthlyContributions.length - 1;
                              i++
                            ) {
                              const monthlyCdiRate =
                                Math.pow(1 + propertyData.cdi / 100, 1 / 12) -
                                1;
                              const interest =
                                accumulatedValue * monthlyCdiRate;
                              const discharge =
                                monthlyContributions[i] < 0
                                  ? monthlyContributions[i] * -1
                                  : 0;
                              accumulatedValue += discharge + interest;
                            }
                            return accumulatedValue;
                          })();

                          const totalAdditional = caseData.detailedTable.reduce(
                            (acc, val) =>
                              val.investmentExcessPresentValue + acc,
                            0
                          );

                          const lucroCdiPercent =
                            (((patrimonioFinal -
                              (initialCapital + totalAdditional)) /
                              initialCapital) *
                              100) /
                            propertyData.finalYear;

                          return (
                            lucroCdiPercent.toFixed(2) +
                            "%/ano" +
                            ` (${(
                              (lucroCdiPercent / propertyData.cdi) *
                              100
                            ).toFixed(2)}%CDI)`
                          );
                        })()}
                      </span>
                    </p>

                    <p className="text-center">
                      investindo no imóvel:{" "}
                      <span className="font-bold">
                        {(
                          caseData.totalProfitPercent / propertyData.finalYear
                        ).toFixed(2) +
                          "%/ano" +
                          ` (${(
                            (caseData.totalProfitPercent /
                              propertyData.finalYear /
                              propertyData.cdi) *
                            100
                          ).toFixed(2)}%CDI)`}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )} */
}
