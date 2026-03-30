import HomeCTA from "@/components/home/CTA";
import HomeFooter from "@/components/home/Footer";
import HomeHeader from "@/components/home/Header";
import HomeKolam from "@/components/home/Kolam";
import HomePanen from "@/components/home/Panen";
import HomePopulasi from "@/components/home/Populasi";
import HomeProfile from "@/components/home/Profile";
import HomeNavbar from "@/components/navigation/HomeNavbar";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <main>
      <HomeNavbar />
      <HomeHeader />
      <HomeProfile />
      <HomeKolam />
      <HomePopulasi />
      <HomePanen />
      <HomeCTA />
      <HomeFooter />
    </main>
    </>
  );
}
