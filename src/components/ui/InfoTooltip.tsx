import { Button, Tooltip } from "@mui/joy";
import { FaRegQuestionCircle } from "react-icons/fa";

const InfoTooltip = ({ text }: { text: string }) => {
  return (
    <Tooltip sx={{ maxWidth: "280px" }} size="md" title={text} arrow>
      <Button
        className="bg-transparent"
        sx={{
          backgroundColor: "transparent",
          color: "#909090",
          borderRadius: "50%",
          padding: "5px",
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <FaRegQuestionCircle />
      </Button>
    </Tooltip>
  );
};

export default InfoTooltip;
