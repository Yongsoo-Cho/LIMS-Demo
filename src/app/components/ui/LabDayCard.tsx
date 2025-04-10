import { FaFlask, FaUserTie } from "react-icons/fa";

interface LabUser {
  id: string;
  name: string;
  position: string;
  protocol: string;
}

interface LabDayCardProps {
  date: string;
  assignees: LabUser[];
}

export default function LabDayCard({ date, assignees }: LabDayCardProps) {
  return (
    <div className="bg-white shadow-md rounded-md p-4 w-full max-w-2xl border border-gray-200 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Lab Assignments for {date}
      </h2>
      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
            <th className="px-4 py-2 rounded-tl-md">Name</th>
            <th className="px-4 py-2">Assigned Protocol</th>
            <th className="px-4 py-2 rounded-tr-md">Position</th>
          </tr>
        </thead>
        <tbody>
          {assignees.map(({ id, name, position, protocol }, idx) => (
            <tr
              key={id}
              className={`border-b ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 transition`}
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                {name}
              </td>
              <td className="px-4 py-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <FaFlask className="text-gray-400" />
                  {protocol}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <FaUserTie className="text-gray-400" />
                  {position}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Example usage (placeholder data):
/*
<LabDayCard
  date="March 31, 2025"
  assignees={[
    {
      id: '1',
      name: 'Jane Doe',
      position: 'Research Assistant',
      protocol: 'Protein Extraction v2.1',
    },
    {
      id: '2',
      name: 'John Smith',
      position: 'Lab Manager',
      protocol: 'Microscopy Calibration',
    },
  ]}
/>
*/
