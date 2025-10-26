import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, Award } from "lucide-react";

/**
 * Department Head Dashboard
 */
export default function DepartmentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee your department's performance and manage resources
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">Across all levels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">+5% from last semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium">New teacher onboarded</div>
                <div className="text-muted-foreground">Sarah Johnson joined the team</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Curriculum update</div>
                <div className="text-muted-foreground">Level 3 materials revised</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Performance review completed</div>
                <div className="text-muted-foreground">Q2 assessments finalized</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Important deadlines and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-medium">Department meeting</div>
                <div className="text-muted-foreground">Tomorrow at 2:00 PM</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Budget review</div>
                <div className="text-muted-foreground">Friday, Dec 15</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Teacher evaluations due</div>
                <div className="text-muted-foreground">Dec 20</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}