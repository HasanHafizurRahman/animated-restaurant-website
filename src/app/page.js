import GalleryCarousel from "@/components/GalleryCarousel";
import HeroSpecials from "@/components/HeroSpecials";
import NavbarHero from "@/components/NavbarHero";

export default function Home() {
  return (
    <>
      <NavbarHero />
      <HeroSpecials />
      <GalleryCarousel />
    </>
  );
}
