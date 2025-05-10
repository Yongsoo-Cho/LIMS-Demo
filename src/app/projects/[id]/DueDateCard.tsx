export default function DueDateCard({ date }: { date: string }) {
    const formattedDate = new Date(date).toLocaleDateString();
    return (
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-sm font-medium text-gray-600 mb-1">Due Date</h3>
        <p className="text-gray-800 text-base">{formattedDate}</p>
      </div>
    );
  }