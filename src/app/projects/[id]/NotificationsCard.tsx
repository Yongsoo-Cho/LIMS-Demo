export default function NotificationsCard({ message }: { message: string }) {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Notifications</h3>
      <p className="text-gray-800 text-base">{message}</p>
    </div>
  );
}
