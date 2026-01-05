import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ storageId: string }> }
) {
    const { storageId: storageIdParam } = await params;
    const storageId = storageIdParam as Id<"_storage">;
    const searchParams = request.nextUrl.searchParams;
    const fileName = searchParams.get("name") || "download";

    try {
        const url = await convex.query(api.attachment.getStorageUrl, { storageId });

        if (!url) {
            return new NextResponse("File not found", { status: 404 });
        }

        const response = await fetch(url);
        if (!response.ok) {
            return new NextResponse("Failed to fetch file", { status: response.status });
        }

        const contentType = response.headers.get("content-type") || "application/octet-stream";
        const arrayBuffer = await response.arrayBuffer();

        // Force download with Content-Disposition
        const headers = new Headers();
        headers.set("Content-Type", contentType);
        headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);

        return new NextResponse(arrayBuffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Download error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
