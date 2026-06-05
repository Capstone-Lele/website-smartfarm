"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { LuLogIn, LuMenu, LuX } from "react-icons/lu";
import Image from "next/image";

const HomeNavbar = () => {
  const navItems = [
    { label: "Beranda", id: "beranda" },
    { label: "Profile", id: "profile" },
    { label: "Kolam", id: "kolam" },
    { label: "Populasi", id: "populasi" },
    { label: "Panen", id: "panen" },
  ];

  const [activeId, setActiveId] = useState("beranda");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentSection = navItems.find((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          return (
            window.scrollY >= offsetTop - 100 &&
            window.scrollY < offsetTop + offsetHeight - 100
          );
        }
        return false;
      });

      if (currentSection) {
        setActiveId(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Desktop & Tablet Navbar */}
      <nav className="bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("beranda")}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl  overflow-hidden">
                <Image
                  src="/android-chrome-192x192.png"
                  alt="Lele Farm Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="leading-tight text-left">
                <p className="text-sm font-semibold tracking-wide ">
                  Lele Farm
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  Desa Kebakalan
                </p>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center rounded-xl bg-slate-100 p-1 gap-0.5">
              {navItems.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    type="button"
                    className={`rounded-xl cursor-pointer px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Right: Login Button + Mobile Toggle */}
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button className="rounded-xl text-sm font-medium transition-all flex items-center pl-4 pr-1 py-1 cursor-pointer gap-2 bg-primary text-white hover:bg-primary/90">
                  <span>Login</span>
                  <div className=" p-1.5">
                    <LuLogIn className="text-sm" />
                  </div>
                </button>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <LuX className="text-xl" />
                ) : (
                  <LuMenu className="text-xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t border-slate-100 px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  type="button"
                  className={`w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HomeNavbar;
