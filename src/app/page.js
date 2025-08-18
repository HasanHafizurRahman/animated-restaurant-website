import GalleryCarousel from "@/components/GalleryCarousel";
import HeroSpecials from "@/components/HeroSpecials";
import NavbarHero from "@/components/NavbarHero";
import ReserveSection from "@/components/ReserveSection";

export default function Home() {
  return (
    <>
      <NavbarHero />
      <HeroSpecials />
      <GalleryCarousel />
      <ReserveSection />
    </>
  );
}
