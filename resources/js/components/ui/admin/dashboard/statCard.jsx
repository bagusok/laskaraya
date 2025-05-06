import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, icon, className }) {
    const colorClass = className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <Card className={`border-none shadow-sm shadow-purple-300/90 hover:shadow-md transition-all ${colorClass}`}>
            <CardContent className="p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-white/90 shadow-sm">{icon}</div>
                    <span className="text-4xl font-bold text-gray-800">{value}</span>
                </div>
                <p className="text-gray-600 text-sm font-medium">{label}</p>
            </CardContent>
        </Card>
    );
}
