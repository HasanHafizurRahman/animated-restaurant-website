import HeroSpecials from "@/components/HeroSpecials";
import MenuSection from "@/components/MenuSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import ReserveSection from "@/components/ReserveSection";
import { TestimonialsSection } from "@/components/Testimonials";
import HeroMain from "@/components/Hero";

export default function Home({testimonials}) {
  return (
    <>
      <HeroMain />
      <HeroSpecials />
      <MenuSection />
      <GalleryCarousel />
      <ReserveSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
