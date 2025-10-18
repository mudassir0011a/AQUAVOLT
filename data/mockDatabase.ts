import type { Complaint, Announcement } from '../types';

export const MOCK_DB: Record<string, Complaint> = {
    'WTR-2025-001': {
        id: 'WTR-2025-001',
        userId: '1234567890',
        type: 'water',
        issue: 'Water leakage at main pipeline',
        status: 'in-progress',
        location: 'Sector 15, Vashi',
        reportedAt: '2025-01-15 10:30 AM',
        timeline: [
            { status: 'Reported', time: '2025-01-15 10:30 AM', completed: true },
            { status: 'Acknowledged', time: '2025-01-15 10:45 AM', completed: true },
            { status: 'Team Assigned', time: '2025-01-15 11:15 AM', completed: true },
            { status: 'In Progress', time: '2025-01-15 12:00 PM', completed: true },
            { status: 'Resolved', time: 'Expected: Today 6:00 PM', completed: false },
        ],
        assignedTeam: 'Water Works Team A',
        estimatedResolution: '6 hours',
        hasPhoto: true,
    },
    'ELC-2025-045': {
        id: 'ELC-2025-045',
        userId: '1234567890',
        type: 'electricity',
        issue: 'Frequent power cuts in the area',
        status: 'resolved',
        location: 'Seawoods, Nerul',
        reportedAt: '2025-01-14 08:00 PM',
        timeline: [
            { status: 'Reported', time: '2025-01-14 08:00 PM', completed: true },
            { status: 'Acknowledged', time: '2025-01-14 08:10 PM', completed: true },
            { status: 'Team Assigned', time: '2025-01-14 09:00 PM', completed: true },
            { status: 'In Progress', time: '2025-01-14 10:30 PM', completed: true },
            { status: 'Resolved', time: '2025-01-15 01:30 AM', completed: true },
        ],
        assignedTeam: 'MSEDCL Sector 5 Team',
        estimatedResolution: '4 hours',
    },
    'WTR-2025-002': {
        id: 'WTR-2025-002',
        userId: '9876543210',
        type: 'water',
        issue: 'No water supply in building',
        status: 'pending',
        location: 'Sector 5, Sanpada',
        reportedAt: '2025-01-16 09:00 AM',
        timeline: [
            { status: 'Reported', time: '2025-01-16 09:00 AM', completed: true },
            { status: 'Acknowledged', time: 'Pending', completed: false },
            { status: 'Team Assigned', time: 'Pending', completed: false },
            { status: 'In Progress', time: 'Pending', completed: false },
            { status: 'Resolved', time: 'Pending', completed: false },
        ],
        assignedTeam: 'Awaiting Assignment',
        estimatedResolution: '24 hours',
        hasPhoto: false,
    },
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'ANNC01', type: 'Water', title: 'Planned Water Supply Disruption in Vashi', date: 'July 30, 2024', description: 'Due to urgent maintenance on the main pipeline, water supply will be affected in Vashi Sectors 1-8 from 10:00 AM to 6:00 PM. Residents are advised to store sufficient water.' },
    { id: 'ANNC02', type: 'Power', title: 'MSEDCL Infrastructure Upgrade - Nerul', date: 'July 29, 2024', description: 'A planned power outage is scheduled in Nerul Sector 20 between 11:00 AM and 3:00 PM for infrastructure upgrades. We regret the inconvenience.' },
    { id: 'ANNC03', type: 'Civic', title: 'Property Tax Payment Deadline Extended', date: 'July 25, 2024', description: 'The deadline for property tax payment for the current financial year has been extended to August 15, 2024, without any penalty.' },
    { id: 'ANNC04', type: 'Health', title: 'Monsoon Health Advisory', date: 'July 24, 2024', description: 'Citizens are advised to drink boiled water and avoid street food to prevent water-borne diseases during the monsoon season.' },
];
