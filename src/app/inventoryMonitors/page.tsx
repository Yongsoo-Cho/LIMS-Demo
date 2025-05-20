import AuthLayout from "../components/layouts/AuthLayout";

export default function InventoryMonitorsPage() {
  return (
    <AuthLayout>
      <div>
        <h1>
          We have a SupplyPolicies table and users can generate different supply
          policies.
        </h1>
        <ul className="list-disc ml-6 space-y-2 text-gray-800">
          <li>
            A supply policy could entail fields for autoOrder, notifyUsers,
            lowStockWarning, perishingSoon, where the user would set parameters
            for these fields which reference a row in the supplies table.
          </li>
          <li>
            and then once per day (or at intervals that make sense) we run code
            that iterates through the SupplyPolicies and checks all these fields
            and notifes, or prepares orders accordingly
          </li>
          <li>
            if a row does not exist in the supplies table thats referenced in
            SupplyPolicies, we keep that policiy so we can edit it with a new
            row entry, but it will be in an unactivated state
          </li>
          <li>
            we can have policy templates where users can make a policy for
            Reagent Expiries or Pipette Recalibrations
          </li>
        </ul>
      </div>
    </AuthLayout>
  );
}
