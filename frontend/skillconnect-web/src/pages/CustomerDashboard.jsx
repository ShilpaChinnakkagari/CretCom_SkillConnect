import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import SearchFilters from '../components/customer/SearchFilters';
import ContractorCard from '../components/customer/ContractorCard';
import BookingModal from '../components/customer/BookingModal';
import BookingHistory from '../components/customer/BookingHistory';

axios.defaults.withCredentials = true;

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contractors, setContractors] = useState([]);
    const [filteredContractors, setFilteredContractors] = useState([]);
    const [selectedContractor, setSelectedContractor] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [activeTab, setActiveTab] = useState('search');
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        category: '',
        subcategory: '',
        location: '',
        maxPrice: '',
        minRating: '',
        searchQuery: ''
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        } else {
            window.location.href = '/login';
        }
        fetchContractors();
    }, []);

    const fetchContractors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:8080/api/contractor', {
                withCredentials: true
            });
            setContractors(response.data);
            setFilteredContractors(response.data);
        } catch (error) {
            console.error('Failed to fetch contractors:', error);
            setError('Could not load service providers. Please try again.');
            toast.error('Failed to load contractors');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchFilters) => {
        setFilters(searchFilters);
        let results = [...contractors];

        if (searchFilters.searchQuery) {
            const query = searchFilters.searchQuery.toLowerCase();
            results = results.filter(c =>
                c.fullName?.toLowerCase().includes(query) ||
                c.primaryCategory?.toLowerCase().includes(query) ||
                c.aboutMe?.toLowerCase().includes(query)
            );
        }

        if (searchFilters.category) {
            results = results.filter(c => c.primaryCategory === searchFilters.category);
        }

        if (searchFilters.subcategory) {
            results = results.filter(c => c.secondarySkills?.includes(searchFilters.subcategory));
        }

        if (searchFilters.location) {
            results = results.filter(c =>
                c.serviceAreas?.some(area =>
                    area.toLowerCase().includes(searchFilters.location.toLowerCase())
                )
            );
        }

        if (searchFilters.maxPrice) {
            const maxPrice = parseFloat(searchFilters.maxPrice);
            results = results.filter(c => c.minimumPrice <= maxPrice);
        }

        if (searchFilters.minRating) {
            const minRating = parseFloat(searchFilters.minRating);
            results = results.filter(c => (c.stats?.averageRating || 0) >= minRating);
        }

        setFilteredContractors(results);
    };

    const handleBookNow = (contractor) => {
        setSelectedContractor(contractor);
        setShowBookingModal(true);
    };

    const handleBookingSuccess = () => {
        setShowBookingModal(false);
        toast.success('Booking request sent successfully!');
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8080/api/auth/logout', {}, {
                withCredentials: true
            });
        } catch (e) {
            console.error('Logout error:', e);
        }
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <span className="text-6xl block mb-4">⚠️</span>
                    <h2 className="text-xl font-semibold text-red-600">{error}</h2>
                    <button
                        onClick={fetchContractors}
                        className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary-600">SkillConnect</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Customer</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Welcome, {user?.name || 'Customer'}</span>
                        <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'search'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        🔍 Find Providers
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'history'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        📋 My Bookings
                    </button>
                </div>

                {activeTab === 'search' && (
                    <>
                        <SearchFilters onSearch={handleSearch} />
                        <div className="mt-4 text-sm text-gray-500">
                            Found {filteredContractors.length} service providers
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {filteredContractors.map((contractor) => (
                                <ContractorCard
                                    key={contractor.id}
                                    contractor={contractor}
                                    onBookNow={() => handleBookNow(contractor)}
                                />
                            ))}
                        </div>
                        {filteredContractors.length === 0 && (
                            <div className="text-center py-12">
                                <span className="text-6xl block mb-4">🔍</span>
                                <h3 className="text-xl font-semibold text-gray-600">No providers found</h3>
                                <p className="text-gray-400">Try adjusting your filters</p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'history' && (
                    <BookingHistory />
                )}
            </main>

            {showBookingModal && selectedContractor && (
                <BookingModal
                    contractor={selectedContractor}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={handleBookingSuccess}
                    user={user}
                />
            )}
        </div>
    );
};

export default CustomerDashboard;