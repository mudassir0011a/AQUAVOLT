import React from 'react';
import { MOCK_DB } from '../../data/mockDatabase';
// FIX: Import the Complaint type to resolve the 'Cannot find name' error.
import type { Complaint } from '../../types';

const complaints = Object.values(MOCK_DB);

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[], title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
            <div className="space-y-2">
                {data.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <div className="w-24 text-sm text-slate-600 dark:text-slate-400 text-right">{item.label}</div>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6">
                            <div
                                style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
                                className="h-6 rounded-full text-white text-xs flex items-center justify-end pr-2"
                            >
                                {item.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ data: { label: string, value: number, color: string }[], title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulative = 0;
    const gradients = data.map(item => {
        const percentage = (item.value / total) * 100;
        const start = cumulative;
        const end = cumulative + percentage;
        cumulative = end;
        return `${item.color} ${start}% ${end}%`;
    });
    const conicGradient = `conic-gradient(${gradients.join(', ')})`;

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">{title}</h3>
            <div className="flex justify-center items-center gap-6">
                 <div className="w-32 h-32 rounded-full relative" style={{ background: conicGradient }}>
                    <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">{total}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    {data.map(item => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm">{item.label} ({(item.value / total * 100).toFixed(1)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const AnalyticsPage: React.FC = () => {
    const byStatus = complaints.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
    }, {} as Record<Complaint['status'], number>);

    const byType = complaints.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
    }, {} as Record<Complaint['type'], number>);

    const statusData = [
        { label: 'Pending', value: byStatus.pending || 0, color: '#f59e0b' },
        { label: 'In Progress', value: byStatus['in-progress'] || 0, color: '#3b82f6' },
        { label: 'Resolved', value: byStatus.resolved || 0, color: '#22c55e' }
    ];

    const typeData = [
        { label: 'Water', value: byType.water || 0, color: '#06b6d4' },
        { label: 'Electricity', value: byType.electricity || 0, color: '#facc15' }
    ];

    const monthlyData = [
        { label: 'Jan', value: 2, color: '#6366f1'},
        { label: 'Feb', value: 1, color: '#6366f1'},
    ];


    return (
        <>
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                        <DonutChart data={statusData} title="Complaints by Status" />
                    </div>
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                        <DonutChart data={typeData} title="Complaints by Type" />
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                    <BarChart data={monthlyData} title="Monthly Complaint Volume (2025)" />
                </div>

                 <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <p className="text-2xl font-bold">12 Hours</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Resolution Time</p>
                        </div>
                        <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <p className="text-2xl font-bold">1.5</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Reports per Day (Avg)</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnalyticsPage;