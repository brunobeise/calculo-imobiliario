import { useEffect, useRef, useState } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { ReportData } from "../ReportPreview";
import _ from "lodash"; // ou você pode usar um custom debounce
import { FormLabel } from "@mui/joy";

interface NotesSectionProps {
  configData: ReportData;
  onChange: (data: ReportData) => void;
}

export default function NotesSection({
  configData,
  onChange,
}: NotesSectionProps) {
  const [html, setHtml] = useState(
    configData.reportConfig?.paymentConditionsDescription || ""
  );

  // Atualiza localmente quando o config externo mudar
  useEffect(() => {
    setHtml(configData.reportConfig?.paymentConditionsDescription || "");
  }, [configData.reportConfig?.paymentConditionsDescription]);

  // Debounce do envio para o pai (evita lag por atualização imediata)
  const debouncedOnChange = useRef(
    _.debounce((html: string) => {
      onChange({
        ...configData,
        reportConfig: {
          ...configData.reportConfig,
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
    <div className="flex flex-col gap-4">
      <h5 className="text-xl font-bold text-blue-900 mb-5">Notas</h5>

      <FormLabel>Condição de pagamento:</FormLabel>
      <SimpleEditor content={html} onUpdate={handleEditorUpdate} />
    </div>
  );
}
