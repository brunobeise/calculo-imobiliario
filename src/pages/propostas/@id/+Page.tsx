import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageContext } from "vike-react/usePageContext";
import ReportPreview from "@/reports/ReportPreview";
import PropertyDataCards from "@/propertyData/propertyDataCards/PropertyDataCards";
import { getComponentsBySubType } from "./ProposalComponentSelector";
import { useProposal } from "./ProposalContext";
import { handleSetProposalPropertyData } from "@/propertyData/propertyDataHelpers";
import { caseService } from "@/service/caseService";
import isEqual from "lodash.isequal";
import { SessionDashboard } from "@/components/session/SessionDashboard";
import { uploadImage } from "@/lib/imgur";
import { Button } from "@mui/joy";
import { FaSave } from "react-icons/fa";

export default function Page() {
  const { proposal, setProposal } = useProposal();
  const pageContext = usePageContext();
  const originalProposal = useRef(proposal);

  const tabParam = pageContext.urlParsed.search.tab as string | undefined;

  const [isDirty, setIsDirty] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    originalProposal.current = proposal;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal.id]);

  const {
    TablePropertyAppreciation,
    TableRentAppreciation,
    Conclusion,
    DetailedTable,
  } = getComponentsBySubType({
    type: proposal.type,
    propertyData: proposal.propertyData,
  });

  const handleSave = useCallback(async () => {
    if (!proposal.id) return;
    setSaveLoading(true);

    try {
      let uploadMainPhoto = proposal.mainPhoto;
      if (proposal.mainPhoto && !proposal.mainPhoto.startsWith("https://")) {
        uploadMainPhoto = await uploadImage(proposal.mainPhoto);
      }

      const uploadAdditionalPhotos = await Promise.all(
        proposal.additionalPhotos.map(async (photo) => {
          if (photo && !photo.startsWith("https://")) {
            return await uploadImage(photo);
          }
          return photo;
        })
      );

      await caseService.updateCase(proposal.id, {
        ...proposal,
        mainPhoto: uploadMainPhoto,
        additionalPhotos: uploadAdditionalPhotos,
      });

      setIsDirty(false);
    } finally {
      setSaveLoading(false);
    }
  }, [proposal]);

  useEffect(() => {
    if (!originalProposal.current) {
      originalProposal.current = proposal;
      setIsDirty(false);
      return;
    }
    const proposalClean = {
      ...proposal,
      propertyData: { ...proposal.propertyData },
    };
    delete proposalClean.propertyData.outstandingBalance;

    const originalClean = {
      ...originalProposal.current,
      propertyData: { ...originalProposal.current.propertyData },
    };
    delete originalClean.propertyData.outstandingBalance;

    setIsDirty(!isEqual(proposalClean, originalClean));
  }, [proposal]);

  const variants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 5 : -5,
      position: "absolute" as const,
      width: "100%",
    }),
    animate: {
      opacity: 1,
      x: 0,
      position: "relative" as const,
      width: "100%",
      transition: { duration: 0.1 },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? -5 : 5,
      position: "absolute" as const,
      width: "100%",
      transition: { duration: 0.1 },
    }),
  };

  const direction = tabParam === "case" ? -1 : tabParam === "sessions" ? -1 : 1;

  return (
    <div className="relative w-full pt-24">
      <AnimatePresence mode="wait" initial={false}>
        {tabParam === "case" && (
          <motion.div
            key="case"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            <PropertyDataCards
              type={proposal.subType}
              mode={proposal.type}
              propertyData={proposal.propertyData}
              setPropertyData={(field, value) =>
                setProposal(
                  handleSetProposalPropertyData(proposal, field, value)
                )
              }
            />

            <div className="w-full text-center">
              {proposal.subType === "Avançado" && (
                <div className="grid grid-cols-12 gap-3 justify-center mt-5 mb-5 px-5">
                  {Conclusion}
                  {TablePropertyAppreciation}
                  {TableRentAppreciation}
                  {DetailedTable}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tabParam === "report" && (
          <motion.div
            key="report"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <ReportPreview
              propertyData={proposal.propertyData}
              proposal={proposal}
              onChange={(newProposal) => setProposal(newProposal)}
            />
          </motion.div>
        )}

        {tabParam === "sessions" && (
          <motion.div
            key="report"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <SessionDashboard sessions={proposal.sessions} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão fixo de salvar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 z-50 w-full flex justify-center"
          >
            <Button
              endDecorator={<FaSave />}
              onClick={handleSave}
              type="button"
              loading={saveLoading}
              size="lg"
              className="outline outline-2 outline-whitefull"
            >
              Salvar Alterações
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
