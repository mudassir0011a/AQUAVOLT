
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MOCK_DB } from '../../data/mockDatabase';
import type { Complaint, Task } from '../../types';
import { technicians as mockTechnicians, mockTasks } from '../../data/mockAdminData';
import { useNotification } from '../../context/NotificationContext';
import ConfirmationDialog from '../../components/ConfirmationDialog';

const StatusBadge: React.FC<{ status: Complaint['status'] }> = ({ status }) => {
    const statusConfig = {
        'in-progress': { text: 'In Progress', classes: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300' },
        'resolved': { text: 'Resolved', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
        'pending': { text: 'Pending', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
    };
    const config = statusConfig[status];
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center ${config.classes}`}>
            {config.text}
        </span>
    );
};

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ComplaintCard: React.FC<{
    complaint: Complaint;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onAssign: (complaint: Complaint) => void;
}> = ({ complaint, isSelected, onSelect, onAssign }) => (
    <div className={`p-4 rounded-lg border flex gap-3 items-start transition-colors ${isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
        <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={() => onSelect(complaint.id)} 
            className="mt-1.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 flex-shrink-0"
        />
        <div className="flex-1">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{complaint.type === 'water' ? '💧' : '⚡'}</span>
                    <div>
                        <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{complaint.id}</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">{complaint.issue}</p>
                    </div>
                </div>
                <StatusBadge status={complaint.status} />
            </div>
             <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <p>📍 {complaint.location}</p>
                <p>📅 {complaint.reportedAt}</p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Assigned:</strong> {complaint.assignedTeam === 'Awaiting Assignment' ? (
                        <button onClick={() => onAssign(complaint)} className="ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">Assign</button>
                    ) : (
                        <span className="font-medium text-slate-700 dark:text-slate-200 ml-1">{complaint.assignedTeam}</span>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <Link to={`/track?id=${complaint.id}`} className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">View Details</Link>
                    {complaint.hasPhoto && <CameraIcon />}
                </div>
            </div>
        </div>
    </div>
);


const AssignTaskModal: React.FC<{
  complaint: Complaint | null;
  onClose: () => void;
  onAssign: (complaintId: string, technicianId: string, technicianName: string, taskTitle: string, dueDate: string) => void;
}> = ({ complaint, onClose, onAssign }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [technicianId, setTechnicianId] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const activeTechnicians = useMemo(() => mockTechnicians.filter(tech => tech.status === 'Active'), []);

    useEffect(() => {
        if (complaint) {
            setTaskTitle(complaint.issue);
            const assignedTech = mockTechnicians.find(t => t.name === complaint.assignedTeam);
            setTechnicianId(assignedTech?.id || '');
        }
    }, [complaint]);

    if (!complaint) return null;

    const handleSubmit = () => {
        if (!technicianId || !dueDate) {
            alert('Please select a technician and a due date.');
            return;
        }
        const tech = mockTechnicians.find(t => t.id === technicianId);
        if (tech) {
            onAssign(complaint.id, tech.id, tech.name, taskTitle, dueDate);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all animate-fade-in-up">
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Assign Task</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">For complaint: {complaint.id}</p>
                    </div>
                </div>
                
                {/* Modal Body */}
                <div className="p-6 space-y-4">
                     <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                        <input 
                            id="task-title" 
                            type="text" 
                            value={taskTitle} 
                            onChange={e => setTaskTitle(e.target.value)} 
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="technician" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To</label>
                        <select 
                            id="technician" 
                            value={technicianId} 
                            onChange={e => setTechnicianId(e.target.value)} 
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="" disabled>Select a technician</option>
                            {activeTechnicians.map(tech => <option key={tech.id} value={tech.id}>{tech.name} ({tech.department})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="due-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                        <input 
                            id="due-date" 
                            type="date" 
                            value={dueDate} 
                            onChange={e => setDueDate(e.target.value)} 
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    </div>
                </div>
                
                {/* Modal Footer */}
                <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button 
                        onClick={onClose} 
                        type="button"
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        type="button"
                        className="px-4 py-2 rounded-md text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors"
                    >
                        Assign Task
                    </button>
                </div>
            </div>
        </div>
    );
};

const BulkAssignTaskModal: React.FC<{
  isOpen: boolean;
  itemCount: number;
  onClose: () => void;
  onAssign: (technicianId: string, technicianName: string, taskTitle: string, dueDate: string) => void;
}> = ({ isOpen, itemCount, onClose, onAssign }) => {
    const [taskTitle, setTaskTitle] = useState('Follow-up on reported issue');
    const [technicianId, setTechnicianId] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const activeTechnicians = useMemo(() => mockTechnicians.filter(tech => tech.status === 'Active'), []);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!technicianId || !dueDate) {
            alert('Please select a technician and a due date.');
            return;
        }
        const tech = mockTechnicians.find(t => t.id === technicianId);
        if (tech) {
            onAssign(tech.id, tech.name, taskTitle, dueDate);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all animate-fade-in-up">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Bulk Assign Tasks</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Assigning tasks for {itemCount} selected complaints.</p>
                </div>
                <div className="p-6 space-y-4">
                    {/* Form fields are identical to the single assign modal */}
                    <div><label htmlFor="bulk-task-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title</label><input id="bulk-task-title" type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/></div>
                    <div><label htmlFor="bulk-technician" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign To</label><select id="bulk-technician" value={technicianId} onChange={e => setTechnicianId(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"><option value="" disabled>Select a technician</option>{activeTechnicians.map(tech => <option key={tech.id} value={tech.id}>{tech.name} ({tech.department})</option>)}</select></div>
                    <div><label htmlFor="bulk-due-date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label><input id="bulk-due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"/></div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} type="button" className="px-4 py-2 rounded-md text-sm font-semibold bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500">Cancel</button>
                    <button onClick={handleSubmit} type="button" className="px-4 py-2 rounded-md text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700">Assign All</button>
                </div>
            </div>
        </div>
    );
};


const AllComplaintsPage: React.FC = () => {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedComplaintIds, setSelectedComplaintIds] = useState<Set<string>>(new Set());
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const { showToast } = useNotification();
    const location = useLocation();
    const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setComplaints(Object.values(MOCK_DB));
        setSelectedComplaintIds(new Set()); // Clear selection on page load/navigation
    }, [location.pathname]);
    
    const filteredComplaints = useMemo(() => {
        return complaints.filter(complaint => {
            const matchesSearch = complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) || complaint.issue.toLowerCase().includes(searchTerm.toLowerCase()) || complaint.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
            const matchesType = typeFilter === 'all' || complaint.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        }).sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
    }, [complaints, searchTerm, statusFilter, typeFilter]);
    
    useEffect(() => {
        if (selectAllCheckboxRef.current) {
            const numSelected = selectedComplaintIds.size;
            const numVisible = filteredComplaints.length;
            selectAllCheckboxRef.current.checked = numSelected > 0 && numSelected === numVisible;
            selectAllCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numVisible;
        }
    }, [selectedComplaintIds, filteredComplaints]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedComplaintIds(new Set(filteredComplaints.map(c => c.id)));
        } else {
            setSelectedComplaintIds(new Set());
        }
    };
    
    const handleSelectOne = (id: string) => {
        const newSelection = new Set(selectedComplaintIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedComplaintIds(newSelection);
    };

    const handleAssignTask = (complaintId: string, technicianId: string, technicianName: string, taskTitle: string, dueDate: string) => {
        const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        
        const newTask: Task = { id: `TASK${String(mockTasks.length + 1).padStart(3, '0')}`, title: taskTitle, dueDate, assignedTo: technicianId, complaintId };
        mockTasks.push(newTask);

        const updatedComplaints = complaints.map(c => {
            if (c.id === complaintId) {
                const updatedComplaint = { ...c, assignedTeam: technicianName };
                const timeline = [...updatedComplaint.timeline];
                const teamAssignedIndex = timeline.findIndex(e => e.status === 'Team Assigned');
                if (teamAssignedIndex !== -1) timeline[teamAssignedIndex] = { ...timeline[teamAssignedIndex], time: now, completed: true };
                if (updatedComplaint.status === 'pending') {
                    updatedComplaint.status = 'in-progress';
                    const acknowledgedIndex = timeline.findIndex(e => e.status === 'Acknowledged' && !e.completed);
                    if (acknowledgedIndex !== -1) timeline[acknowledgedIndex] = { ...timeline[acknowledgedIndex], time: now, completed: true };
                }
                updatedComplaint.timeline = timeline;
                MOCK_DB[complaintId] = updatedComplaint;
                return updatedComplaint;
            }
            return c;
        });
        setComplaints(updatedComplaints);

        showToast(`Task for ${complaintId} assigned to ${technicianName}`, 'success');
        setIsAssignModalOpen(false);
        setSelectedComplaint(null);
    };
    
    const handleBulkAssign = (technicianId: string, technicianName: string, taskTitle: string, dueDate: string) => {
        selectedComplaintIds.forEach(complaintId => {
            const complaint = complaints.find(c => c.id === complaintId);
            if(complaint) {
                 handleAssignTask(complaintId, technicianId, technicianName, taskTitle, dueDate);
            }
        });
        setComplaints(Object.values(MOCK_DB)); 
        showToast(`${selectedComplaintIds.size} tasks assigned to ${technicianName}`, 'success');
        setSelectedComplaintIds(new Set());
        setIsBulkAssignModalOpen(false);
    };

    const handleBulkResolve = () => {
        const now = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
        const updatedComplaints = complaints.map(c => {
            if (selectedComplaintIds.has(c.id)) {
                const updatedComplaint = { ...c, status: 'resolved' as const };
                const timeline = c.timeline.map(e => ({ ...e, completed: true, time: e.completed ? e.time : now }));
                updatedComplaint.timeline = timeline;
                MOCK_DB[c.id] = updatedComplaint;
                return updatedComplaint;
            }
            return c;
        });
        setComplaints(updatedComplaints);
        showToast(`${selectedComplaintIds.size} complaints resolved.`, 'success');
        setSelectedComplaintIds(new Set());
    };

    const handleBulkDelete = () => {
        selectedComplaintIds.forEach(id => {
            delete MOCK_DB[id];
        });
        setComplaints(Object.values(MOCK_DB));
        showToast(`${selectedComplaintIds.size} complaints deleted.`, 'success');
        setSelectedComplaintIds(new Set());
        setIsDeleteConfirmOpen(false);
    };

    const openAssignModal = (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        setIsAssignModalOpen(true);
    };
    
    return (
        <>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Search by ID, issue, location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500"><option value="all">All Statuses</option><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="resolved">Resolved</option></select>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500"><option value="all">All Types</option><option value="water">Water</option><option value="electricity">Electricity</option></select>
                </div>
                
                {selectedComplaintIds.size > 0 && (
                    <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md mb-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
                        <span className="font-semibold text-sm">{selectedComplaintIds.size} selected</span>
                        <div className="flex items-center gap-2">
                            <button onClick={handleBulkResolve} className="px-3 py-1.5 text-xs font-semibold bg-green-500 text-white rounded-md hover:bg-green-600">Resolve</button>
                            <button onClick={() => setIsBulkAssignModalOpen(true)} className="px-3 py-1.5 text-xs font-semibold bg-sky-500 text-white rounded-md hover:bg-sky-600">Assign</button>
                            <button onClick={() => setIsDeleteConfirmOpen(true)} className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                )}
                
                {/* Desktop Table View */}
                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="p-3 w-12"><input ref={selectAllCheckboxRef} type="checkbox" onChange={handleSelectAll} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"/></th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Type</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Tracking ID</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Issue</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Location</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Reported At</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Attachment</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Assigned To</th>
                                <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.map(complaint => (
                                <tr key={complaint.id} className={`border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedComplaintIds.has(complaint.id) ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                                    <td className="p-3"><input type="checkbox" checked={selectedComplaintIds.has(complaint.id)} onChange={() => handleSelectOne(complaint.id)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"/></td>
                                    <td className="p-3 text-xl">{complaint.type === 'water' ? '💧' : '⚡'}</td>
                                    <td className="p-3 font-mono text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">{complaint.id}</td>
                                    <td className="p-3 text-slate-800 dark:text-slate-200 font-medium">{complaint.issue}</td>
                                    <td className="p-3 text-sm text-slate-600 dark:text-slate-400">{complaint.location}</td>
                                    <td className="p-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{complaint.reportedAt}</td>
                                    <td className="p-3 text-center">{complaint.hasPhoto ? <CameraIcon /> : '—'}</td>
                                    <td className="p-3"><StatusBadge status={complaint.status} /></td>
                                    <td className="p-3">
                                        {complaint.assignedTeam === 'Awaiting Assignment' ? (
                                            <button onClick={() => openAssignModal(complaint)} className="px-3 py-1.5 text-xs font-semibold bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 whitespace-nowrap">Assign</button>
                                        ) : (
                                            <div>
                                                <p className="font-semibold text-sm">{complaint.assignedTeam}</p>
                                                <button onClick={() => openAssignModal(complaint)} className="text-xs text-emerald-600 hover:underline">Re-assign</button>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <Link to={`/track?id=${complaint.id}`} className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:underline">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="space-y-4 md:hidden">
                    <div className="flex items-center gap-2 p-2">
                        <input ref={selectAllCheckboxRef} type="checkbox" onChange={handleSelectAll} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"/>
                        <label className="text-sm font-semibold">Select All Visible</label>
                    </div>
                    {filteredComplaints.map(complaint => (
                        <ComplaintCard 
                            key={complaint.id} 
                            complaint={complaint}
                            isSelected={selectedComplaintIds.has(complaint.id)}
                            onSelect={handleSelectOne}
                            onAssign={openAssignModal}
                        />
                    ))}
                </div>

                {filteredComplaints.length === 0 && (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <p className="font-semibold">No complaints found.</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
            {isAssignModalOpen && <AssignTaskModal complaint={selectedComplaint} onClose={() => setIsAssignModalOpen(false)} onAssign={handleAssignTask} />}
            <BulkAssignTaskModal isOpen={isBulkAssignModalOpen} itemCount={selectedComplaintIds.size} onClose={() => setIsBulkAssignModalOpen(false)} onAssign={handleBulkAssign} />
            <ConfirmationDialog
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleBulkDelete}
                title="Confirm Bulk Deletion"
                confirmText="Yes, Delete"
                cancelText="Cancel"
            >
                Are you sure you want to permanently delete {selectedComplaintIds.size} complaint(s)? This action cannot be undone.
            </ConfirmationDialog>
        </>
    );
};

export default AllComplaintsPage;
