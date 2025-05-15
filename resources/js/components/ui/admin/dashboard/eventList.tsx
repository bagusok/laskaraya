import "../../../../../css/dashboard-admin.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

interface Event {
    name: string;
    date: string;
    category: string;
}

interface EventListProps {
    events: Event[];
    className?: string;
}

export default function EventList({ events, className }: EventListProps) {
    const colorClass =
        className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <div className="admin-card">
            <div className="admin-card-header">Daftar Event</div>
            <div className="admin-card-content">
                <Card
                    className={`border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all ${colorClass}`}
                >
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Acara Mendatang
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm text-gray-500 hover:text-purple-600 hover:bg-purple-100/30 transition-colors duration-200"
                            >
                                Lihat Semua{" "}
                                <ArrowRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {events.map((event, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-purple-100/30 hover:scale-[1.02] hover:shadow-sm rounded-md px-2 transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100/30 rounded-md mr-4 group-hover:bg-purple-200/50">
                                            <Calendar
                                                size={18}
                                                className="text-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 hover:text-purple-700 transition-colors duration-200">
                                                {event.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {event.date}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-purple-100/30 px-3 py-1 rounded-full text-purple-700 hover:bg-purple-200/50 transition-colors duration-200">
                                        {event.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
