'use client';

import { useState } from 'react';
import { Search, Plus, Map, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubcityFilters } from '@/components/superadmin/subcity-filters';
import { SubcityGrid } from '@/components/superadmin/subcity-grid';

export default function SubcitiesPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [viewType, setViewType] = useState('grid');

  return (
    <div className="container mx-auto w-full px-4 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('subCities')}</h1>
          <p className="text-muted-foreground">{t('manageSubCitiesDesc')}</p>
        </div>
        <Button className="w-full md:w-auto rounded-full">
          <Plus className="mr-2 h-4 w-4" /> {t('addSubCity')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchSubCities')}
            className="pl-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <SubcityFilters regionFilter={regionFilter} setRegionFilter={setRegionFilter} />
        <Tabs defaultValue={viewType} onValueChange={setViewType} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">
              <Building2 className="h-4 w-4 mr-2" />
              {t('grid')}
            </TabsTrigger>
            <TabsTrigger value="map">
              <Map className="h-4 w-4 mr-2" />
              {t('map')}
            </TabsTrigger>
          </TabsList>

          {/* Subcities Grid/Map View */}
          <TabsContent value="grid" className="mt-0">
            <div className="w-full">
              <SubcityGrid searchQuery={searchQuery} regionFilter={regionFilter} />
            </div>
          </TabsContent>

          {/* <TabsContent value="map" className="mt-0"> */}
          {/*   <Card className="overflow-hidden border-none shadow-md"> */}
          {/*     <CardHeader> */}
          {/*       <CardTitle>{t('subCitiesMap')}</CardTitle> */}
          {/*       <CardDescription>{t('subCitiesMapDesc')}</CardDescription> */}
          {/*     </CardHeader> */}
          {/*     <CardContent> */}
          {/*       <div className="aspect-[16/9] w-full rounded-md bg-muted/50 flex items-center justify-center"> */}
          {/*         <Map className="h-12 w-12 text-muted-foreground/50" /> */}
          {/*         <p className="ml-2 text-muted-foreground">{t('interactiveMapComingSoon')}</p> */}
          {/*       </div> */}
          {/*     </CardContent> */}
          {/*   </Card> */}
          {/* </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
