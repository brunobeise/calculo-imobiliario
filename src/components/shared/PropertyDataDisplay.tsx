import { toBRL } from "@/lib/formatter";
import { getCaseTitle } from "@/lib/maps";
import { PropertyData } from "@/propertyData/PropertyDataContext";
import React from "react";

interface PropertyDataDisplayProps {
  propertyData: PropertyData;
  subType?: string;
  scenario?: string;
}

const PropertyDataDisplay: React.FC<PropertyDataDisplayProps> = ({
  propertyData,
  subType,
  scenario,
}) => {
  return (
    <div className=" max-w-full overflow-auto text-sm">
      {subType && (
        <p>
          <strong>Tipo: </strong> {"Simplificado"}
        </p>
      )}

      {scenario && (
        <p>
          <strong>Cenário: </strong> {getCaseTitle(scenario)}
        </p>
      )}

      {subType === "Simplificado" ? (
        <div className="grid grid-cols-2 gap-1 text-sm mt-4">
          <p>
            <strong>Valor do imóvel:</strong>{" "}
            {toBRL(propertyData.propertyValue)}
          </p>
          <p>
            <strong>Entrada:</strong> {toBRL(propertyData.downPayment)}
          </p>
          <p>
            <strong>Parcelas:</strong> {toBRL(propertyData.installmentValue)}
          </p>
          <p>
            <strong>Taxas:</strong> {toBRL(propertyData.financingFees)}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 text-sm mt-4">
          <div>
            <p>
              <strong>Valor do imóvel:</strong>{" "}
              {toBRL(propertyData.propertyValue)}
            </p>
            <p>
              <strong>Entrada:</strong> {toBRL(propertyData.downPayment)}
            </p>
            <p>
              <strong>Subsídio:</strong> {toBRL(propertyData.subsidy)}
            </p>
            <p>
              <strong>Parcelas:</strong> {toBRL(propertyData.installmentValue)}
            </p>
            <p>
              <strong>Primeiro Aluguel:</strong>{" "}
              {toBRL(propertyData.initialRentValue)}
            </p>
            <p>
              <strong>Taxas à Vista:</strong> {toBRL(propertyData.inCashFees)}
            </p>
            <p>
              <strong>Taxas de Financiamento:</strong>{" "}
              {toBRL(propertyData.financingFees)}
            </p>
          </div>

          <div>
            <p>
              <strong>Taxa de Juros:</strong> {propertyData.interestRate}%
            </p>
            <p>
              <strong>Taxa de Apreciação Imóvel:</strong>{" "}
              {propertyData.propertyAppreciationRate}%
            </p>
            <p>
              <strong>Taxa de Apreciação Aluguel:</strong>{" "}
              {propertyData.rentAppreciationRate}%
            </p>
            <p>
              <strong>Taxa de Desconto VP:</strong>{" "}
              {propertyData.PVDiscountRate}%
            </p>
            <p>
              <strong>Taxa de corretagem:</strong> {propertyData.brokerageFee}%
            </p>
            <p>
              <strong>Taxa CDI:</strong> {propertyData.cdi || "0"}%
            </p>
            <p>
              <strong>Considerar aluguel:</strong>{" "}
              {propertyData.isHousing ? "Não" : "Sim"}
            </p>
            <p>
              <strong>Investir o restante:</strong>{" "}
              {propertyData.investTheRest ? "Sim" : "Não"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDataDisplay;
