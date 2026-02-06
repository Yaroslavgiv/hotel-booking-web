import { useState } from 'react';
import type { Room } from '../types';
import './RoomFilters.css';

interface RoomFiltersProps {
  rooms: Room[];
  onFilterChange: (filtered: Room[]) => void;
}

export const RoomFilters = ({ rooms, onFilterChange }: RoomFiltersProps) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  const types = Array.from(new Set(rooms.map((r) => r.type)));

  const applyFilters = () => {
    let filtered = [...rooms];

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        filtered = filtered.filter((r) => r.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        filtered = filtered.filter((r) => r.price <= max);
      }
    }

    if (selectedType) {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    onFilterChange(filtered);
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedType('');
    setFilterStart('');
    setFilterEnd('');
    onFilterChange(rooms);
  };

  return (
    <div className="room-filters">
      <div className="filters-row">
        <div className="filter-group">
          <label>Мин. цена:</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="filter-group">
          <label>Макс. цена:</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="∞"
          />
        </div>
      </div>
      <div className="filters-row">
        <div className="filter-group">
          <label>Тип номера:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Любой тип</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Даты:</label>
          <div className="date-inputs">
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
            <span>—</span>
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
              min={filterStart}
            />
          </div>
        </div>
      </div>
      <div className="filters-actions">
        <button onClick={applyFilters} className="apply-button">
          Применить
        </button>
        <button onClick={resetFilters} className="reset-button">
          Сбросить
        </button>
      </div>
    </div>
  );
};
