'use client';
import DirectorTable from '@/components/superadmin/organization/director-table';
import SectorTable from '@/components/superadmin/organization/sector-table';
import TeamTable from '@/components/superadmin/organization/team-table';
import { useOrganization } from '@/hooks/use-organization';

const Organization = () => {
  const { Sectors, Directors, Teams } = useOrganization();
  return (
    <div className="flex-col space-y-5 ">
      {' '}
      <SectorTable sectors={Sectors} />
      <DirectorTable directors={Directors} />
      <TeamTable teams={Teams} />
    </div>
  );
};

export default Organization;
