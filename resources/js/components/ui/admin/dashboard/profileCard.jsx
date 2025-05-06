import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Pencil } from "lucide-react";

export default function ProfileCard({ user, showEditButton = true, className }) {
    const colorClass = className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <Card className={`border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all ${colorClass}`}>
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-purple-100/40 text-sepia-700 rounded-full flex items-center justify-center mb-4 ring-2 ring-sepia-200 transition-all duration-300 hover:ring-sepia-400 hover:bg-purple-100/60">
                        <User size={32} className="text-sepia-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg hover:text-sepia-700 transition-colors duration-300">{user?.name || 'Admin'}</h3>
                    <p className="text-gray-600 mb-4 hover:text-gray-800 transition-colors duration-300">{user?.email || 'admin@example.com'}</p>
                    <div className="w-full py-2 px-3 bg-purple-50/50 rounded-md text-center text-sm text-sepia-700 font-medium mb-3 transition-all duration-300 hover:bg-purple-100/70">
                        {user?.role || 'Administrator'}
                    </div>
                    {showEditButton && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-sepia-600 hover:text-sepia-800 hover:bg-blue-100/50 border border-blue-200 rounded-md transition-all duration-300 hover:border-sepia-400"
                        > Edit Profil
                            <Pencil size={16} />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
