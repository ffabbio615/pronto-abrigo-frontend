import { useEffect } from "react";
import "./LandingPage.scss";
import useStore from '../../store/useStore';
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
  shelter_id: number;
  type: "person" | "animal";
  name: string;
  estimated_age: number | null;
  species: string | null;
  breed: string | null;
  description: string;
  status: "in_shelter" | "looking_for_family" | "reunited" | "released";
  photo_url: string | null;
  created_at: string;
};

export interface Shelter {
    id: string;
    name: string;
    nickname: string;
    description: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    type: "human" | "animal";
    status: "open" | "full" | "closed";
    capacity: number;
    current_occupancy: number;
    photo_url: string | null;
};

export interface Supply {
  shelter_id: number;
  shelter_name: string;
  shelter_address: string;
  distance: number;
  items: {
    id: number;
    name: string;
    current: number;
    needed: number;
    ideal: number;
  }[];
};

export interface Donation {
    id: number;
    name: string;
    current: number;
    needed: number;
    ideal: number;
};

export interface Story {
  id: string;
  name: string;
  location: string;
  quote: string;
  detail: string;
};

export interface WeatherAlert {
  id: string;
  title: string;
  severity: string;
  number: string | number;
  issued: string;
};

export default function LandingPage() {

  const { setLoader } = useStore();
  
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  }, [setLoader]);

  // useEffect(() => {
  //   document.querySelectorAll('a[href^="#"]').forEach(a => {
  //     a.addEventListener("click", (e) => {
  //       const href = (a as HTMLAnchorElement).getAttribute("href");
  //       if (href && href !== "#") {
  //         e.preventDefault();
  //         document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  //       }
  //     });
  //   });
  // }, []);

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
