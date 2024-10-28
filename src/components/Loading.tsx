import Loading from "react-loading";

export default function GlobalLoading({
  text,
  hasDrawer,
}: {
  text?: string;
  hasDrawer?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 pointer-events-none flex flex-col gap-4">
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

export function Spinner() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Loading type="spin" color={"#103759"} width={30} height={30} />
    </div>
  );
}
