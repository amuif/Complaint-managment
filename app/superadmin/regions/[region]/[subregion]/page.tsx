import { SubregionDetails } from '@/components/subregion-details';

export default function RegionPage({ params }: { params: { region: string; subregion: string } }) {
  return (
    <div className="h-full w-full">
      <SubregionDetails region={params.region} subregion={params.subregion} />
    </div>
  );
}
