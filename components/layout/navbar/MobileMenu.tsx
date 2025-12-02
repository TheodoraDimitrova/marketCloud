"use client";

import { useState, ComponentType } from "react";
import { X, ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface Links {
  href: string;
  label: string;
  Dropdown: ComponentType;
}
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: Links[];
}

const MobileMenu = ({ isOpen, onClose, navigationItems }: MobileMenuProps) => {
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null
  );
  useBodyScrollLock(isOpen);

  const openDropdown = (index: number) => {
    setActiveDropdownIndex(index);
  };

  const closeDropdown = () => {
    setActiveDropdownIndex(null);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-3/4 max-w-sm bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out text-gray-600 z-20`}
      >
        {/* Header */}
        <div className="flex-between p-4 border-b h-16">
          {activeDropdownIndex !== null ? (
            <div className="flex justify-between w-full space-x-2">
              <div
                onClick={closeDropdown}
                className="flex items-center space-x-2"
              >
                <ChevronLeft size={24} />
                <span className=" font-semibold ">Back</span>
              </div>
              <div>
                <span>{navigationItems[activeDropdownIndex].label}</span>
              </div>
            </div>
          ) : (
            <X size={24} onClick={onClose} className="ml-auto" />
          )}
        </div>

        {/* Menu Content */}
        <div className="flex flex-col p-4 space-y-4">
          {activeDropdownIndex === null ? (
            <>
              {navigationItems.map((navigationItem, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => openDropdown(index)}
                    className="flex justify-between cursor-pointer"
                  >
                    <span> {navigationItem.label}</span>
                    <ChevronRight className="ml-2" />
                  </div>
                );
              })}
            </>
          ) : (
            <div onClick={onClose}>
              {(() => {
                const DropdownComponent =
                  navigationItems[activeDropdownIndex]?.Dropdown;
                return DropdownComponent ? <DropdownComponent /> : null;
              })()}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 w-full h-full bg-black opacity-50 z-10"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MobileMenu;
