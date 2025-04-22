import HeroSection from '@/components/layout/HeroSection';
import FeaturedProperties from '@/components/properties/FeaturedProperties';
import WhyChooseUs from '@/components/layout/WhyChooseUs';
import Testimonials from '@/components/layout/Testimonials';
import CallToAction from '@/components/layout/CallToAction';
import FeaturedBlogPosts from '@/components/blog/FeaturedBlogPosts';
import DeveloperPartners from '@/components/layout/DeveloperPartners';

export default function Home() {
  return (
    <>
      <HeroSection />
      <DeveloperPartners />
      <FeaturedProperties />
      <WhyChooseUs />
      <FeaturedBlogPosts />
      <Testimonials />
      <CallToAction />
    </>
  );
}
