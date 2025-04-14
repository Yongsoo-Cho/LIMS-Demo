"use client";

import AuthLayout from "../components/layouts/AuthLayout";
import { useState } from "react";
import CsvUploader from "./oldComponents/CsvUploader";
import SuppliesTable from "./oldComponents/SuppliesTable";
import TablePreviewModal from "./oldComponents/TablePreviewModal";

type SupplyItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  [key: string]: string | number;
};

const initialData: SupplyItem[] = [
  { id: "1", name: "LB Broth", quantity: 500, unit: "mL" },
  { id: "2", name: "Agar Powder", quantity: 250, unit: "g" },
];

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<SupplyItem[]>(initialData);
  const [previewData, setPreviewData] = useState<SupplyItem[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleUpload = (data: SupplyItem[]) => {
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
        <p>A few notes: this does not store on database. I want to add:</p>
        <ul className="list-disc ml-6 space-y-2 text-gray-800">
          <li>Alert configurations: when to send alerts to and to who</li>
          <li>
            A field in the database that takes a JSON called FEATURES that makes
            it so that uploaded columns arent limited to a predetermined schema
          </li>
          <li>
            Intelligent inference of data fields e.g. a whole column is 0 and
            1s, infer that this a boolean field
          </li>
          <li>Automatic determination of header rows</li>
          <li>
            Ability to add or at least infer ENUM types? like dropdowns, idk how
          </li>
          <li>Merge suggestions for similar items</li>
          <li>Reordering suggestions (and perhaps a storefront if it fits)</li>
        </ul>
        <CsvUploader<SupplyItem> onUpload={handleUpload} />
        <SuppliesTable<SupplyItem> data={activeData} setData={setActiveData} />
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
