import type { Task } from '../types';

export const technicians = [
    { id: 'TECH001', name: 'Rajesh Kumar', department: 'Water', status: 'Active', assignedComplaints: 3 },
    { id: 'TECH002', name: 'Sunita Sharma', department: 'Electricity', status: 'Active', assignedComplaints: 5 },
    { id: 'TECH003', name: 'Anil Verma', department: 'Water', status: 'On-leave', assignedComplaints: 0 },
    { id: 'TECH004', name: 'Priya Singh', department: 'Electricity', status: 'Active', assignedComplaints: 2 },
    { id: 'TECH005', name: 'Amit Patel', department: 'Water', status: 'Active', assignedComplaints: 4 },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);


export let mockTasks: Task[] = [
    {
        id: 'TASK001',
        title: 'Inspect Vashi pipeline',
        dueDate: yesterday.toISOString().split('T')[0], // Overdue
        assignedTo: 'TECH001',
        complaintId: 'WTR-2025-001'
    },
    {
        id: 'TASK002',
        title: 'Repair Sanpada water pump',
        dueDate: today.toISOString().split('T')[0], // Due today
        assignedTo: 'TECH005',
        complaintId: 'WTR-2025-002'
    },
     {
        id: 'TASK003',
        title: 'Follow up on Seawoods power cut',
        dueDate: today.toISOString().split('T')[0], // Due today
        assignedTo: 'TECH002',
        complaintId: 'ELC-2025-045'
    },
    {
        id: 'TASK004',
        title: 'Procure new transformers',
        dueDate: tomorrow.toISOString().split('T')[0],
        assignedTo: 'TECH004',
        complaintId: 'ELC-2025-045'
    },
    {
        id: 'TASK005',
        title: 'Monthly maintenance check',
        dueDate: nextWeek.toISOString().split('T')[0],
        assignedTo: 'TECH001',
        complaintId: 'WTR-2025-001'
    }
];
