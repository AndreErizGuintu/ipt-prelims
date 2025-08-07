import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Handler for GET requests to fetch user information by userId
export async function GET(
    request: Request,
    { params }: { params: { userId: string } },
) {
    try {
        const userId = params.userId;
        // Check if userId is provided in the route parameters
        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 },
            );
        }

        // Initialize Clerk client
        const client = await clerkClient();
        // Fetch user information using Clerk's API
        const uploaderInfo = await client.users.getUser(userId);

        // Return selected user information as JSON
        return NextResponse.json({
            fullName: uploaderInfo.fullName,
            username: uploaderInfo.username,
            emailAddress: uploaderInfo.emailAddresses[0]?.emailAddress || "",
        });
    } catch (error) {
        // Log and return error response if fetching fails
        console.error("Error fetching user info:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch user information",
            },
            { status: 500 },
        );
    }
}