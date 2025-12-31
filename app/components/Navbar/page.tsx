"use client";

import ProgressBar from "@/components/ProgressBar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  progress?: number;
}

export default function Navbar({ progress }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("cover");
  const [isDark, setIsDark] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const sections = ["cover", "about", "education", "experience", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { href: "#cover", label: "Cover" },
    { href: "#about", label: "About" },
    { href: "#education", label: "Education" },
    { href: "#experience", label: "My Work" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="px-4 py-2 fixed w-full top-0 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <RxCross1 /> : <RxHamburgerMenu />}
          </button>
          {isOpen && (
            <ul className="flex flex-col mb-4 items-center justify-center gap-5 mt-4">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className={`px-24 py-1 hover:border-x hover:border-primary hover:scale-105 hover:text-primary ${
                    activeSection === item.href.slice(1)
                      ? "text-primary font-semibold border-x border-primary scale-105"
                      : ""
                  } transition-all duration-300`}
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ul className="hidden md:flex items-center justify-center gap-5 mx-auto">
          {navItems.map((item) => (
            <li
              key={item.href}
              className={`px-12 py-1 hover:border-x hover:border-primary hover:px-15 hover:scale-96 hover:text-primary ${
                activeSection === item.href.slice(1)
                  ? "text-primary font-semibold border-x border-primary px-15 scale-96"
                  : ""
              } transition-all duration-300`}
            >
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          <Switch checked={isDark} onCheckedChange={setIsDark} />
          <Moon className="w-4 h-4" />
        </div>

        <div className="w-full h-1 bg-border hidden md:block absolute bottom-0 left-0">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress || 0}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
