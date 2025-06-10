import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Competition } from "../competitions/competition-table/columns";
import { Calendar, Trophy, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Props = {
    competition: Competition;
};

export default function CompetitionDetail({ competition }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    Informasi Kompetisi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={competition.image || "/placeholder.svg"}
                                alt={competition.name}
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">
                                {competition.name}
                            </h2>
                            <div className="flex items-center gap-3 mb-3">
                                <Badge className="bg-purple-100 text-purple-800">
                                    Level {competition.level}
                                </Badge>
                                <Badge className="bg-green-100 text-green-800">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(
                                        competition.start_date
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                        competition.end_date
                                    ).toLocaleDateString()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <User className="h-4 w-4" />
                                <span>Penyelenggara: {competition.author}</span>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Deskripsi</h3>
                            <p className="text-muted-foreground leading-relaxed line-clamp-6">
                                {competition.description}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
