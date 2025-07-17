import { Header } from '@/components/landing-page/header';
import { HeroSection } from '@/components/landing-page/hero-section';
import { FeaturesSection } from '@/components/landing-page/feature-section';
import { CTASection } from '@/components/landing-page/cta-section';
import { TestimonialsSection } from '@/components/landing-page/testimonials-section';
import { Footer } from '@/components/landing-page/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>   
      <Footer />
    </div>
  );
}