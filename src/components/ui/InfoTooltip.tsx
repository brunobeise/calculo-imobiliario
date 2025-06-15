import { Tooltip } from "@mui/joy";
import { FaRegQuestionCircle } from "react-icons/fa";

const InfoTooltip = ({ text }: { text: string }) => {
  return (
    <Tooltip sx={{ maxWidth: "280px" }} size="md" title={text} arrow>
      <button
        className="bg-transparent ms-1"
        style={{
          color: "#909090",
          borderRadius: "50%",
          padding: "0",
        }}
      >
        <FaRegQuestionCircle />
      </button>
    </Tooltip>
  );
};

export default InfoTooltip;
