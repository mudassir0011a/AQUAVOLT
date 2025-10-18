
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockTasks, technicians } from '../../data/mockAdminData';
import { Task } from '../../types';

type View = 'month' | 'week' | 'day';

const isSameDay = (dateA: Date, dateB: Date) => {
    return dateA.getFullYear() === dateB.getFullYear() &&
           dateA.getMonth() === dateB.getMonth() &&
           dateA.getDate() === dateB.getDate();
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate + 'T00:00:00'); // Ensure date is parsed in local timezone
    
    let status: 'overdue' | 'due-today' | 'upcoming' = 'upcoming';
    if (dueDate < today) {
        status = 'overdue';
    } else if (isSameDay(dueDate, today)) {
        status = 'due-today';
    }

    const statusStyles = {
        overdue: 'bg-red-100/70 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-l-2 border-red-500',
        'due-today': 'bg-amber-100/70 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-l-2 border-amber-500',
        upcoming: 'bg-sky-100/70 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 border-l-2 border-sky-500',
    };
    
    const technician = technicians.find(t => t.id === task.assignedTo);
    
    return (
        <Link to={`/track?id=${task.complaintId}`} className={`block p-1 rounded-sm text-xs mb-1 hover:shadow-lg hover:scale-105 transition-transform ${statusStyles[status]}`}>
            <p className="font-semibold truncate">{task.title}</p>
             <div className="text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                <span>{technician?.name || 'Unassigned'}</span>
            </div>
        </Link>
    );
};


const CalendarPage: React.FC = () => {
    const [view, setView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const tasks = mockTasks;

    const changeDate = (amount: number) => {
        const newDate = new Date(currentDate);
        if (view === 'month') newDate.setMonth(newDate.getMonth() + amount);
        else if (view === 'week') newDate.setDate(newDate.getDate() + (amount * 7));
        else newDate.setDate(newDate.getDate() + amount);
        setCurrentDate(newDate);
    };

    const calendarHeader = useMemo(() => {
        let title = '';
        if (view === 'month') {
            title = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else if (view === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            title = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
        } else {
            title = currentDate.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        return title;
    }, [view, currentDate]);

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days = [];
        // Pad start
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        const today = new Date();
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayHeadersMobile = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-7">
                    {dayHeaders.map((day, i) => (
                        <div key={day+i} className="p-2 text-center font-semibold text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                             <span className="sm:hidden">{dayHeadersMobile[i]}</span>
                             <span className="hidden sm:inline">{day}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-t border-slate-200 dark:border-slate-700">
                    {days.map((day, index) => (
                        <div key={index} className="h-28 sm:h-32 p-1 border-r border-b border-slate-200 dark:border-slate-700 overflow-y-auto relative [&:nth-child(7n)]:border-r-0">
                            {day && (
                                <>
                                    <div className="flex justify-center mb-1">
                                        <span className={`text-xs sm:text-sm w-6 h-6 flex items-center justify-center rounded-full ${isSameDay(day, today) ? 'bg-emerald-500 text-white font-bold' : ''}`}>
                                            {day.getDate()}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {tasks
                                            .filter(task => isSameDay(new Date(task.dueDate + 'T00:00:00'), day))
                                            .map(task => <TaskItem key={task.id} task={task} />)}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const weekDays = Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(day.getDate() + i);
            return day;
        });

        return (
             <div className="space-y-4">
                {weekDays.map(day => (
                    <div key={day.toString()} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                        <h3 className="font-bold text-lg">{day.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                        <div className="mt-2 space-y-2">
                             {tasks
                                .filter(task => isSameDay(new Date(task.dueDate + 'T00:00:00'), day))
                                .map(task => <TaskItem key={task.id} task={task} />)}
                             {tasks.filter(task => isSameDay(new Date(task.dueDate + 'T00:00:00'), day)).length === 0 && <p className="text-sm text-slate-500">No tasks scheduled.</p>}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderDayView = () => {
        return (
             <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg">{currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                <div className="mt-2 space-y-2">
                     {tasks
                        .filter(task => isSameDay(new Date(task.dueDate + 'T00:00:00'), currentDate))
                        .map(task => <TaskItem key={task.id} task={task} />)}
                     {tasks.filter(task => isSameDay(new Date(task.dueDate + 'T00:00:00'), currentDate)).length === 0 && <p className="text-sm text-slate-500">No tasks scheduled for today.</p>}
                </div>
            </div>
        );
    };

    const viewContent = {
        month: renderMonthView(),
        week: renderWeekView(),
        day: renderDayView(),
    };
    
    const ViewButton: React.FC<{ targetView: View, label: string }> = ({ targetView, label }) => (
        <button
            onClick={() => setView(targetView)}
            className={`px-2 sm:px-4 py-2 text-sm font-semibold rounded-md transition-colors ${view === targetView ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
        >
            {label}
        </button>
    );

    return (
        <>
            <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => changeDate(-1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">&larr;</button>
                        <h2 className="text-lg sm:text-xl font-bold text-center w-40 sm:w-64">{calendarHeader}</h2>
                        <button onClick={() => changeDate(1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">&rarr;</button>
                         <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">Today</button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                        <ViewButton targetView="month" label="Month" />
                        <ViewButton targetView="week" label="Week" />
                        <ViewButton targetView="day" label="Day" />
                    </div>
                </div>
            </div>
            
            <div>{viewContent[view]}</div>
        </>
    );
};

export default CalendarPage;
