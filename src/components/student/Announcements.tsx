import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, Info, AlertTriangle, Megaphone } from 'lucide-react';
import { Announcement } from '../../contexts/DataContext';

export function Announcements() {
  const { announcements } = useData();

  const getPriorityIcon = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <Info className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Announcement['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Announcements</h2>
        <p className="text-muted-foreground">Stay updated with latest news and notices</p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No announcements at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3>{announcement.title}</h3>
                      <Badge variant={getPriorityColor(announcement.priority)} className="flex items-center gap-1">
                        {getPriorityIcon(announcement.priority)}
                        {announcement.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {announcement.author} • {new Date(announcement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
