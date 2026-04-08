import {
  HeroSkeleton,
  HeatmapSkeleton,
  AboutSkeleton,
  SkillsSkeleton,
  ProjectsSkeleton,
  ExperienceSkeleton,
  ContactSkeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <HeatmapSkeleton />
      <AboutSkeleton />
      <SkillsSkeleton />
      <ProjectsSkeleton />
      <ExperienceSkeleton />
      <ContactSkeleton />
    </>
  );
}
