import { useState } from 'react';
import { useData, Result } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Upload, Pencil, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ResultManagement() {
  const { results, courses, addResult, updateResult } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    semester: '',
    grade: '',
    score: 0,
    gpa: 0,
  });

  const gradeToGPA: Record<string, number> = {
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D': 1.0,
    'F': 0.0,
  };

  const filteredResults = results.filter(result =>
    result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resultData = {
      ...formData,
      gpa: gradeToGPA[formData.grade] || 0,
    };

    if (editingResult) {
      updateResult(editingResult.id, resultData);
      toast.success('Result updated successfully');
      setEditingResult(null);
    } else {
      addResult(resultData);
      toast.success('Result uploaded successfully');
      setIsUploadDialogOpen(false);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      courseId: '',
      semester: '',
      grade: '',
      score: 0,
      gpa: 0,
    });
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      studentId: result.studentId,
      courseId: result.courseId,
      semester: result.semester,
      grade: result.grade,
      score: result.score,
      gpa: result.gpa,
    });
  };

  const ResultForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          id="studentId"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          placeholder="STU2024001"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select
          value={formData.courseId}
          onValueChange={(value) => setFormData({ ...formData, courseId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Input
          id="semester"
          value={formData.semester}
          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
          placeholder="Fall 2024"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            type="number"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
            min="0"
            max="100"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Select
            value={formData.grade}
            onValueChange={(value) => setFormData({ ...formData, grade: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(gradeToGPA).map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade} ({gradeToGPA[grade]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsUploadDialogOpen(false);
            setEditingResult(null);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingResult ? 'Update Result' : 'Upload Result'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl mb-2">Result Management</h2>
          <p className="text-muted-foreground">Upload and manage student results</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Result</DialogTitle>
              <DialogDescription>Enter the result details below</DialogDescription>
            </DialogHeader>
            <ResultForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by student ID or semester..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>GPA</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((result) => {
                const course = courses.find(c => c.id === result.courseId);
                return (
                  <TableRow key={result.id}>
                    <TableCell>{result.studentId}</TableCell>
                    <TableCell>{course?.code || 'N/A'}</TableCell>
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(result)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingResult} onOpenChange={(open) => !open && setEditingResult(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Result</DialogTitle>
            <DialogDescription>Update the result details</DialogDescription>
          </DialogHeader>
          <ResultForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
