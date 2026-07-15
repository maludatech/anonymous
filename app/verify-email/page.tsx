import { Metadata } from "next";
import VerifyEmailStatus from "@/components/VerifyEmailStatus";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default function Page() {
  return <VerifyEmailStatus />;
}
