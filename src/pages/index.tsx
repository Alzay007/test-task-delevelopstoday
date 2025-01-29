import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import useMakes from '../hooks/useMakes';

const HomePage: React.FC = () => {
  const { makes } = useMakes();
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const isNextEnabled = selectedMake && selectedYear;

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    return Array.from({ length: currentYear - 2015 + 1 }, (_, index) => currentYear - index);
  }, [currentYear]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">
        🚗 Find Your Car
      </h1>

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 transition-transform transform hover:scale-105">
        <div className="mb-6">
          <label htmlFor="make" className="block text-lg font-semibold text-gray-700 mb-2">
            Vehicle Make
          </label>
          <div className="relative">
            <select
              id="make"
              value={selectedMake}
              onChange={handleMakeChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white text-gray-800"
            >
              <option value="">Select Make</option>
              {makes?.map((make) => (
                <option key={make.MakeId} value={make.MakeId}>
                  {make.MakeName}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="year" className="block text-lg font-semibold text-gray-700 mb-2">
            Model Year
          </label>
          <div className="relative">
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-white text-gray-800"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </div>
          </div>
        </div>

        <Link href={selectedMake && selectedYear ? `/result/${selectedMake}/${selectedYear}` : "#"} passHref>
          <button
            disabled={!isNextEnabled}
            className={`w-full py-3 text-lg font-bold text-white rounded-xl transition-all ${isNextEnabled
              ? 'bg-blue-500 hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Next →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
