import { Label } from "../label";

export default function CustomInput({
    label,
    type,
    placeholder,
    value,
    onChange,
    error,
    required,
    disabled = false
}: {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
}) {
    return (
        <div className="w-full flex flex-col">
            <Label htmlFor="name" className="text-purple-900 mb-1">
                {label}
            </Label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full py-1.5 border-b border-gray-300 focus:border-purple-700 focus:outline-none transition-colors text-base bg-transparent"
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
            />
            {error && (
                <span className="text-red-500 text-sm mt-1">* {error}</span>
            )}
        </div>
    );
}
