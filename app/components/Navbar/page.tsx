'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('cover');

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const sections = ['cover', 'about', 'education', 'experience', 'contact'];
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
    { href: '#cover', label: 'Cover' },
    { href: '#about', label: 'About' },
    { href: '#education', label: 'Education' },
    { href: '#experience', label: 'My Work' },
    { href: '#contact', label: 'Contact' },
  ]
  
  return (
    <nav className="px-4 py-2 fixed w-full top-0 backdrop-blur-md z-50 border-b border-gray-200/20 hover:border-orange-600 transition-all transition-discrete duration-300">
      <div className="max-w-screen-xl mx-auto">
        <div className="md:hidden max-w-screen-xl items-center">
        <button onClick={toggleMenu} className="focus:outline-none" aria-label="Toggle menu">
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <RxCross1 />
          ) : (
            <RxHamburgerMenu />
          )}
        </button>
        {isOpen && (
          <ul className="flex flex-col mb-4 items-center justify-center gap-5 mt-4">
            {navItems.map((item) => (
              <li key={item.href} className={`px-24 py-1 hover:border-x hover:scale-105 hover:text-orange-500 ${activeSection === item.href.slice(1) ? 'text-orange-500 font-semibold border-x scale-105' : ''} transition-all duration-300`}>
                <Link href={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <ul className="hidden md:flex items-center justify-center gap-5 mx-auto border-transparent hover:border-orange-600 transition-all transition-discrete duration-300">
        {navItems.map((item) => (
          <li key={item.href} className={`px-12 py-1 hover:border-x hover:px-15 hover:scale-96 hover:text-orange-500 ${activeSection === item.href.slice(1) ? 'text-orange-500 font-semibold border-x px-15 scale-96' : ''} transition-all duration-300`}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      </div>
    </nav>
  )
}