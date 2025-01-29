import React from 'react';
import Link from 'next/link';
import { Make, MakeAndYear, Model } from '@/types/vehicleTypes';
import ModelList from '@/components/VehicleModelList';

async function fetchModels(makeId: string, year: string) {
  if (!makeId || !year) return [];
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  if (!res.ok) throw new Error("Data loading error");
  const data = await res.json();
  return data.Results || [];
}

async function fetchMakes() {
  const API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json';
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch makes');
  }
  const data = await response.json();
  return data.Results;
}

function generateYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 2015; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years;
}

async function fetchMakesAndYears(): Promise<MakeAndYear[]> {
  try {
    const makes = await fetchMakes();

    const years = generateYears();

    const makesAndYears = makes.flatMap((make: Make) =>
      years.map((year) => ({
        make: make.MakeName,
        year,
      }))
    );

    return makesAndYears;
  } catch (error) {
    console.error('Error fetching makes and years:', error);
    return [];
  }
}

interface ResultPageProps {
  models: Model[];
  make: string;
  year: string;
  error: string | null;
}

const ResultPage: React.FC<ResultPageProps> = ({ models, make, year, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-semibold text-red-500 mb-4">Error loading data</h1>
        <p className="text-gray-600">{error}</p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Models for {make} {year}
      </h1>

      {models.length > 0 ? (
        <ModelList models={models} />
      ) : (
        <div className="text-lg text-gray-500">No models found</div>
      )}

      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
      >
        Go back
      </Link>
    </div>
  );
};

export async function getStaticPaths() {
  const makesAndYears = await fetchMakesAndYears();
  const paths = makesAndYears.map(({ make, year }) => ({
    params: { make, year },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: { make: string; year: string } }) {
  const { make, year } = params;

  try {
    const models = await fetchModels(make, year);
    return {
      props: {
        models,
        make,
        year,
        error: null,
      },
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error loading data";
    return {
      props: {
        models: [],
        make,
        year,
        error: errorMessage,
      },
    };
  }
}

export default ResultPage;
