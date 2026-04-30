import React, { useEffect } from "react";
import "./LandingPage.scss";
import FinalCTA from "./FinalCTA";
import NavBar from "./Navbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import MissingSection from "./MissingSection";
import SheltersSection from "./SheltersSection";
import DonationsSection from "./DonationsSection";
import WeatherSection from "./WeatherSection";
import StoriesSection from "./StoriesSection";
import PreventionSection from "./PreventionSection";
import Footer from "./Footer";

export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  lastSeen: string;
  description: string;
  photo?: string;
  status: "missing" | "found";
  contact: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  status: "open" | "closed" | "full";
  capacity: number;
  occupancy: number;
  phone: string;
  needs: string[];
  coordinates: { lat: number; lng: number };
}

export interface Supply {
  id: string;
  name: string;
  category: string;
  urgency: "critical" | "high" | "medium";
  shelter: string;
  distance: string;
}

export interface Story {
  id: string;
  name: string;
  location: string;
  quote: string;
  detail: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: "extreme" | "severe" | "moderate";
  area: string;
  issued: string;
}

export default function LandingPage() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const href = (a as HTMLAnchorElement).getAttribute("href");
        if (href && href !== "#") {
          e.preventDefault();
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }, []);

  return (
    <div className="landing">
      <NavBar />
      <HeroSection />
      <AboutSection />
      <MissingSection />
      <SheltersSection />
      <DonationsSection />
      <WeatherSection />
      <StoriesSection />
      <PreventionSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};
