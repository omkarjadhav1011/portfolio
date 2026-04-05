import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import {
  ProjectsSkeleton,
  SkillsSkeleton,
  ExperienceSkeleton,
} from "@/components/ui/Skeleton";

const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection").then((m) => m.SkillsSection),
  { loading: () => <SkillsSkeleton />, ssr: false }
);

const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection").then((m) => m.ProjectsSection),
  { loading: () => <ProjectsSkeleton />, ssr: false }
);

const ExperienceSection = dynamic(
  () => import("@/components/sections/ExperienceSection").then((m) => m.ExperienceSection),
  { loading: () => <ExperienceSkeleton />, ssr: false }
);

const ContactSection = dynamic(
  () => import("@/components/sections/ContactSection").then((m) => m.ContactSection),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
