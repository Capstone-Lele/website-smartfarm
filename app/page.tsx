"use client";
import HomeCTA from "@/components/home/CTA";
import HomeFooter from "@/components/home/Footer";
import HomeHeader from "@/components/home/Header";
import HomeKolam from "@/components/home/Kolam";
import HomePanen from "@/components/home/Panen";
import HomePopulasi from "@/components/home/Populasi";
import HomeProfile from "@/components/home/Profile";
import HomeSummaryKeuangan from "@/components/home/summary-keuangan";
import HomeNavbar from "@/components/navigation/HomeNavbar";
import { Input } from "@/components/ui/input";
import { useGeneralInfo } from "@/lib/api/service/guest/useGuest";
import Image from "next/image";

export default function Home() {
  const { data: dataGuest, isLoading: isLoadingGuest } = useGeneralInfo();

  return (
    <>
      <main>
        <HomeNavbar />
        <HomeHeader data={dataGuest} />
        <HomeProfile />
        <HomeKolam data={dataGuest} />
        <HomePopulasi data={dataGuest} />
        <HomePanen data={dataGuest} />
        <HomeSummaryKeuangan />
        <HomeCTA />
        <HomeFooter />
      </main>
    </>
  );
}
