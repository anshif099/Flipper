import ContactSection from "@/components/ContactSection";
import EdtechCTABanner from "@/components/EdtechCTABanner";
import ExamplesSection from "@/components/ExamplesSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import FeaturesSection from "@/components/FeaturesSection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";


const Index = () => {
  return (
    <>
      <Header />
      <Hero />
      <FeaturesSection />
      <ExamplesSection />
      <FeaturesGrid />
      <EdtechCTABanner  />
      <ContactSection />
    </>
  );
};

export default Index;
