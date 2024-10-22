import { Alert, Typography } from "@mui/joy";
import { IoWarning } from "react-icons/io5";

export interface propertyDataError {
  message: string;
  title: string;
}

export default function ErrorAlert(props: propertyDataError) {
  return (
    <Alert
      startDecorator={<IoWarning size="30px" />}
      variant="soft"
      color="danger"
      sx={{
        padding: "2rem",
      }}
    >
      <div>
        <Typography level="body-md" color={"danger"}>
          {props.title}
        </Typography>
        <Typography level="body-sm" color={"danger"}>
          {props.message}
        </Typography>
      </div>
    </Alert>
  );
}
