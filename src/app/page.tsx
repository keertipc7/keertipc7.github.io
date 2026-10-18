import { getExperiences, getLeadership, getProfile, getProjects, getResearch } from '@/lib/api';
import HomeClient from '@/components/HomeClient';

export default function Home() {
  return (
    <HomeClient
      profile={getProfile()}
      experiences={getExperiences()}
      projects={getProjects()}
      research={getResearch()}
      leadership={getLeadership()}
    />
  );
}
