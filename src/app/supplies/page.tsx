"use client";

import AuthLayout from "../components/layouts/AuthLayout";
import { useState } from "react";
import CsvUploader from "../components/ui/supplies/CsvUploader";
import SuppliesTable from "../components/ui/supplies/SuppliesTable";
import TablePreviewModal from "../components/ui/supplies/TablePreviewModal";

const initialData = [
  { id: "1", name: "LB Broth", quantity: 500, unit: "mL" },
  { id: "2", name: "Agar Powder", quantity: 250, unit: "g" },
];

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<any[]>(initialData);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpload = (data: any[]) => {
    setPreviewData(data);
    setShowPreview(true);
  };

  const handleApplyPreview = () => {
    if (previewData) setSupplies(previewData);
    setPreviewData(null);
    setShowPreview(false);
  };

  const handleCancelPreview = () => {
    setPreviewData(null);
    setShowPreview(false);
  };

  const activeData = previewData ?? supplies;
  const setActiveData = previewData ? setPreviewData : setSupplies;

  return (
    <AuthLayout>
      <main className="flex flex-col gap-6 w-full p-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Supplies Inventory
        </h1>
        <CsvUploader onUpload={handleUpload} />
        <SuppliesTable data={activeData} setData={setActiveData} />
        {showPreview && (
          <TablePreviewModal
            onApply={handleApplyPreview}
            onCancel={handleCancelPreview}
          />
        )}
      </main>
    </AuthLayout>
  );
}
