import React, { useReducer } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import FilterBrands from "@/components/shared/filterBrands/FilterBrands";
import FilterDiscounts from "@/components/shared/filterDiscounts/FilterDiscounts";
import FilterPrice from "../shared/filterPrice/FilterPrice";

type FilterType = "priceRange" | "brands" | "discounts";

interface SelectedFilters {
  priceRange: [number, number] | [];
  brands: string[];
  discounts: string[];
}
type SectionFilterProps = {
  toggleFilters: () => void;
};

type Action =
  | {
      type: "SET_FILTER";
      filterType: FilterType;
      value: string[] | [number, number];
    }
  | { type: "REMOVE_FILTER"; filterType: FilterType; value: string }
  | { type: "CLEAR_FILTERS" };

const initialState: SelectedFilters = {
  priceRange: [],
  brands: [],
  discounts: [],
};

function filterReducer(
  state: SelectedFilters,
  action: Action
): SelectedFilters {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.filterType]:
          action.filterType === "priceRange"
            ? [
                `€${(action.value as [number, number])[0]} - €${
                  (action.value as [number, number])[1]
                }`,
              ]
            : action.value,
      };
    case "REMOVE_FILTER":
      return {
        ...state,
        [action.filterType]:
          action.filterType === "priceRange"
            ? []
            : (state[action.filterType] as string[]).filter(
                (item) => item !== action.value
              ),
      };
    case "CLEAR_FILTERS":
      return initialState;
    default:
      return state;
  }
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <details className="group">
      <summary className="flex justify-between items-center cursor-pointer text-md text-gray-500 py-5">
        {title}
        <span className="text-xl font-bold transition-all text-gray-500 duration-300 group-open:hidden">
          <ChevronDown />
        </span>
        <span className="text-xl font-bold transition-all text-gray-500 duration-300 hidden group-open:block">
          <ChevronUp />
        </span>
      </summary>
      <div className="p-2 text-gray-600 max-h-0 overflow-hidden transition-all duration-500 ease-out group-open:max-h-96">
        {children}
      </div>
    </details>
  </div>
);

const SectionFilter: React.FC<SectionFilterProps> = ({ toggleFilters }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  return (
    <div className="px-4 py-2 flex flex-col ">
      <header className="lg:hidden flex justify-between items-center ">
        <h3 className="text-lg mb-3">Filters</h3>
        <button className="text-gray-500 hover:text-red-500 transition">
          <X size={20} onClick={toggleFilters} />
        </button>
      </header>

      {/* Applied Filters */}
      <div>
        {Object.values(state).some((filters) => filters.length > 0) && (
          <h3 className="mb-3">Applied Filters</h3>
        )}
        <div className="flex flex-wrap gap-2">
          {Object.keys(state).map((type) =>
            (state[type as keyof SelectedFilters] as string[]).map((filter) => (
              <div
                key={`${type}-${filter}`}
                className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-sm shadow-sm"
              >
                <span className="text-sm">{filter}</span>
                <button
                  className="ml-2 text-gray-500 hover:text-red-500"
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_FILTER",
                      filterType: type as FilterType,
                      value: filter,
                    })
                  }
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>
        {Object.values(state).some((filters) => filters.length > 0) && (
          <button
            onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
            className="text-red-600 mt-3 hover:underline text-sm"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <FilterSection title="Price">
        <FilterPrice
          onChange={(values: [number, number]) =>
            dispatch({
              type: "SET_FILTER",
              filterType: "priceRange",
              value: values,
            })
          }
          priceRange={state.priceRange}
        />
      </FilterSection>

      <FilterSection title="Brands">
        <FilterBrands
          onChange={(value: string[]) =>
            dispatch({ type: "SET_FILTER", filterType: "brands", value })
          }
          selectedBrands={state.brands}
        />
      </FilterSection>

      <FilterSection title="Discounts">
        <FilterDiscounts
          onChange={(value: string[]) =>
            dispatch({ type: "SET_FILTER", filterType: "discounts", value })
          }
          selectedDiscounts={state.discounts}
        />
      </FilterSection>
    </div>
  );
};

export default SectionFilter;
