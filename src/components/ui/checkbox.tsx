import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: () => void;
  label: string;
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  label,
}: CheckboxProps) => (
  <CheckboxPrimitive.Root
    checked={checked}
    onCheckedChange={onCheckedChange}
    className="w-5 h-5 border border-neutral-400 rounded flex items-center justify-center data-[state=checked]:border-accent"
    aria-label={label}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="w-4 h-4 text-accent" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
