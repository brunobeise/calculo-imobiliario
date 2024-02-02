import { Separator } from "@/components/ui/separator";

export default function TypographyH3({ text }: { text: string }) {
  return (
    <>
      <Separator />
      <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {text}
      </h3>
    </>
  );
}
