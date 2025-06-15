import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@mui/joy";
import { FaSave } from "react-icons/fa";

interface FloatingSaveButtonProps {
  isVisible: boolean;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FloatingSaveButton({
  isVisible,
  onClick,
  loading = false,
  disabled = false,
  size = "lg",
  className = "",
}: FloatingSaveButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 z-50 w-full flex justify-center ${className}`}
        >
          <Button
            endDecorator={<FaSave />}
            onClick={onClick}
            type="button"
            loading={loading}
            size={size}
            disabled={disabled}
            className="outline outline-2 outline-whitefull"
          >
            Salvar Alterações
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
