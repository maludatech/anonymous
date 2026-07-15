import { Metadata } from "next";
import ContentSection from "@/components/ContentSection";
import Hero from "@/components/Hero";
import Footer from "@/components/shared/Footer";
import { APP_DESCRIPTION, APP_NAME, APP_SLOGAN } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} | ${APP_SLOGAN}`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ContentSection />
      <Footer />
    </main>
  );
}
