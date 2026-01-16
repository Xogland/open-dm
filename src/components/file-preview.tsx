import React from "react";
import { FileIcon, FileAudio, FileText, Image as ImageIcon } from "lucide-react";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { FaFileWord } from "react-icons/fa";

interface FilePreviewProps {
    name: string;
    type: string;
    url: string | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ name, type, url }) => {
    if (type.startsWith("image/") && url) {
        return (
            <div className="relative w-full h-full bg-secondary/10 flex items-center justify-center overflow-hidden group">
                {/* Placeholder Icon while loading or if image fails */}
                <ImageIcon className="h-12 w-12 text-muted-foreground/20 absolute" />

                {/* Actual Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={url}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
        );
    }

    if (type.startsWith("audio/")) {
        return (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                <FileAudio className="h-16 w-16 text-orange-500/60" />
            </div>
        );
    }

    if (type === "application/pdf") {
        return (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                <BsFileEarmarkPdf className="h-16 w-16 text-red-500/60" />
            </div>
        );
    }

    if (type === "application/msword" || type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                <FaFileWord className="h-16 w-16 text-blue-500/60" />
            </div>
        );
    }

    if (type.startsWith("text/")) {
        return (
            <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                <FileText className="h-16 w-16 text-gray-500/60" />
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
            <FileIcon className="h-16 w-16 text-muted-foreground/40" />
        </div>
    );
};
