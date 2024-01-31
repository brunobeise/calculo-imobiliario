import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface imovelDataError {
  message: string;
  title: string;
}

export function ErrorAlert(props: imovelDataError) {
  return (
    <Alert className="max-w-[600px] block" variant="destructive">
      <ExclamationTriangleIcon className="!text-white h-4 w-4" />
      <AlertTitle>{props.title}</AlertTitle>
      <AlertDescription>{props.message}</AlertDescription>
    </Alert>
  );
}
