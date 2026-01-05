import React from "react";

interface LoadingStateProps {
    message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
    return (
        <div className="flex items-center justify-center p-12">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="ml-3 text-muted-foreground">{message}</p>
        </div>
    );
}
