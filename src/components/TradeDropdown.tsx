
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TRADE_OPTIONS } from '@/lib/firebase';

interface TradeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TradeDropdown = ({ value, onChange, placeholder = "Select or type trade" }: TradeDropdownProps) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customTrade, setCustomTrade] = useState('');

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setIsCustom(true);
      setCustomTrade('');
      onChange('');
    } else {
      setIsCustom(false);
      onChange(selectedValue);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customValue = e.target.value;
    setCustomTrade(customValue);
    onChange(customValue);
  };

  if (isCustom) {
    return (
      <div className="space-y-2">
        <Input
          value={customTrade}
          onChange={handleCustomChange}
          placeholder="Enter custom trade"
          className="w-full"
        />
        <button
          type="button"
          onClick={() => {
            setIsCustom(false);
            setCustomTrade('');
            onChange('');
          }}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to dropdown
        </button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border shadow-lg z-50">
        {TRADE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        <SelectItem value="custom">
          <span className="text-blue-600 font-medium">+ Add Custom Trade</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TradeDropdown;
