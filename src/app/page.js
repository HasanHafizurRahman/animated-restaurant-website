import NavbarHero from "@/components/NavbarHero";
import HeroSpecials from "@/components/HeroSpecials";
import MenuSection from "@/components/MenuSection";
import GalleryCarousel from "@/components/GalleryCarousel";
import ReserveSection from "@/components/ReserveSection";

export default function Home() {
  return (
    <>
      <NavbarHero />
      <HeroSpecials />
      <MenuSection />
      <GalleryCarousel />
      <ReserveSection />
    </>
  );
}
