import NavbarHero from "@/components/NavbarHero";
import HeroSpecials from "@/components/HeroSpecials";
import MenuSection from "@/components/MenuSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import ReserveSection from "@/components/ReserveSection";
import { TestimonialsSection } from "@/components/Testimonials";

export default function Home({testimonials}) {
  return (
    <>
      <NavbarHero />
      <HeroSpecials />
      <MenuSection />
      <GalleryCarousel />
      <ReserveSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
