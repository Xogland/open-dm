"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Save, Loader2 } from "lucide-react";
import { Status, OrganizationType } from "../providers/user-data-provider";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Star } from "lucide-react";

interface OrgStatusesFormProps {
    organization: OrganizationType;
    onUpdateStatuses: (statuses: Status[]) => Promise<void>;
}

const COLORS = [
    { name: "Gray", value: "#64748b" },
    { name: "Slate", value: "#334155" },
    { name: "Red", value: "#ef4444" },
    { name: "Orange", value: "#f97316" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Yellow", value: "#eab308" },
    { name: "Lime", value: "#84cc16" },
    { name: "Green", value: "#22c55e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Violet", value: "#8b5cf6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Fuchsia", value: "#d946ef" },
    { name: "Pink", value: "#ec4899" },
    { name: "Rose", value: "#f43f5e" },
];

interface SortableStatusItemProps {
    status: Status;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Status>) => void;
    onSetDefault: (id: string) => void;
}

function SortableStatusItem({ status, onDelete, onUpdate, onSetDefault }: SortableStatusItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: status.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-4 p-2 pl-3 border rounded-xl bg-card hover:border-primary/30 transition-all group">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-primary transition-colors">
                <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex items-center gap-3 flex-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="w-5 h-5 rounded-full shadow-sm hover:scale-110 transition-transform flex-shrink-0"
                            style={{ backgroundColor: status.color }}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-[180px] p-2" side="bottom" align="start">
                        <div className="grid grid-cols-5 gap-1.5">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-border transition-all hover:scale-110",
                                        status.color === c.value ? "ring-2 ring-primary ring-offset-2" : ""
                                    )}
                                    style={{ backgroundColor: c.value }}
                                    onClick={() => onUpdate(status.id, { color: c.value })}
                                />
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <Input
                    value={status.label}
                    onChange={(e) => onUpdate(status.id, { label: e.target.value })}
                    className="h-9 border-transparent focus:border-input bg-transparent hover:bg-muted/50 transition-colors shadow-none text-sm font-medium"
                    placeholder="Status name..."
                />
            </div>

            <div className="flex items-center gap-2 pr-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-8 gap-1.5 px-2 font-semibold transition-all rounded-lg",
                        status.isDefault
                            ? "text-primary bg-primary/10 hover:bg-primary/20"
                            : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => onSetDefault(status.id)}
                >
                    <Star className={cn("h-3.5 w-3.5", status.isDefault && "fill-current")} />
                    <span className="text-[10px] uppercase tracking-wider">{status.isDefault ? "Default" : "Set Default"}</span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => onDelete(status.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export function OrgStatusesForm({ organization, onUpdateStatuses }: OrgStatusesFormProps) {
    const [statuses, setStatuses] = useState<Status[]>(organization.statuses || []);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (organization.statuses) {
            setStatuses(organization.statuses);
        } else {
            // Add initial default statuses if none exists
            setStatuses([
                { id: crypto.randomUUID(), label: "New", color: "#64748b", isDefault: true },
                { id: crypto.randomUUID(), label: "In Review", color: "#6366f1", isDefault: false },
                { id: crypto.randomUUID(), label: "Working", color: "#3b82f6", isDefault: false },
                { id: crypto.randomUUID(), label: "Completed", color: "#22c55e", isDefault: false },
            ]);
        }
    }, [organization.statuses]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setStatuses((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddStatus = () => {
        if (statuses.length >= 10) return;

        const newStatus: Status = {
            id: crypto.randomUUID(),
            label: "New Status",
            color: COLORS[statuses.length % COLORS.length].value,
            isDefault: statuses.length === 0,
        };
        setStatuses([...statuses, newStatus]);
    };

    const handleDeleteStatus = (id: string) => {
        const newStatuses = statuses.filter((s) => s.id !== id);
        // If we deleted the default one, pick the first one as default
        if (statuses.find(s => s.id === id)?.isDefault && newStatuses.length > 0) {
            newStatuses[0].isDefault = true;
        }
        setStatuses(newStatuses);
    };

    const handleUpdateStatus = (id: string, updates: Partial<Status>) => {
        setStatuses(statuses.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const handleSetDefault = (id: string) => {
        setStatuses(statuses.map((s) => ({
            ...s,
            isDefault: s.id === id
        })));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdateStatuses(statuses);
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = JSON.stringify(statuses) !== JSON.stringify(organization.statuses);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Submission Statuses</CardTitle>
                    <CardDescription>
                        Define custom statuses for your submissions. Max 10.
                    </CardDescription>
                </div>
                <Button
                    onClick={handleAddStatus}
                    disabled={statuses.length >= 10}
                    variant="outline"
                    size="sm"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Status
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={statuses.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {statuses.map((status) => (
                                <SortableStatusItem
                                    key={status.id}
                                    status={status}
                                    onDelete={handleDeleteStatus}
                                    onUpdate={handleUpdateStatus}
                                    onSetDefault={handleSetDefault}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges || statuses.length === 0}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Statuses
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
