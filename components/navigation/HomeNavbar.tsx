"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BsSendFill } from "react-icons/bs";
import { LuLogIn } from "react-icons/lu";

const HomeNavbar = () => {
  const navItems = [
    { label: "Beranda", id: "beranda" },
    { label: "Profile", id: "profile" },
    { label: "Kolam", id: "kolam" },
    { label: "Populasi", id: "populasi" },
    { label: "Panen", id: "panen" },
  ];

  const [activeId, setActiveId] = useState("beranda");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Find the current section
      const currentSection = navItems.find((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          // You can adjust the offset condition depends on the height of your navbar
          return (
            scrollPosition >= offsetTop - 100 &&
            scrollPosition < offsetTop + offsetHeight - 100
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
  }, [navItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Adjust offset based on navbar height
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="fixed top-0 z-50 w-full">
      <nav className="mt-2">
        <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <h1 className="text-2xl font-semibold text-slate-700">
                  Lele Farm
                </h1>
              </div>
            </div>
            <div className="flex items-center rounded-full bg-slate-100/30 p-1 gap-1 backdrop-blur">
              {navItems.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.id)}
                    type="button"
                    className={`rounded-full cursor-pointer px-5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-surface text-slate-900"
                        : "text-slate-600 hover:bg-white/70"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <Link href="/login" className="flex items-center">
              <button className="rounded-full bg-primary-surface text-sm font-medium text-slate-700 transition-colors hover:bg-primary-surface/90 flex items-center pl-3 pr-1 py-1 cursor-pointer">
                Login
                <div className="bg-primary text-white rounded-full p-2 ml-2">
                  <LuLogIn />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
};

export default HomeNavbar;
