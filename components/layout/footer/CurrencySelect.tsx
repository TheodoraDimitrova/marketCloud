import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";

const CurrencySelect = () => {
  return (
    <div className="flex items-center gap-3">
      <label className="text-white text-sm">Currency</label>
      <Select>
        <SelectTrigger
          className="w-[100px] py-2 px-3 rounded-md transition-all"
          style={{
            backgroundColor: '#111',
            border: '1px solid #333',
            color: '#fff'
          }}
        >
          <SelectValue placeholder="EUR" />
        </SelectTrigger>
        <SelectContent 
          className="rounded-md"
          style={{
            backgroundColor: '#111',
            border: '1px solid #333',
            color: '#fff'
          }}
        >
          <SelectGroup>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelect;
