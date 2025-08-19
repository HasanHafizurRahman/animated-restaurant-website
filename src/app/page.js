import MenuSection from "@/components/MenuSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import ReserveSection from "@/components/ReserveSection";
import { TestimonialsSection } from "@/components/Testimonials";
import HeroMain from "@/components/Hero";
import FeaturedDishes from "@/components/FeaturedDishes";

export default function Home({testimonials}) {
  return (
    <>
      <HeroMain />
      <FeaturedDishes />
      <MenuSection />
      <GalleryCarousel />
      <ReserveSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
