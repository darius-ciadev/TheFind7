import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
}

export const Checkbox = ({ checked, onCheckedChange, label }: CheckboxProps) => {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      className={`
        flex items-center justify-center
        w-5 h-5 rounded-md 
        border transition-all 
        data-[state=checked]:bg-[var(--green)] 
        data-[state=checked]:border-[var(--green)] 
        border-neutral-300 bg-white
        hover:border-neutral-400
      `}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="w-3.5 h-3.5 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};
