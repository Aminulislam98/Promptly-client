import { HeroBanner } from "@/components/home/HeroBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TopCreators } from "@/components/home/TopCreators";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FeaturedPrompts } from "@/components/home/FeaturedPrompts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BrowseByTool } from "@/components/home/BrowseByTool";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedPrompts />
      <HowItWorks />
      <WhyChooseUs />
      <BrowseByTool />
      <TopCreators />
      <CustomerReviews />
    </>
  );
}
