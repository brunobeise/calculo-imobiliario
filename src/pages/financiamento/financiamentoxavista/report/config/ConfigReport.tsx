
import ConfigFinancingAnalysis from "./ConfigFinancingAnalysis";
import ConfigIntro from "./ConfigIntro";
import ConfigPropertyDetails from "./ConfigPropertyDetails";
import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Checkbox } from "@mui/joy";
import InCashAnalysis from "./InCashAnalysis";

interface ConfigReportProps {
  viewMap: {
    cover: boolean;
    propertyDetails: boolean;
    finance: boolean;
    inCash: boolean;
    comparative: boolean;
    conclusion: boolean;
  };
  changeViewMap: (
    key:
      | "inCash"
      | "cover"
      | "propertyDetails"
      | "finance"
      | "comparative"
      | "conclusion"
  ) => void;
}

export default function ConfigReport(props: ConfigReportProps) {
  return (
    <div className="uw:col-span-6 grid grid-flow-rows pe-10 justify-end">
      <AccordionGroup disableDivider sx={{ maxWidth: 500, gap: 2 }}>
        <Accordion disabled={!props.viewMap.cover} className={"relative"}>
          <AccordionSummary>Introdução</AccordionSummary>
          <AccordionDetails>
            <ConfigIntro />
          </AccordionDetails>
          <Checkbox
            className={"!absolute top-2 left-[-1rem]"}
            checked={props.viewMap.cover}
            onChange={() => props.changeViewMap("cover")}
          />
        </Accordion>
        <Accordion disabled={!props.viewMap.propertyDetails} className={"relative"}>
          <AccordionSummary>Dados do imóvel e financiamento</AccordionSummary>
          <AccordionDetails>
            <ConfigPropertyDetails />
          </AccordionDetails>
          <Checkbox
            className={"!absolute top-2 left-[-1rem]"}
            checked={props.viewMap.propertyDetails}
            onChange={() => props.changeViewMap("propertyDetails")}
          />
        </Accordion>
        <Accordion disabled={!props.viewMap.finance} className={"relative"}>
          <AccordionSummary>Análise Financiamento</AccordionSummary>
          <AccordionDetails>
            <ConfigFinancingAnalysis/>
          </AccordionDetails>
          <Checkbox
            className={"!absolute top-2 left-[-1rem]"}
            checked={props.viewMap.finance}
            onChange={() => props.changeViewMap("finance")}
          />
        </Accordion>
        <Accordion disabled={!props.viewMap.inCash} className={"relative"}>
          <AccordionSummary>Análise à Vista</AccordionSummary>
          <AccordionDetails>
            <InCashAnalysis/>
          </AccordionDetails>
          <Checkbox
            className={"!absolute top-2 left-[-1rem]"}
            checked={props.viewMap.inCash}
            onChange={() => props.changeViewMap("inCash")}
          />
        </Accordion>
        <Accordion disabled={!props.viewMap.comparative} className={"relative"}>
          <AccordionSummary>Comparativo</AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </AccordionDetails>
          <Checkbox
            className={"!absolute top-2 left-[-1rem]"}
            checked={props.viewMap.comparative}
            onChange={() => props.changeViewMap("comparative")}
          />
        </Accordion>
        <Accordion disabled={!props.viewMap.conclusion} className={"relative"}>
          <AccordionSummary>Conclusão</AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </AccordionDetails>
          <Checkbox
            className={"!absolute top-2 left-[-1rem]"}
            checked={props.viewMap.conclusion}
            onChange={() => props.changeViewMap("conclusion")}
          />
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
