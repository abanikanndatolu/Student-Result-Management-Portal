import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ViewResults() {
  const { user } = useAuth();
  const { results, courses } = useData();
  const [selectedSemester, setSelectedSemester] = useState<string>('all');

  const studentResults = results.filter(r => r.studentId === user?.studentId);
  
  const semesters = ['all', ...new Set(studentResults.map(r => r.semester))];

  const filteredResults = selectedSemester === 'all'
    ? studentResults
    : studentResults.filter(r => r.semester === selectedSemester);

  const calculateSemesterGPA = (semester: string) => {
    const semesterResults = semester === 'all' 
      ? studentResults 
      : studentResults.filter(r => r.semester === semester);
    
    if (semesterResults.length === 0) return 0;
    
    return (semesterResults.reduce((acc, r) => acc + r.gpa, 0) / semesterResults.length).toFixed(2);
  };

  const handleDownload = () => {
    // Simulate PDF download
    toast.success('Results downloaded successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl mb-2">My Results</h2>
          <p className="text-muted-foreground">View and download your academic results</p>
        </div>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Overall GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{calculateSemesterGPA('all')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Courses Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{studentResults.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {studentResults.reduce((acc, r) => {
                const course = courses.find(c => c.id === r.courseId);
                return acc + (course?.credits || 0);
              }, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm">Filter by semester:</label>
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester === 'all' ? 'All Semesters' : semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSemester !== 'all' && (
          <div className="text-sm">
            Semester GPA: <span>{calculateSemesterGPA(selectedSemester)}</span>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No results available yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => {
                const course = courses.find(c => c.id === result.courseId);
                return (
                  <TableRow key={result.id}>
                    <TableCell>{course?.code || 'N/A'}</TableCell>
                    <TableCell>{course?.name || 'N/A'}</TableCell>
                    <TableCell>{result.semester}</TableCell>
                    <TableCell>{result.score}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                        result.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                        result.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {result.grade}
                      </span>
                    </TableCell>
                    <TableCell>{result.gpa.toFixed(2)}</TableCell>
                    <TableCell>{course?.credits || 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
