import React from "react";

type LabeledInputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  accept?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function LabeledInput({
  label,
  type = "text",
  placeholder,
  accept,
  value,
  onChange,
}: LabeledInputProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        accept={accept}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
