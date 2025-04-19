import HeroSection from '@/components/layout/HeroSection';
import FeaturedProperties from '@/components/properties/FeaturedProperties';
import WhyChooseUs from '@/components/layout/WhyChooseUs';
import Testimonials from '@/components/layout/Testimonials';
import CallToAction from '@/components/layout/CallToAction';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedProperties />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  );
}
