import { JoinRoomForm } from "@/components/forms/Joinroom-form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export default function Dashboard() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-accent p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Real Time Chat</CardTitle>
                    <CardDescription>Lorem, ipsum dolor Lorem, ipsum dolor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <JoinRoomForm />
                </CardContent>
            </Card>
        </div>
    )
}