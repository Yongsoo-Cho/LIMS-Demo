import type { Node } from '@xyflow/react';
import { Project } from '@/app/types/project';

export const baseNodeStyle = {
  padding: 20,
  borderRadius: 14,
  border: '1px solid #e5e7eb',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  width: 280,
};

export const projectConfigs: (Project & { x: number; y: number; next?: string[] })[] = [
    {
      id: '1',
      name: 'Find a lab space',
      description: 'Reach out to the BI and beg.',
      status: 'In Progress',
      assignees: ['Binjal P', 'Bogdana B', 'Alice P', 'Arnica K'],
      due_date: '2025-04-15',
      x: 0,
      y: 0,
      next: ['2'],
    },
    {
      id: '2',
      name: 'Make Competent Cells',
      description: 'Make the only thing I know we need to do in lab.',
      status: 'Planning',
      assignees: ['Lavan C', 'Bohmie S'],
      due_date: '2025-04-30',
      x: 400,
      y: 240,
    },
];

export const initialNodes: Node[] = projectConfigs.map(
  ({ id, name, description, status, assignees, due_date, x, y }) => ({
    id,
    position: { x, y },
    data: {
      label: (
        <div className="flex flex-col gap-3 text-left">
          <div>
            <h3 className="text-base font-semibold text-gray-900 leading-snug">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status}
            </span>
            <span className="text-xs text-gray-400 font-medium">Due: {due_date}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {assignees.map((name, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
              >
                {name}
              </span>
            ))}
          </div>

          <button className="w-fit text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 transition hover:underline">
            View Details →
          </button>
        </div>
      ),
    },
    style: baseNodeStyle,
  })
);