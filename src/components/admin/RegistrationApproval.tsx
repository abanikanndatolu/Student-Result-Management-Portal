import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Check, X, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function RegistrationApproval() {
  const { registrations, courses, updateRegistration } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRegistrations = registrations.filter(reg =>
    reg.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    updateRegistration(id, 'approved');
    toast.success('Registration approved');
  };

  const handleReject = (id: string) => {
    updateRegistration(id, 'rejected');
    toast.error('Registration rejected');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Course Registration Approvals</h2>
        <p className="text-muted-foreground">Review and approve student course registrations</p>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No registrations found
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((registration) => {
                const course = courses.find(c => c.id === registration.courseId);
                return (
                  <TableRow key={registration.id}>
                    <TableCell>{registration.studentId}</TableCell>
                    <TableCell>
                      <div>
                        <div>{course?.code}</div>
                        <div className="text-sm text-muted-foreground">{course?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{registration.semester}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          registration.status === 'approved' ? 'default' :
                          registration.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {registration.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(registration.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(registration.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
