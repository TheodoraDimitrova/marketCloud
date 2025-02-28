import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CurrencySelect = () => {
  return (
    <Select>
      <SelectTrigger
        className="w:[40px] lg:w-[180px] bg-gray-800 text-white
       border border-gray-600 py-3 md:px-5  rounded-sm shadow-md focus:ring-2 focus:ring-gray-500 hover:bg-gray-700 transition-all flex justify-between items-center"
      >
        <SelectValue placeholder="EUR" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white border border-gray-600 rounded-lg">
        <SelectGroup>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="GBP">GBP</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CurrencySelect;
