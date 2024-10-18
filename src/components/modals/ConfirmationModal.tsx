import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { IoWarning } from "react-icons/io5";

interface ConfirmationModalProps {
  content: string;
  title?: string;
  open: boolean;
  onClose: () => void;
  onOk: () => void;
  okLoading?: boolean;
  yesText?: string;
  noText?: string;
}

export default function ConfirmationModal({
  title,
  content,
  onOk,
  onClose,
  open,
  okLoading,
  yesText,
  noText,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle className="flex items-center">
          <IoWarning />
          {title ?? "Confirmação"}
        </DialogTitle>
        <Divider />
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button
            loading={okLoading}
            variant="solid"
            color="primary"
            onClick={onOk}
          >
            {yesText || "Sim"}
          </Button>
          <Button variant="plain" color="neutral" onClick={onClose}>
            {noText || "Não"}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
