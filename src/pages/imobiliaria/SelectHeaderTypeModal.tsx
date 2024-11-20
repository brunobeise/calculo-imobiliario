import UserSignature1 from "@/components/user/UserSignature1";
import UserSignature2 from "@/components/user/UserSignature2";
import UserSignature3 from "@/components/user/UserSignature3";
import {
  Button,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Modal,
  ModalDialog,
  Radio,
  RadioGroup,
} from "@mui/joy";

interface SelectHeaderTypeModalProps {
  open: boolean;
  onClose: () => void;
  value: number;
  setValue: (value: number) => void;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

export default function SelectHeaderTypeModal(
  props: SelectHeaderTypeModalProps
) {
  const { open, onClose, value, setValue } = props;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle className="flex items-center">
          Alterar layout do cabeçalho
        </DialogTitle>
        <Divider />
        <DialogContent>
          <RadioGroup
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          >
            <FormControl
              className="flex items-center"
              sx={{ p: 1, flexDirection: "row", gap: 2 }}
            >
              <Radio value={1} />
              <UserSignature1
                primaryColor={props.primaryColor}
                secondaryColor={props.secondaryColor}
                backgroundColor={props.backgroundColor}
              />
            </FormControl>
            <FormControl
              className="flex items-center"
              sx={{ p: 1, flexDirection: "row", gap: 2 }}
            >
              <Radio value={2} />
              <UserSignature2
                primaryColor={props.primaryColor}
                secondaryColor={props.secondaryColor}
                backgroundColor={props.backgroundColor}
              />
            </FormControl>
            <FormControl
              className="flex items-center"
              sx={{ p: 1, flexDirection: "row", gap: 2 }}
            >
              <Radio value={3} />
              <UserSignature3
                primaryColor={props.primaryColor}
                secondaryColor={props.secondaryColor}
                backgroundColor={props.backgroundColor}
              />
            </FormControl>
          </RadioGroup>
        </DialogContent>
        <div className="flex justify-center">
          <Button className="w-[100px]" variant="soft" onClick={onClose}>
            Pronto
          </Button>
        </div>
      </ModalDialog>
    </Modal>
  );
}
