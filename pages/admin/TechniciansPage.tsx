
import React, { useState } from 'react';
import { technicians as mockTechnicians } from '../../data/mockAdminData';
import { useNotification } from '../../context/NotificationContext';

type Technician = {
    id: string;
    name: string;
    department: 'Water' | 'Electricity';
    status: 'Active' | 'On-leave';
    assignedComplaints: number;
};

const StatusBadge: React.FC<{ status: 'Active' | 'On-leave' }> = ({ status }) => {
    const config = status === 'Active'
        ? { text: 'Active', classes: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' }
        : { text: 'On-leave', classes: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300' };
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.classes}`}>{config.text}</span>;
};

const TechnicianCard: React.FC<{ technician: Technician }> = ({ technician }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{technician.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{technician.department === 'Water' ? '💧 Water' : '⚡ Electricity'}</p>
            </div>
            <StatusBadge status={technician.status} />
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Assigned Complaints:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{technician.assignedComplaints}</span>
        </div>
    </div>
);

const TechniciansPage: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>(mockTechnicians as Technician[]);
    const { showToast } = useNotification();

    const [newName, setNewName] = useState('');
    const [newDepartment, setNewDepartment] = useState<'Water' | 'Electricity'>('Water');

    const handleAddTechnician = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) {
            showToast('Technician name cannot be empty.', 'error');
            return;
        }

        const newTechnician: Technician = {
            id: `TECH${String(technicians.length + 1).padStart(3, '0')}`,
            name: newName,
            department: newDepartment,
            status: 'Active',
            assignedComplaints: 0,
        };

        setTechnicians(prev => [...prev, newTechnician]);
        showToast(`Technician ${newName} added successfully!`, 'success');
        setNewName('');
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Technician List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Technician Roster</h2>
                    
                    {/* Mobile Card View */}
                    <div className="space-y-4 md:hidden">
                        {technicians.map(tech => <TechnicianCard key={tech.id} technician={tech} />)}
                    </div>
                    
                    {/* Desktop Table View */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Name</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Department</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Status</th>
                                    <th className="p-3 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase">Assigned</th>
                                </tr>
                            </thead>
                            <tbody>
                                {technicians.map(tech => (
                                    <tr key={tech.id} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{tech.name}</td>
                                        <td className="p-3">{tech.department === 'Water' ? '💧 Water' : '⚡ Electricity'}</td>
                                        <td className="p-3"><StatusBadge status={tech.status} /></td>
                                        <td className="p-3 text-center">{tech.assignedComplaints}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Technician Form */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-4">Add New Technician</h2>
                    <form onSubmit={handleAddTechnician} className="space-y-4">
                        <div>
                            <label htmlFor="tech-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                            <input
                                id="tech-name"
                                type="text"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="e.g., Suresh Gupta"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="tech-dept" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                            <select
                                id="tech-dept"
                                value={newDepartment}
                                onChange={e => setNewDepartment(e.target.value as 'Water' | 'Electricity')}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md"
                            >
                                <option value="Water">💧 Water</option>
                                <option value="Electricity">⚡ Electricity</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors">
                            Add Technician
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TechniciansPage;
