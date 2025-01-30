import Button from "@mui/joy/Button";
import DialogActions from "@mui/joy/DialogActions";
import { IoWarning } from "react-icons/io5";
import Dialog from "./Dialog";

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
    <Dialog
      actions={
        <>
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
        </>
      }
      title={
        <div className="items-center flex gap-2">
          {" "}
          <IoWarning />
          {title ?? "Confirmação"}
        </div>
      }
      open={open}
      onClose={onClose}
    >
      <div className="w-[420px] flex justify-center">{content} </div>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
