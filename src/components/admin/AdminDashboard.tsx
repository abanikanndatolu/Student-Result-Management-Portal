import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const { courses, results, registrations } = useData();

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Registrations',
      value: registrations.filter(r => r.status === 'pending').length,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Results Uploaded',
      value: results.length,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Average GPA',
      value: results.length > 0 
        ? (results.reduce((acc, r) => acc + r.gpa, 0) / results.length).toFixed(2)
        : '0.00',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Admin Dashboard</h2>
        <p className="text-muted-foreground">Overview of the student result management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registrations.slice(0, 5).map((reg) => {
                const course = courses.find(c => c.id === reg.courseId);
                return (
                  <div key={reg.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <div>
                      <p>{course?.name || 'Unknown Course'}</p>
                      <p className="text-sm text-muted-foreground">Student ID: {reg.studentId}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      reg.status === 'approved' ? 'bg-green-100 text-green-700' :
                      reg.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {reg.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                courses.reduce((acc, course) => {
                  acc[course.department] = (acc[course.department] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([dept, count]) => (
                <div key={dept}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{dept}</span>
                    <span className="text-sm">{count} courses</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(count / courses.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
