import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface Period {
  id: number;
  name: string;
  status: string;
  events: number;
}

interface PeriodListProps {
  periods: Period[];
  className?: string;
}

export default function PeriodList({ periods, className }: PeriodListProps) {
    const colorClass = className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <Card className={`border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all ${colorClass}`}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-gray-900">Periode</CardTitle>
                    <Button variant="ghost" size="sm" className="text-sm text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-200">
                        <PlusCircle size={16} className="mr-1" /> Tambah
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-4">
                    {periods.map((period, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-amber-50/30 hover:shadow-sm cursor-pointer transition-all duration-200 rounded-md px-2"
                        >
                            <div>
                                <h3 className="font-medium text-gray-900 hover:text-amber-700 transition-colors">{period.name}</h3>
                                <div className="flex items-center mt-1">
                                    <span className={`w-2 h-2 rounded-full mr-2 ${period.status === 'Aktif' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                    <p className="text-xs text-gray-500">{period.status}</p>
                                </div>
                            </div>
                            <span className="text-xs bg-amber-100/30 px-3 py-1 rounded-full text-amber-700 hover:bg-amber-100/50 transition-colors">{period.events} Acara</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
