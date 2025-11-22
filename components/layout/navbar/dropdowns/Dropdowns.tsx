interface DropdownsProps {
  dropdown: React.ReactNode;
  setActiveIndex: (index: number | null) => void;
}

const Dropdowns: React.FC<DropdownsProps> = ({ dropdown, setActiveIndex }) => {
  if (!dropdown) return null;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-400 z-70"
      onClick={() => setActiveIndex(null)}
    >
      {dropdown}
    </div>
  );
};

export default Dropdowns;
