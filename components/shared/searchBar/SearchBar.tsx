import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  return (
    <div>
      <div className="container w-[80%] md:max-w-[650px] md:w-full mx-auto my-10 md:my-20">
        <div className="relative mt-4">
          <Input
            className="p-2 pl-10 bg-gray-200 w-full placeholder:text-gray-500 placeholder:text-lg border-none"
            placeholder="Search our Store"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute inset-y-0 right-3 w-6 h-6 top-2 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
