import { BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

interface FormNameInputProps {
  name: string;
  onChange: (value: string) => void;
}

export default function FormNameInput({ name, onChange }: FormNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingName, setEditingName] = useState(name);

  const handleSave = () => {
    onChange(editingName);
    setIsOpen(false);
  };

  return (
    <>
      {/* The clickable BreadcrumbPage element */}
      <BreadcrumbPage
        className="font-semibold cursor-pointer hover:text-primary transition-colors"
        onClick={() => setIsOpen(true)} // Open the dialog on click
      >
        {name}
      </BreadcrumbPage>

      {/* Shadcn Dialog Component */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Form Name</DialogTitle>
            <DialogDescription>
              Make changes to the form&apos;s name here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {/* Input Field Section */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Save Button */}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleSave}
              // Optional: Disable button if the name hasn't changed or is empty
              disabled={editingName === name || editingName.trim() === ""}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}