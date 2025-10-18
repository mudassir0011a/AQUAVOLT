export interface TimelineEvent {
  status: string;
  time: string;
  completed: boolean;
}

export interface Complaint {
  id: string;
  userId: string;
  type: 'water' | 'electricity';
  issue: string;
  status: 'in-progress' | 'resolved' | 'pending';
  location: string;
  reportedAt: string;
  timeline: TimelineEvent[];
  assignedTeam: string;
  estimatedResolution: string;
  hasPhoto?: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO string format 'YYYY-MM-DD'
  assignedTo: string; // Technician ID
  complaintId: string; // Link to a complaint
}

export interface Announcement {
  id: string;
  type: 'Water' | 'Power' | 'Civic' | 'Health';
  title: string;
  date: string;
  description: string;
}
