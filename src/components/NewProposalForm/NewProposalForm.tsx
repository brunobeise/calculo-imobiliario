import { useEffect, useState } from "react";
import { Button } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { fetchCases, fetchRealEstateCases } from "@/store/caseReducer";
import { AppDispatch, RootState } from "@/store/store";
import RealEstateProposals from "./NewProposalFormRealEstateProposals";
import MyProposals from "./NewProposalMyProposals";
import { FaArrowLeft } from "react-icons/fa";
import { getInitialValues } from "@/propertyData/propertyDataInivitalValues";
import { usePageContext } from "vike-react/usePageContext";
import { getCaseTypeByLink } from "@/lib/maps";

import type { PropertyData } from "@/propertyData/PropertyDataContext";
import NewProposalOptions from "./NewProposalOptions";
import NewProposalManualOptions from "./NewProposalManualOptions";
import { ExistingProposalOptions } from "./NewProposalExistingProposalOptions";
import PropertyDataNewProposalForm from "@/propertyData/propertyDataInivitalValues/propertyDataNewProposalForm/PropertyDataNewProposalForm";
import SubTypeOptions from "./NewProposalSubTypeOptions";
import { Proposal, ProposalTypes } from "@/types/proposalTypes";
import ProposalFormModal from "../modals/ProposalFormModal";
import { caseService } from "@/service/caseService";
import { navigate } from "vike/client/router";
import { Building } from "@/types/buildingTypes";
import { buildingService } from "@/service/buildingService";

interface NewProposalFormProps {
  type: ProposalTypes;
}

export type NewProposalContext =
  | "new"
  | "exists"
  | "newAdvancedProposal"
  | "myProposals"
  | "realEstateProposals"
  | "subType"
  | "template"
  | "manual"
  | "newSimplificatedProposal";

export default function NewProposalForm(props: NewProposalFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const pageContext = usePageContext();

  const [context, setContext] = useState<NewProposalContext>();

  const [newProposalModal, setNewProposalModal] = useState(false);

  const url = usePageContext().urlPathname;

  const [search, setSearch] = useState("");
  const [building, setBuilding] = useState<Building>();

  const [propertyData, setPropertyData] = useState<PropertyData | undefined>(
    undefined
  );
  const [subType, setSubType] = useState<string>();
  const {
    myCases: myProposals,
    realEstateCases: realEstateProposals,
    loading,
    realEstateCasesLastPage: realEstateProposalsLastPage,
  } = useSelector((state: RootState) => ({
    myCases: state.proposals.myCases,
    realEstateCases: state.proposals.realEstateCases,
    loading:
      state.proposals.myCasesLoading || state.proposals.realEstateCasesLoading,
    realEstateCasesLastPage: state.proposals.realEstateCasesLastPage,
  }));

  useEffect(() => {
    if (context === "myProposals")
      dispatch(fetchCases({ type: getCaseTypeByLink(url), search: search }));
    if (context === "realEstateProposals")
      dispatch(fetchRealEstateCases(undefined));
  }, [context, dispatch, search, url]);

  const handleBack = () => {
    if (!context) window.location.reload();
    if (context === "myProposals") setContext("exists");
    else setContext(undefined);
  };

  const handleCreate = async (data: Proposal) => {
    const result = await caseService.createCase({
      ...data,
      subType: subType,
      type: props.type,
      propertyData: propertyData,
      buildingId: building?.id || null,
    });
    navigate(`/propostas/${result.id}`);
  };

  useEffect(() => {
    if (pageContext.urlParsed.search.buildingId && !building) {
      buildingService
        .getBuildingById(pageContext.urlParsed.search.buildingId)
        .then((result) => {
          setBuilding(result);
        });
    }
  }, [
    building,
    pageContext.urlParsed.search,
    pageContext.urlParsed.search.buildingId,
  ]);

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
      <h2 className="text-primary font-bold text-center text-xl mb-5 ">
        {!context && "Nova proposta"}
        {context === "new" && "Como deseja começar a proposta?"}
        {context === "exists" && "Continuar proposta"}
        {context === "realEstateProposals" && "Propostas Compartilhadas"}
        {context === "myProposals" && "Minhas propostas"}
        {context === "template" && "Qual tipo da proposta?"}
        {context === "manual" && "Qual tipo da proposta?"}
      </h2>

      {!context && <NewProposalOptions setContext={setContext} />}

      {context === "new" && (
        <NewProposalManualOptions setContext={setContext} />
      )}

      {context === "exists" && (
        <ExistingProposalOptions setContext={setContext} />
      )}

      {(context === "newAdvancedProposal" ||
        context === "newSimplificatedProposal") && (
        <PropertyDataNewProposalForm
          building={building}
          setBuilding={setBuilding}
          type={props.type}
          subType={subType}
          finish={(p) => {
            if (p) {
              setPropertyData({
                ...getInitialValues(props.type),
                ...p,
                subsidy: p.subsidy || 0,
                initialRentValue: p.initialRentValue || 0,
                rentAppreciationRate: p.rentAppreciationRate || 0,
                annualYieldRate: p.annualYieldRate || 0,
              });
              setNewProposalModal(true);
            } else handleBack();
          }}
        />
      )}

      {context === "realEstateProposals" && (
        <RealEstateProposals
          totalPages={realEstateProposalsLastPage || 0}
          realEstateProposals={realEstateProposals}
          loading={loading}
        />
      )}

      {context === "myProposals" && (
        <MyProposals
          onSearch={(v) => setSearch(v)}
          myCases={myProposals}
          loading={loading}
        />
      )}

      {(context === "template" || context === "manual") && (
        <SubTypeOptions
          onSelect={(v: string) => {
            if (context === "template") {
              setPropertyData(getInitialValues(props.type));
              setSubType(v);
              setNewProposalModal(true);
            } else if (context === "manual") {
              setSubType(v);
              v === "Simplificado"
                ? setContext("newSimplificatedProposal")
                : setContext("newAdvancedProposal");
            }
          }}
        />
      )}

      {context !== "newSimplificatedProposal" &&
        context !== "newAdvancedProposal" && (
          <div className="w-full flex justify-center mt-5">
            <Button
              startDecorator={<FaArrowLeft />}
              onClick={handleBack}
              variant="plain"
            >
              Voltar
            </Button>
          </div>
        )}

      <ProposalFormModal
        open={newProposalModal}
        onClose={() => setNewProposalModal(false)}
        handleUpdate={handleCreate}
        displaySubType={false}
        title="Criar Proposta"
      />
    </div>
  );
}
