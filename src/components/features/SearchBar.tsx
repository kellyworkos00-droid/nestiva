'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleSearch = () => {
    onSearch?.(filters);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <Input
          label="Where to?"
          placeholder="City or address"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />

        <Input
          label="Check in"
          type="date"
          value={filters.checkIn}
          onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
        />

        <Input
          label="Check out"
          type="date"
          value={filters.checkOut}
          onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
        />

        <Input
          label="Guests"
          type="number"
          min="1"
          max="16"
          value={filters.guests}
          onChange={(e) => setFilters({ ...filters, guests: parseInt(e.target.value) })}
        />

        <Button onClick={handleSearch} fullWidth>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </Button>
      </div>
    </div>
  );
};
