import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { FaCheck, FaChevronDown, FaTimes } from "react-icons/fa";
import { ProjectAssignee, MultiSelectComboboxProps } from "@/app/types/project";

export default function MultiSelectCombobox({
  options,
  selected,
  setSelected,
  placeholder = "Assign people...",
}: MultiSelectComboboxProps) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? options
      : options.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase()),
        );

  const isSelected = (item: ProjectAssignee) =>
    selected.some((s) => s.id === item.id);

  const toggleSelect = (item: ProjectAssignee) => {
    if (isSelected(item)) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <Combobox
      value={selected}
      onChange={(newSelected: ProjectAssignee[]) => setSelected(newSelected)}
      by="id"
      multiple
      onClose={() => setQuery("")}
    >
      <div className="relative">
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded-full"
            >
              {item.name}
              <button
                onClick={() => toggleSelect(item)}
                className="hover:text-red-500 focus:outline-none"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="relative">
          <ComboboxInput
            aria-label="Assignee"
            displayValue={() => ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <FaChevronDown className="text-gray-400 w-3 h-3" />
          </div>

          <div className="relative">
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg empty:invisible">
              {filtered.map((person) => (
                <ComboboxOption
                  key={person.id}
                  value={person}
                  className="relative cursor-pointer select-none px-4 py-2 data-[focus]:bg-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <span>{person.name}</span>
                    {isSelected(person) && (
                      <FaCheck className="text-blue-600 w-3 h-3" />
                    )}
                  </div>
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </div>
        </div>
      </div>
    </Combobox>
  );
}
