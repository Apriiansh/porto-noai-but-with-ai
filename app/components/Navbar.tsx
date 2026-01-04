"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
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
    const sections = ["cover", "about", "education", "projects", "contact"];
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
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="px-4 py-2 fixed w-full top-0 backdrop-blur-md z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center relative">
          <ul className="flex items-center justify-center gap-3 lg:gap-5">
            {navItems.map((item) => (
              <li
                key={item.href}
                className={`px-6 lg:px-12 py-1 hover:border-x hover:border-primary hover:text-primary ${
                  activeSection === item.href.slice(1)
                    ? "text-primary font-semibold border-x border-primary"
                    : ""
                } transition-all duration-300`}
              >
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          <div className="absolute right-0 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <Moon className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <RxCross1 size={24} /> : <RxHamburgerMenu size={24} />}
            </button>
          </div>

          {isOpen && (
            <div className="flex flex-col items-center w-full mt-4 space-y-4">
              <ul className="flex flex-col items-center justify-center gap-5 w-full">
                {navItems.map((item) => (
                  <li
                    key={item.href}
                    className={`px-8 sm:px-12 py-1 hover:border-x hover:border-primary hover:scale-105 hover:text-primary ${
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

              {/* Theme Switch - Di bawah menu */}
              <div className="flex items-center gap-2 pb-4">
                <Sun className="w-4 h-4" />
                <button
                  onClick={() => setIsDark(!isDark)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Moon className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
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