import { Loader2 } from "lucide-react";

export const Spinner = ({ otherStyles }: { otherStyles: string }) => {
  return (
    <Loader2 className={`text-lg text-white animate-spin ${otherStyles}`} />
  );
};
