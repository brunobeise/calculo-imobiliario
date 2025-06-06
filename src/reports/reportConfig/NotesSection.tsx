import { useEffect, useRef, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import _ from "lodash";
import { FormLabel } from "@mui/joy";
import { Proposal } from "@/types/proposalTypes";

interface NotesSectionProps {
  proposal: Proposal;
  onChange: (data: Proposal) => void;
}

export default function NotesSection({
  proposal,
  onChange,
}: NotesSectionProps) {
  const [html, setHtml] = useState(
    proposal.reportConfig?.paymentConditionsDescription || ""
  );

  useEffect(() => {
    setHtml(proposal.reportConfig?.paymentConditionsDescription || "");
  }, [proposal.reportConfig?.paymentConditionsDescription]);

  const debouncedOnChange = useRef(
    _.debounce((html: string) => {
      onChange({
        ...proposal,
        reportConfig: {
          ...proposal.reportConfig,
          paymentConditionsDescription: html,
        },
      });
    }, 500)
  ).current;

  const handleEditorUpdate = (newHtml: string) => {
    setHtml(newHtml);
    debouncedOnChange(newHtml);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <h5 className="text-xl font-bold mb-5">Notas</h5>

        <FormLabel>Condição de pagamento:</FormLabel>
        <SimpleEditor content={html} onUpdate={handleEditorUpdate} />
      </div>
    </div>
  );
}
