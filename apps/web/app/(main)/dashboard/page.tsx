import { JoinRoomForm } from "@/components/forms/Joinroom-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { MessageCircle } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-accent p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-1">
                        <MessageCircle className="w-6 h-6" />
                        Real Time Chat
                        </CardTitle>
                    <CardDescription>Make a Room by just clicking a Button.</CardDescription>
                </CardHeader>
                <CardContent>
                    <JoinRoomForm />
                </CardContent>
            </Card>
        </div>
    )
}