import { HeroBanner } from "@/components/home/HeroBanner";
import { FeaturedPrompts } from "@/components/home/FeaturedPrompts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TopCreators } from "@/components/home/TopCreators";
import { CustomerReviews } from "@/components/home/CustomerReviews";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedPrompts />
      <WhyChooseUs />
      <TopCreators />
      <CustomerReviews />
    </>
  );
}
