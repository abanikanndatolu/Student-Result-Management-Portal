import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, FileCheck, Clock, TrendingUp } from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const { results, registrations, courses } = useData();

  const studentResults = results.filter(r => r.studentId === user?.studentId);
  const studentRegistrations = registrations.filter(r => r.studentId === user?.studentId);
  
  const averageGPA = studentResults.length > 0
    ? (studentResults.reduce((acc, r) => acc + r.gpa, 0) / studentResults.length).toFixed(2)
    : '0.00';

  const stats = [
    {
      title: 'Enrolled Courses',
      value: studentRegistrations.filter(r => r.status === 'approved').length,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed Courses',
      value: studentResults.length,
      icon: FileCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Approvals',
      value: studentRegistrations.filter(r => r.status === 'pending').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Current GPA',
      value: averageGPA,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Welcome back, {user?.name}!</h2>
        <p className="text-muted-foreground">
          {user?.studentId} • {user?.department} • Semester {user?.semester}
        </p>
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
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            {studentResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No results available yet</p>
            ) : (
              <div className="space-y-4">
                {studentResults.slice(0, 5).map((result) => {
                  const course = courses.find(c => c.id === result.courseId);
                  return (
                    <div key={result.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <div>
                        <div>{course?.code}</div>
                        <div className="text-sm text-muted-foreground">{result.semester}</div>
                      </div>
                      <div className="text-right">
                        <div className={`px-2 py-1 rounded text-xs ${
                          result.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                          result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                          result.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {result.grade}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">GPA: {result.gpa}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {studentRegistrations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No registrations yet</p>
            ) : (
              <div className="space-y-4">
                {studentRegistrations.map((reg) => {
                  const course = courses.find(c => c.id === reg.courseId);
                  return (
                    <div key={reg.id} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <div>
                        <div>{course?.code}</div>
                        <div className="text-sm text-muted-foreground">{course?.name}</div>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
