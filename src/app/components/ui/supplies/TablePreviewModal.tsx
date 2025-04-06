"use client";

interface TablePreviewModalProps {
  onApply: () => void;
  onCancel: () => void;
}

export default function TablePreviewModal({
  onApply,
  onCancel,
}: TablePreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Preview Uploaded Data
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Review the data below before confirming. If it looks correct, click
          Apply.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
