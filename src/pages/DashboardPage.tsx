import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex gap-2 max-w-sm">
        <Input placeholder="Search submissions..." />
        <Button variant="outline">Search</Button>
      </div>
    </div>
  );
}