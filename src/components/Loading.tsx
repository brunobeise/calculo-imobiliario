import Loading from "react-loading";

export default function GlobalLoading({
  text,
  hasDrawer,
}: {
  text?: string;
  hasDrawer?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[99999999999999999] flex items-center justify-center bg-black bg-opacity-25 pointer-events-none flex flex-col gap-4">
      <Loading
        className={hasDrawer ? "ms-64" : ""}
        type="spin"
        color={"#103759"}
        width={40}
        height={40}
      />
      {text && (
        <p className={hasDrawer ? "ms-64 font-bold" : " font-bold"}>{text}</p>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex flex-col gap-4 z-[10]">
      <Loading type="balls" color={"#103759"} width={40} height={40} />
    </div>
  );
}

export function Spinner() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loading type="balls" color={"#103759"} width={30} height={30} />
    </div>
  );
}

export function SpinnerCircular({ size = 30 }: { size: number }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loading type="spin" color={"#103759"} width={size} height={size} />
    </div>
  );
}
