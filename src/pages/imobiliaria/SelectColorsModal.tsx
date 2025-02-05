import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
  FormLabel,
  Input,
} from "@mui/joy";
import { useEffect, useState } from "react";

interface SelectHeaderTypeModalProps {
  open: boolean;
  onClose: () => void;
  value: number;
  setValue: (value: number) => void;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  onChangeColors: (colors: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  }) => void;
}

export default function SelectColorsModal(props: SelectHeaderTypeModalProps) {
  const {
    open,
    onClose,
    primaryColor,
    secondaryColor,
    backgroundColor,
    onChangeColors,
  } = props;

  const [localPrimaryColor, setLocalPrimaryColor] = useState(
    primaryColor || "#000000"
  );
  const [localSecondaryColor, setLocalSecondaryColor] = useState(
    secondaryColor || "#000000"
  );
  const [localBackgroundColor, setLocalBackgroundColor] = useState(
    backgroundColor || "#ffffff"
  );

  const handleSave = () => {
    onChangeColors({
      primaryColor: localPrimaryColor,
      secondaryColor: localSecondaryColor,
      backgroundColor: localBackgroundColor,
    });
    onClose();
  };

  useEffect(() => {
    setLocalPrimaryColor(primaryColor);
    setLocalSecondaryColor(secondaryColor);
    setLocalBackgroundColor(backgroundColor);
  }, [primaryColor, secondaryColor, backgroundColor]);

  return (
    <Modal className="" open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle className="flex items-center">
          Alterar cores da imobiliária
        </DialogTitle>
        <Divider />
        <DialogContent className="w-[500px] min-h-[400px]">
          <div className="grid grid-cols-3 gap-5 h-full">
            <div className="flex flex-col gap-4">
              <FormLabel>Cor Primária</FormLabel>
              <Input
                type="color"
                value={localPrimaryColor}
                onChange={(e) => setLocalPrimaryColor(e.target.value)}
              />

              <FormLabel>Cor Secundária</FormLabel>
              <Input
                type="color"
                value={localSecondaryColor}
                onChange={(e) => setLocalSecondaryColor(e.target.value)}
              />

              <FormLabel>Cor de Fundo</FormLabel>
              <Input
                type="color"
                value={localBackgroundColor}
                onChange={(e) => setLocalBackgroundColor(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto min-h-[400px] col-span-2">
              <div className="scale-[0.5] ">
                {/* <FinancingPlanningReportPreview
                  custom={{
                    headerType: 1,
                    primaryColor,
                    secondaryColor,
                    backgroundColor,
                  }}
                  propertyData={getInitialValues("/planejamentofinanciamento")}
                  caseData={calcCaseData(
                    getInitialValues("/planejamentofinanciamento")
                  )}
                  configData={{
                    mainPhoto:
                      "https://plantasdecasas.com/wp-content/uploads/2015/10/house_102_fix_800.jpg",
                    additionalPhotos: [],
                    description: "",
                    features: [],
                    propertyName: "Exemplo de Proposta",
                  
                    subType: "Simplificado",
                  }}
                /> */}
              </div>
            </div>
          </div>
        </DialogContent>
        <div className="flex justify-center">
          <Button className="w-[100px]" variant="soft" onClick={handleSave}>
            Pronto
          </Button>
        </div>
      </ModalDialog>
    </Modal>
  );
}
