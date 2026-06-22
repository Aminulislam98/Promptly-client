export const metadata = {
  title: "Promptly — AI Prompt Marketplace",
  description:
    "Discover, share and copy AI prompts for ChatGPT, Claude, Midjourney, Gemini and more.",
};

import { HeroBanner } from "@/components/home/HeroBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TopCreators } from "@/components/home/TopCreators";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { FeaturedPrompts } from "@/components/home/FeaturedPrompts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BrowseByTool } from "@/components/home/BrowseByTool";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { TrendingPrompts } from "@/components/home/TrendingPrompts";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedPrompts />
      <RecentlyViewed />
      <TrendingPrompts />
      <BrowseByTool />
      <TopCreators />
      <HowItWorks />
      <WhyChooseUs />
      <CustomerReviews />
    </>
  );
}
