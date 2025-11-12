import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function CourseRegistration() {
  const { user } = useAuth();
  const { courses, registrations, addRegistration } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRegistered = (courseId: string) => {
    return registrations.some(
      r => r.courseId === courseId && r.studentId === user?.studentId
    );
  };

  const getRegistrationStatus = (courseId: string) => {
    const registration = registrations.find(
      r => r.courseId === courseId && r.studentId === user?.studentId
    );
    return registration?.status;
  };

  const handleRegister = (courseId: string) => {
    if (!user?.studentId) return;

    addRegistration({
      studentId: user.studentId,
      courseId,
      semester: 'Spring 2025',
      status: 'pending',
    });

    toast.success('Course registration submitted for approval');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Course Registration</h2>
        <p className="text-muted-foreground">Browse and register for available courses</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search courses by name, code, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No courses found
          </div>
        ) : (
          filteredCourses.map((course) => {
            const registered = isRegistered(course.id);
            const status = getRegistrationStatus(course.id);

            return (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <Badge variant="outline">{course.code}</Badge>
                    </div>
                    {registered && status && (
                      <Badge
                        variant={
                          status === 'approved' ? 'default' :
                          status === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {status}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span>{course.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits</span>
                      <span>{course.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Semester</span>
                      <span>{course.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instructor</span>
                      <span>{course.instructor}</span>
                    </div>
                  </div>

                  {registered ? (
                    <Button disabled className="w-full" variant="outline">
                      {status === 'pending' && (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Pending Approval
                        </>
                      )}
                      {status === 'approved' && 'Enrolled'}
                      {status === 'rejected' && 'Registration Rejected'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRegister(course.id)}
                      className="w-full"
                    >
                      Register
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
