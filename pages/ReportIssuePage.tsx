import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import ConfirmationDialog from '../components/ConfirmationDialog';
import type { Complaint } from '../types';
import { MOCK_DB } from '../data/mockDatabase';


const IssueTypeCard: React.FC<{ type: 'water' | 'electricity'; onSelect: (type: 'water' | 'electricity') => void }> = ({ type, onSelect }) => {
    const config = {
        water: {
            icon: '💧',
            title: 'Water Issue',
            description: 'Leaks, low pressure, supply cuts, etc.',
            hoverClass: 'hover:border-cyan-500 hover:shadow-cyan-100/50 dark:hover:border-cyan-500 dark:hover:shadow-cyan-900/30',
            iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
        },
        electricity: {
            icon: '⚡',
            title: 'Electricity Issue',
            description: 'Power cuts, voltage issues, etc.',
            hoverClass: 'hover:border-yellow-500 hover:shadow-yellow-100 dark:hover:border-yellow-500 dark:hover:shadow-yellow-900/30',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        },
    };
    const { icon, title, description, hoverClass, iconBg } = config[type];
    
    return (
        <div className={`bg-white dark:bg-slate-800 p-8 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-lg ${hoverClass}`} onClick={() => onSelect(type)}>
            <div className="text-center">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${iconBg}`}>
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            </div>
        </div>
    );
};

const SubCategoryCard: React.FC<{ icon: string; title: string; onSelect: () => void; hoverClass: string }> = ({ icon, title, onSelect, hoverClass }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${hoverClass}`} onClick={onSelect}>
        <div className="flex items-center gap-4">
            <div className="text-3xl">{icon}</div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        </div>
    </div>
);

const NaviMumbaiMap: React.FC<{ mapUrl: string }> = ({ mapUrl }) => (
    <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <iframe
            key={mapUrl} // Forces iframe to re-render on src change
            src={mapUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map of Navi Mumbai"
        ></iframe>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50">
            Map will update based on your location inputs.
        </p>
    </div>
);


const subCategories = {
  water: [
    { key: 'no-supply', icon: '🚫', title: 'No Water Supply' },
    { key: 'leakage', icon: '💧', title: 'Pipeline Leakage' },
    { key: 'contaminated', icon: '☣️', title: 'Contaminated Water' },
    { key: 'low-pressure', icon: '📉', title: 'Low Water Pressure' },
  ],
  electricity: [
    { key: 'outage', icon: '🌑', title: 'Power Outage' },
    { key: 'streetlight', icon: '💡', title: 'Streetlight Not Working' },
    { key: 'voltage', icon: '〰️', title: 'Voltage Fluctuation' },
    { key: 'safety-hazard', icon: '⚠️', title: 'Exposed Wires / Hazard' },
  ],
};

const naviMumbaiLocations = [ "Airoli", "Belapur CBD", "Dronagiri", "Juinagar", "Kamothe", "Kharghar", "Nerul", "Panvel", "Sanpada", "Seawoods", "Ulwe", "Vashi",];

const LoginNotice = () => (
    <div className="bg-slate-100 dark:bg-slate-800/50 border-l-4 border-emerald-500 p-4 rounded-r-lg mb-8 animate-fade-in-up" role="alert">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Please Login First to Raise an Issue</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Anonymous reports won't be counted. Please log in to continue.</p>
                </div>
            </div>
            <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 text-white dark:text-emerald-900 font-bold py-2 px-4 rounded-full transition-colors whitespace-nowrap text-sm flex-shrink-0">
                Go to Login Page
            </Link>
        </div>
    </div>
);

const SummaryItem: React.FC<{ label: string; value: string | null; icon?: string }> = ({ label, value, icon }) => (
    <div className="flex items-start gap-3 py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
        {icon && <span className="text-lg text-slate-500 dark:text-slate-400 mt-0.5">{icon}</span>}
        <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{value || 'Not provided'}</p>
        </div>
    </div>
);


const ReportIssuePage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useNotification();
    const [issueType, setIssueType] = useState<'water' | 'electricity' | null>(null);
    const [subCategory, setSubCategory] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [sector, setSector] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const initialMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120645.3142018898!2d72.9902330420707!3d19.08320982542353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c21ae9422607%3A0x8227c693a1055536!2sNavi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1709911253911!5m2!1sen!2sin";
    const [mapUrl, setMapUrl] = useState(initialMapUrl);

    const isFormValid = title && description && location && sector;

    useEffect(() => {
        if (location && sector) {
            const query = encodeURIComponent(`${sector}, ${location}, Navi Mumbai, India`);
            const newUrl = `https://maps.google.com/maps?q=${query}&t=&z=15&ieUTF8&iwloc=&output=embed`;
            setMapUrl(newUrl);
        } else {
            setMapUrl(initialMapUrl); // Revert to default if fields are cleared
        }
    }, [location, sector]);

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            showToast('Geolocation is not supported by your browser.', 'error');
            return;
        }
    
        setIsFetchingLocation(true);
    
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`User location: lat=${latitude}, lng=${longitude}`);
                // In a real app, you would use a reverse geocoding API here.
                // For this demo, we'll simulate finding a location.
                setLocation('Nerul'); 
                setSector('Sector 19A (Auto-detected)');
                showToast('Location detected successfully!', 'success');
                setIsFetchingLocation(false);
            },
            (error) => {
                let errorMessage = 'Could not retrieve location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access was denied. Please enable it in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out.';
                        break;
                }
                showToast(errorMessage, 'error');
                setIsFetchingLocation(false);
            }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || loading) return;
        setIsConfirming(true);
    };
    
    const handleConfirmSubmit = () => {
        setIsConfirming(false);
        setLoading(true);

        setTimeout(() => {
            if (!user || !issueType || !subCategory) {
                showToast('Something went wrong. Please try again.', 'error');
                setLoading(false);
                return;
            }

            // Generate unique ID
            const typePrefix = issueType === 'water' ? 'WTR' : 'ELC';
            const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
            const trackingId = `${typePrefix}-${randomPart}`;

            const now = new Date();

            const newComplaint: Complaint = {
                id: trackingId,
                userId: user.identifier,
                type: issueType,
                issue: `${subCategory}: ${title}`,
                status: 'pending',
                location: `${location}, ${sector}`,
                reportedAt: now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short'}),
                timeline: [
                    { status: 'Reported', time: now.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short'}), completed: true },
                    { status: 'Acknowledged', time: 'Pending', completed: false },
                    { status: 'Team Assigned', time: 'Pending', completed: false },
                    { status: 'In Progress', time: 'Pending', completed: false },
                    { status: 'Resolved', time: 'Pending', completed: false },
                ],
                assignedTeam: 'Awaiting Assignment',
                estimatedResolution: '24-48 hours',
                hasPhoto: photo !== null,
            };

            // Add to our 'database'
            MOCK_DB[trackingId] = newComplaint;
            
            showToast(`Issue reported! Tracking ID: ${trackingId}`, 'success');
            setLoading(false);
            resetForm(true);

        }, 1500);
    };

    const resetForm = useCallback((fullReset = false) => {
        if (fullReset) {
          setIssueType(null);
        }
        setSubCategory(null);
        setTitle('');
        setDescription('');
        setLocation('');
        setSector('');
        setPhoto(null);
    }, []);

    const handleIssueTypeSelect = (type: 'water' | 'electricity') => {
        if (!user) {
            // Logged-out users cannot proceed. The LoginNotice provides the necessary action.
            return;
        }
        setIssueType(type);
    };

    const renderStep1 = () => (
        <div className="animate-fade-in-up">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Report an Issue</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Help us serve you better by reporting infrastructure problems.</p>
                {user && <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Step 1 of 3: Select issue type</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IssueTypeCard type="water" onSelect={handleIssueTypeSelect} />
                <IssueTypeCard type="electricity" onSelect={handleIssueTypeSelect} />
            </div>
        </div>
    );

    const renderStep2 = () => {
        if (!issueType) return null;
        const subCatConfig = issueType === 'water'
            ? { hover: 'hover:border-cyan-500', list: subCategories.water }
            : { hover: 'hover:border-yellow-500', list: subCategories.electricity };
        
        return (
            <div className="animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold capitalize">{issueType} Issue</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">Please select the type of problem you are facing.</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Step 2 of 3: Specify the problem</p>
                </div>
                <div className="space-y-4">
                    {subCatConfig.list.map(sc => (
                        <SubCategoryCard key={sc.key} icon={sc.icon} title={sc.title} onSelect={() => setSubCategory(sc.title)} hoverClass={subCatConfig.hover} />
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <button onClick={() => setIssueType(null)} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                        &larr; Back to issue types
                    </button>
                </div>
            </div>
        );
    };

    const renderStep3 = () => {
        if (!issueType || !subCategory) return null;
        const formIcon = issueType === 'water' ? '💧' : '⚡';
        const managedBy = issueType === 'water' ? 'CIDCO' : 'MSEDCL';
        
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 animate-fade-in-up">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{formIcon}</span>
                        <div>
                           <h2 className="text-2xl font-bold">{subCategory}</h2>
                           <p className="text-slate-500 dark:text-slate-400 text-sm">Step 3 of 3: Provide details</p>
                        </div>
                    </div>
                    <button onClick={() => setSubCategory(null)} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">&larr; Change Problem</button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Managed by {managedBy}</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issue Title *</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={`e.g., ${subCategory} in Sector 5`} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Description *</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide details like duration, severity, specific location, etc." rows={4} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required></textarea>
                    </div>
                    <div>
                         <h3 className="text-base font-medium text-slate-700 dark:text-slate-300 mb-2">Location Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location / Node *</label>
                                <select id="location" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required>
                                   <option value="" disabled>-- Select a Location --</option>
                                   {naviMumbaiLocations.sort().map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="sector" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sector / Landmark *</label>
                                <input id="sector" type="text" value={sector} onChange={e => setSector(e.target.value)} placeholder="e.g., Sector 17" className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-emerald-500 focus:border-emerald-500" required />
                            </div>
                        </div>

                        <div className="relative my-4 flex items-center">
                            <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                            <span className="flex-shrink mx-4 text-sm text-slate-500 dark:text-slate-400">OR</span>
                            <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={handleUseCurrentLocation}
                                disabled={isFetchingLocation}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isFetchingLocation ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Fetching Location...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                        Use my current location
                                    </>
                                )}
                            </button>
                        </div>
                        <NaviMumbaiMap mapUrl={mapUrl} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upload Photo (Optional)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-slate-600 dark:text-slate-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                {photo ? <p className="text-xs text-slate-500 dark:text-slate-400">{photo.name}</p> : <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG up to 10MB</p>}
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" disabled={!isFormValid || loading} className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed">
                            {loading ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                 {!user && <LoginNotice />}
                 {!issueType && renderStep1()}
                 {user && issueType && !subCategory && renderStep2()}
                 {user && issueType && subCategory && renderStep3()}
            </div>
            <ConfirmationDialog
                isOpen={isConfirming}
                onClose={() => setIsConfirming(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Your Report Details"
                confirmText="Confirm & Submit"
                cancelText="Go Back & Edit"
            >
                <p className="mb-4 text-sm">Please review the information below before submitting.</p>
                <div className="space-y-1">
                    <SummaryItem label="Issue Type" value={issueType} icon={issueType === 'water' ? '💧' : '⚡'} />
                    <SummaryItem label="Problem" value={subCategory} icon="🔧" />
                    <SummaryItem label="Title" value={title} icon="📝" />
                    <SummaryItem label="Location" value={`${location}, ${sector}`} icon="📍" />
                    <SummaryItem label="Photo Attached" value={photo ? photo.name : 'No'} icon="📷" />
                </div>
            </ConfirmationDialog>
        </div>
    );
};

export default ReportIssuePage;