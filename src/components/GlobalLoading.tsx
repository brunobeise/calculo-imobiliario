import Loading from "react-loading";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-25 pointer-events-none">
      <Loading type="spin" color={"#103759"} width={50} height={50} />
    </div>
  );
}
