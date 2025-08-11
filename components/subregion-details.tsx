'use client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

const regionsData = {
  'addis-ababa': {
    subRegions: ['Arada', 'Kirkos', 'Lideta', 'Bole'],
    totalComplaints: 150,
    resolvedComplaints: 120,
    averageRating: 4.2,
    recentComplaints: [
      { id: 1, title: 'Service Delay', rating: 4, status: 'Resolved' },
      { id: 2, title: 'Network Issue', rating: 3, status: 'In Progress' },
      { id: 3, title: 'Billing Problem', rating: 5, status: 'Resolved' },
    ],
    employeeStats: {
      totalEmployees: 45,
      averagePerformance: 4.3,
      topPerformers: 12,
      trainingNeeded: 5,
    },
    officeInfo: {
      address: 'Bole Road, Addis Ababa',
      contactNumber: '+251 11 123 4567',
      email: 'addis.office@company.com',
      workingHours: '8:00 AM - 5:00 PM',
    },
  },
  'dire-dawa': {
    subRegions: ['Sabian', 'Gende Kore'],
    totalComplaints: 80,
    resolvedComplaints: 65,
    averageRating: 4.0,
    recentComplaints: [
      { id: 1, title: 'Connection Problem', rating: 4, status: 'Resolved' },
      { id: 2, title: 'Service Quality', rating: 3, status: 'In Progress' },
    ],
    employeeStats: {
      totalEmployees: 30,
      averagePerformance: 4.0,
      topPerformers: 7,
      trainingNeeded: 4,
    },
    officeInfo: {
      address: 'Dire Dawa Main Road, Dire Dawa',
      contactNumber: '+251 25 111 2233',
      email: 'diredawa.office@company.com',
      workingHours: '8:00 AM - 5:00 PM',
    },
  },
};

const mockFeedback = [
  { id: 1, user: 'John Doe', comment: 'Great service!', date: '2024-06-01' },
  {
    id: 2,
    user: 'Jane Smith',
    comment: 'Needs improvement.',
    date: '2024-06-02',
  },
];
const mockRatings = [
  { id: 1, user: 'John Doe', rating: 5, date: '2024-06-01' },
  { id: 2, user: 'Jane Smith', rating: 3, date: '2024-06-02' },
];

export function SubregionDetails({ region, subregion }: { region: string; subregion: string }) {
  const regionKey = region.toLowerCase();
  const subregionName = subregion.replace(/-/g, ' ');
  const data = regionsData[regionKey];

  if (!data) {
    return <div className="p-6">Region not found.</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h1 className="mb-6 text-3xl font-bold">{subregionName}</h1>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalComplaints}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.resolvedComplaints}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.averageRating}/5</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Employee Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Employees:</span>
                    <span className="font-medium">{data.employeeStats.totalEmployees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Performance:</span>
                    <span className="font-medium">{data.employeeStats.averagePerformance}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Performers:</span>
                    <span className="font-medium">{data.employeeStats.topPerformers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Training Needed:</span>
                    <span className="font-medium">{data.employeeStats.trainingNeeded}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="font-medium">{data.officeInfo.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-medium">{data.officeInfo.contactNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{data.officeInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Working Hours:</span>
                    <span className="font-medium">{data.officeInfo.workingHours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Complaints Tab */}
        <TabsContent value="complaints">
          <Card>
            <CardHeader>
              <CardTitle>Complaints - {subregionName}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {data.recentComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Rating: {complaint.rating}/5
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-2 py-1 text-xs ${
                          complaint.status === 'Resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {complaint.status}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Feedback - {subregionName}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mockFeedback.map((fb) => (
                    <div key={fb.id} className="rounded-lg border p-4">
                      <div className="flex justify-between">
                        <span className="font-medium">{fb.user}</span>
                        <span className="text-xs text-muted-foreground">{fb.date}</span>
                      </div>
                      <p className="mt-2">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Ratings - {subregionName}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mockRatings.map((rating) => (
                    <div
                      key={rating.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <span className="font-medium">{rating.user}</span>
                        <span className="ml-2 text-yellow-500">{'★'.repeat(rating.rating)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{rating.date}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
