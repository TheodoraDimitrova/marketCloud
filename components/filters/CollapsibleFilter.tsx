import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CollapsibleFilter: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div>
    <details className="group">
      <summary className="flex-between cursor-pointer text-md text-gray-500 py-5">
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

export default CollapsibleFilter;
