import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">SkillConnect</span>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">Beta</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
              Find Trusted Local
              <br />
              <span className="text-primary-600">Service Providers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with verified professionals in your area. From home repairs to beauty services,
              find the right expert for every need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Find Services
              </Link>
              <Link
                to="/login"
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-200"
              >
                Become a Provider
              </Link>
            </div>
          </div>

          {/* Categories Preview */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-3xl block mb-2">🏠</span>
                <span className="text-sm font-medium text-gray-700">Home & Construction</span>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-3xl block mb-2">💄</span>
                <span className="text-sm font-medium text-gray-700">Beauty & Grooming</span>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-3xl block mb-2">📚</span>
                <span className="text-sm font-medium text-gray-700">Education & Training</span>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-3xl block mb-2">🎉</span>
                <span className="text-sm font-medium text-gray-700">Events</span>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 text-center cursor-pointer hover:scale-105 transition-transform">
                <span className="text-3xl block mb-2">🔧</span>
                <span className="text-sm font-medium text-gray-700">Vehicle Services</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 SkillConnect. All rights reserved.</p>
            <p className="mt-1">Built with ❤️ for local communities</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;