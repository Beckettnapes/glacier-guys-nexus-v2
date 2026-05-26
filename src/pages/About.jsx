import HeroSection from "../components/about/HeroSection";
import MissionStatement from "../components/about/MissionStatement";
import Timeline from "../components/about/Timeline";
import ValuesSection from "../components/about/ValuesSection";

export default function About() {
  return (
    <div>
      <HeroSection />
      <MissionStatement />
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      <Timeline />
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
      <ValuesSection />
      {/* Footer */}
      <footer className="py-16 px-6 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Glacier Guys. All rights reserved.
        </p>
      </footer>
    </div>
  );
}