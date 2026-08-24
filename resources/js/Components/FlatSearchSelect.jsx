import { Combobox } from '@headlessui/react';
import { useState } from 'react';

export default function FlatSearchSelect({ flats, value, onChange }) {
    const [query, setQuery] = useState('');
    const selectedFlat = flats?.find((flat) => String(flat.id) === String(value)) || null;
    const normalizedQuery = query.toLowerCase().trim();
    const filteredFlats = normalizedQuery
        ? flats.filter((flat) =>
              `${flat.flat_no} ${flat.building?.name || ''}`
                  .toLowerCase()
                  .includes(normalizedQuery)
          )
        : flats;

    return (
        <Combobox value={selectedFlat} onChange={(flat) => onChange(flat?.id || '')}>
            <div className="relative mt-1">
                <Combobox.Input
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    displayValue={(flat) =>
                        flat ? `${flat.flat_no} — ${flat.building?.name || ''}` : ''
                    }
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search flat/room or building"
                />
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg">
                    {filteredFlats.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                            No matching flats or rooms.
                        </div>
                    ) : (
                        filteredFlats.map((flat) => (
                            <Combobox.Option
                                key={flat.id}
                                value={flat}
                                className={({ active }) =>
                                    `cursor-pointer px-3 py-2 text-sm ${
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    }`
                                }
                            >
                                {flat.flat_no} — {flat.building?.name || ''}
                            </Combobox.Option>
                        ))
                    )}
                </Combobox.Options>
            </div>
        </Combobox>
    );
}
