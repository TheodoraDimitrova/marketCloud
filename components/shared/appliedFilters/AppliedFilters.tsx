import { X } from "lucide-react";

type FilterType = "priceRange" | "brands" | "discounts";

interface SelectedFilters {
  priceRange: string[];
  brands: string[];
  discounts: string[];
}

interface AppliedFiltersProps {
  initialFilters: SelectedFilters;
  removeFilter: (filterType: FilterType, value: string) => void;
  clearFilters: () => void;
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  initialFilters,
  removeFilter,
  clearFilters,
}) => {
  const hasActiveFilters = Object.values(initialFilters).some(
    (filters) => filters.length > 0
  );

  if (!hasActiveFilters) return null;

  return (
    <div>
      <h3 className="mb-3">Applied Filters</h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(initialFilters).flatMap(([type, filters]) =>
          (filters as string[]).map((filter) => (
            <div
              key={`${type}-${filter}`}
              className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-sm shadow-sm"
            >
              <span className="text-sm">{filter}</span>
              <button
                className="ml-2 text-gray-500 hover:text-red-500"
                onClick={() => removeFilter(type as FilterType, filter)}
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>
      <button
        onClick={clearFilters}
        className="text-red-600 mt-3 hover:underline text-sm"
      >
        Clear all
      </button>
    </div>
  );
};

export default AppliedFilters;
