// import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import "../../../../../css/dashboard-admin.css";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    className?: string;
}

export default function StatCard({
    label,
    value,
    icon,
    className
}: StatCardProps) {
    console.log("StatCard:", label, value); // DEBUG
    const colorClass =
        className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <div className="admin-stat">
            <div className="admin-stat-value flex items-center gap-2 ">
                {icon && <span>{icon}</span>}
                {value}
            </div>
            <div className="admin-stat-label">{label}</div>
        </div>
    );
}
