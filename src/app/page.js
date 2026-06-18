import { HeroBanner } from "@/components/home/HeroBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TopCreators } from "@/components/home/TopCreators";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FeaturedPrompts } from "@/components/home/FeaturedPrompts";

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
