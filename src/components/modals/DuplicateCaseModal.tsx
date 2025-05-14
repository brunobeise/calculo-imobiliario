import CaseFormModal from "@/components/modals/CaseFormModal";
import { Proposal } from "@/types/proposalTypes";

interface DuplicateCaseModalProps {
  data?: Proposal;
  onClose: () => void;
}

export default function DuplicateCaseModal(props: DuplicateCaseModalProps) {
  const { data, onClose } = props;

  if (!data) return null;
  return (
    <CaseFormModal
      subType={data.subType}
      actualCase={{ ...data, name: "", propertyName: data.propertyName }}
      editChoose={false}
      open={!!data}
      onClose={() => onClose()}
      caseType={data.type}
      propertyData={data.propertyData}
      duplicate
    />
  );
}
