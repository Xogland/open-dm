import {
  CalendarDaysIcon,
  CheckCircle2,
  GlobeIcon,
  PhoneCallIcon,
  PlusIcon,
  Trash2Icon,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import PreviewBox from "./preview-box";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SOCIAL_PLATFORMS, CALENDAR_PLATFORMS, getCalendarIcon } from "@/constants/social-platforms";
import { getPlanConfig, SubscriptionPlan } from "@/features/subscription/config/plan-config";
export type FormContentData = {
  title?: string;
  description: string;
  contactType: string;
  phone: string;
  profile: string;
  website: string;
  calendarLink: string;
  socialLinks: Record<string, string>;
  tags: string[];
  services: {
    id: string | number;
    title: string;
  }[];
};



export default function ContentSection({
  data,
  onChange,
  onServiceDelete,
  orgHandle,
  orgName,
  orgImage,
  organisationId,
  readOnly,
  plan,
  workflows,
}: {
  data: FormContentData;
  onChange: (data: FormContentData) => void;
  onServiceDelete?: (serviceTitle: string) => void;
  orgHandle: string;
  orgName: string;
  orgImage?: string | null;
  organisationId?: string;
  readOnly?: boolean;
  plan?: string;
  workflows?: Record<string, any[]>;
}) {
  const properties = data;
  const generateUploadUrl = useMutation(api.attachment.generateUploadUrl);
  const updateOrganisationImage = useMutation(api.organisation.updateOrganisationImage);
  const removeOrganisationImage = useMutation(api.organisation.removeOrganisationImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [newSocialLink, setNewSocialLink] = useState<string>("");
  const [deletingServiceIndex, setDeletingServiceIndex] = useState<number | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const profileUrl = `${origin}/${orgHandle}`;

  const [newTag, setNewTag] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);


  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (properties.tags.length >= 2) return;

    onChange({
      ...properties,
      tags: [...properties.tags, newTag.trim()]
    });
    setNewTag("");
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...properties.tags];
    newTags.splice(index, 1);
    onChange({
      ...properties,
      tags: newTags
    });
  };

  const handleStateChange = (field: string, value: string) => {
    onChange({
      ...properties,
      [field]: value,
    });
  };

  // Determine enabled contacts based on non-empty values
  // We'll manage "enabled" state locally to allow toggling even if empty
  // But to sync with "max 2" rule, we need to track what the user explicitly enabled
  const [enabledContacts, setEnabledContacts] = useState<string[]>(() => {
    const active = [];
    if (properties.profile) active.push("profile");
    if (properties.phone) active.push("phone");
    if (properties.website) active.push("website");
    if (properties.calendarLink) active.push("calendarLink");

    // Auto-select profile if none selected
    if (active.length === 0) {
      active.push("profile");
    }

    return active.slice(0, 2); // Limit to 2 initially
  });

  const getCalendarInfo = (url: string) => {
    if (!url) return null;
    const lowUrl = url.toLowerCase();
    return CALENDAR_PLATFORMS.find(p => p.domains.some(d => lowUrl.includes(d)));
  };

  // Ensure profile URL is set if it's enabled but empty (initial load case)
  // Also ensures at least one visible contact exists
  // Ensure profile URL is set if it's enabled but empty (initial load case)
  // Also ensures at least one visible contact exists
  useEffect(() => {
    // Check if we have at least one contact that will actually show a button
    const hasVisibleContact = enabledContacts.some(id => {
      if (id === 'profile') return true;
      const val = properties[id as keyof FormContentData] as string;
      return val && val.trim().length > 0;
    });

    if (enabledContacts.includes('profile') && !properties.profile) {
      handleStateChange('profile', profileUrl);
    } else if (!hasVisibleContact) {
      // If no other contact has a value, we MUST enable profile
      // Check if profile is already enabled inside the setter to avoid loop
      setEnabledContacts(prev => {
        if (prev.includes('profile')) return prev;

        if (prev.length >= 2) {
          // Replace the first one to stay within limit
          return ['profile', prev[0]];
        }
        return [...prev, 'profile'];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabledContacts, properties.profile, properties.phone, properties.website, properties.calendarLink, profileUrl]);

  const toggleContact = (type: string) => {
    if (enabledContacts.includes(type)) {
      const newEnabled = enabledContacts.filter((t) => t !== type);

      // Rule: If we disable something and nothing is left, auto-enable profile and set its URL
      if (newEnabled.length === 0) {
        setEnabledContacts(['profile']);
        handleStateChange('profile', profileUrl);
        // Clear value of the one we disabled
        handleStateChange(type, '');
        return;
      }

      setEnabledContacts(newEnabled);
      handleStateChange(type, '');
    } else {
      if (enabledContacts.length < 2) {
        setEnabledContacts([...enabledContacts, type]);
        if (type === 'profile') {
          handleStateChange('profile', profileUrl);
        }
      }
    }
  };

  const handleSocialLinkAdd = () => {
    if (Object.keys(properties.socialLinks).length >= 7) {
      toast.error("Social items limit reached", {
        description: "You can only add up to 7 social profiles."
      });
      return;
    }

    if (selectedPlatform && newSocialLink) {
      onChange({
        ...properties,
        socialLinks: {
          ...properties.socialLinks,
          [selectedPlatform]: newSocialLink,
        },
      });
      setSelectedPlatform("");
      setNewSocialLink("");
    }
  };

  const handleSocialLinkRemove = (platform: string) => {
    const newLinks = { ...properties.socialLinks };
    delete newLinks[platform];
    onChange({
      ...properties,
      socialLinks: newLinks,
    });
  };

  const handleAddService = () => {
    // Check limits
    if (plan) {
      const config = getPlanConfig(plan as SubscriptionPlan);
      const limit = config.limits.servicesLimit;
      if ((properties.services?.length || 0) >= limit) {
        toast.error(`Plan limit reached`, {
          description: `The ${config.name} plan allows a maximum of ${limit} services. Please upgrade to add more.`
        });
        return;
      }
    }

    const newService = {
      id: Date.now().toString(),
      title: "",
    };
    onChange({
      ...properties,
      services: [...(properties.services || []), newService],
    });
  };

  const confirmDeleteService = () => {
    if (deletingServiceIndex === null) return;

    const serviceTitle = properties.services[deletingServiceIndex].title;

    // Notify parent to cleanup workflows
    if (onServiceDelete) {
      onServiceDelete(serviceTitle);
    }

    // Remove from content
    const newServices = [...properties.services];
    newServices.splice(deletingServiceIndex, 1);
    onChange({
      ...properties,
      services: newServices,
    });

    setDeletingServiceIndex(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!organisationId) {
      toast.error("Organization ID not found");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();

      // 2. Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = await result.json();

      // 3. Update organization
      await updateOrganisationImage({
        organisationId: organisationId as Id<"organisations">,
        storageId: storageId as Id<"_storage">,
      });

      toast.success("Image updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageRemove = async () => {
    if (!organisationId) return;

    try {
      await removeOrganisationImage({
        organisationId: organisationId as Id<"organisations">,
      });
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  return (
    <div className="w-full h-full flex flex-row gap-6 overflow-hidden">
      {/* Preview Section - Left, Centralised */}
      <div className="flex-1 h-full min-w-0 flex justify-center items-start overflow-hidden">
        <PreviewBox
          orgName={orgName}
          orgImage={orgImage || undefined}
          focusedField={focusedField}
          formData={{
            properties: {
              title: properties.title,
              description: properties.description,
              contactInfo: {
                profile: properties.profile,
                phone: properties.phone,
                website: properties.website,
                calendarLink: properties.calendarLink,
              },
              socialLinks: properties.socialLinks,
              tags: properties.tags,
            },
            services: properties.services.map((s) => ({
              id: String(s.id),
              title: s.title,
            })),
            workflows: workflows || {},
          }}

          orgHandle={orgHandle}
        />
      </div>

      {/* Properties Section - Right, 1/3 width */}
      <div className="w-1/3 h-full overflow-y-auto custom-scrollbar border-l-1 p-4 flex-shrink-0">
        {/* --- LEFT SIDEBAR CONTENT (Core properties) --- */}
        <div className="space-y-6">
          {/* Organisation Image */}
          <div className="flex items-center gap-4 p-4 bg-muted/10 border border-border rounded-xl">
            <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
              <AvatarImage
                src={orgImage || undefined}
                className="object-cover"
              />
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {orgName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  Organisation Avatar
                </span>
                <span className="text-xs text-muted-foreground">
                  Appears in chat & preview
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || readOnly}
                >
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Button>
                {orgImage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={handleImageRemove}
                    disabled={readOnly}
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <Typography variant="h4" as="h2">
            Title
          </Typography>
          <Input
            placeholder="Enter a title (e.g. Senior Product Designer)"
            value={properties.title || ""}
            onChange={(e) =>
              handleStateChange("title", e.target.value.substring(0, 40))
            }
            onFocus={() => setFocusedField("title")}
            onBlur={() => setFocusedField(null)}
            maxLength={40}
            className="bg-muted/30 border-input text-foreground"
            disabled={readOnly}
          />
          <p className="text-right text-xs text-muted-foreground mt-1">
            {(properties.title?.length || 0)} / 40
          </p>

          <Typography variant="h4" as="h2">
            Description
          </Typography>
          <Textarea
            placeholder="Enter a short description (max 200 chars)"
            value={properties.description}
            onChange={(e) =>
              handleStateChange("description", e.target.value.substring(0, 200))
            }
            onFocus={() => setFocusedField("description")}
            onBlur={() => setFocusedField(null)}
            maxLength={200}
            className="bg-muted/30 border-input text-foreground min-h-[100px]"
            disabled={readOnly}
          />
          <p className="text-right text-xs text-muted-foreground mt-1">
            {properties.description.length} / 200
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Typography variant="h4" as="h2">
                Tags
              </Typography>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                {properties.tags?.length || 0}/2
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (max 16 chars)"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value.substring(0, 16))}
                onFocus={() => setFocusedField("tags")}
                onBlur={() => setFocusedField(null)}
                maxLength={16}
                className="bg-muted/30 border-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTag();
                }}
                disabled={(properties.tags?.length || 0) >= 2 || readOnly}
              />
              <Button
                variant="secondary"
                onClick={handleAddTag}
                disabled={
                  !newTag || (properties.tags?.length || 0) >= 2 || readOnly
                }
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {properties.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-destructive transition-colors ml-1"
                    disabled={readOnly}
                  >
                    <Trash2Icon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Typography variant="h4" as="h2">
              Contact Methods
            </Typography>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {enabledContacts.length}/2 Active
            </span>
          </div>

          <Card className="p-4 bg-muted/10 border-border">
            <div className="space-y-4">
              {[
                { id: "profile", label: "Share Link", icon: Share2 },
                { id: "phone", label: "Phone Number", icon: PhoneCallIcon },
                { id: "website", label: "Website", icon: GlobeIcon },
                {
                  id: "calendarLink",
                  label: "Scheduling (Calendar)",
                  icon: CalendarDaysIcon,
                },
              ].map((item) => {
                const calendarInfo =
                  item.id === "calendarLink"
                    ? getCalendarInfo(properties.calendarLink)
                    : null;
                const Icon =
                  item.id === "calendarLink"
                    ? getCalendarIcon(properties.calendarLink)
                    : item.icon;
                const isProfileForceEnabled =
                  item.id === "profile" &&
                  enabledContacts.includes("profile") &&
                  !enabledContacts.some(
                    (id) =>
                      id !== "profile" &&
                      (
                        properties[id as keyof FormContentData] as string
                      )?.trim(),
                  );

                return (
                  <div key={item.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <Label
                          htmlFor={`switch-${item.id}`}
                          className="cursor-pointer"
                        >
                          {item.label}
                        </Label>
                      </div>
                      <Switch
                        id={`switch-${item.id}`}
                        checked={enabledContacts.includes(item.id)}
                        onCheckedChange={() => toggleContact(item.id)}
                        onFocus={() => setFocusedField(`contact-${item.id}`)}
                        onBlur={() => setFocusedField(null)}
                        disabled={
                          (!enabledContacts.includes(item.id) &&
                            enabledContacts.length >= 2) ||
                          isProfileForceEnabled ||
                          readOnly
                        }
                      />
                    </div>

                    {enabledContacts.includes(item.id) && (
                      <div className="pl-6 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="relative">
                          <Input
                            placeholder={
                              item.id === "profile"
                                ? "Profile Link"
                                : `Enter ${item.label.toLowerCase()}...`
                            }
                            value={
                              properties[
                              item.id as keyof FormContentData
                              ] as string
                            }
                            onChange={(e) =>
                              handleStateChange(item.id, e.target.value)
                            }
                            onFocus={() =>
                              setFocusedField(`contact-${item.id}`)
                            }
                            onBlur={() => setFocusedField(null)}
                            className={`bg-background/50 border-input h-9 ${item.id === "calendarLink" && properties.calendarLink && !calendarInfo ? "border-destructive/50" : ""}`}
                            disabled={item.id === "profile" || readOnly}
                            readOnly={item.id === "profile"}
                          />
                          {item.id === "calendarLink" &&
                            properties.calendarLink && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {calendarInfo ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                )}
                              </div>
                            )}
                        </div>
                        {item.id === "calendarLink" &&
                          properties.calendarLink &&
                          !calendarInfo && (
                            <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                              Use Calendly, Google, Zoho, or Zoom links
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="my-6 border-t" />

        {/* --- RIGHT SIDEBAR CONTENT (Secondary properties) --- */}
        <div className="space-y-6">
          <CardTitle className="text-lg">Social Profiles</CardTitle>

          <div className="flex flex-col gap-3">
            {/* Active Social Links List */}
            <div className="space-y-2">
              {Object.keys(properties.socialLinks).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 bg-muted/10 rounded-lg border border-dashed border-border">
                  <Share2 className="w-8 h-8 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    No social profiles added yet
                  </p>
                  <p className="text-xs text-muted-foreground/70 text-center mt-1">
                    Add your social media profiles below
                  </p>
                </div>
              ) : (
                Object.entries(properties.socialLinks).map(
                  ([platform, link]) => {
                    const platformInfo = SOCIAL_PLATFORMS.find(
                      (p) => p.name === platform,
                    ) || {
                      name: platform,
                      label: platform.charAt(0) + platform.slice(1),
                      icon: <GlobeIcon className="w-4 h-4" />,
                    };

                    return (
                      <div
                        key={platform}
                        className="flex items-center gap-2 group bg-muted/20 p-2 rounded-md border border-transparent hover:border-border transition-all"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex-shrink-0 text-muted-foreground">
                            {platformInfo.icon}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm leading-none truncate capitalize">
                              {platformInfo.label}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {link}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSocialLinkRemove(platform)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={readOnly}
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  },
                )
              )}
            </div>

            {/* Add New Social Link */}
            <div className="flex flex-col gap-2 pt-2 border-t mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Add New Profile
                </span>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                  {Object.keys(properties.socialLinks).length}/7
                </span>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger
                    className="w-[140px] bg-muted/30"
                    onFocus={() => setFocusedField("socialLinks")}
                    onBlur={() => setFocusedField(null)}
                    disabled={
                      readOnly ||
                      Object.keys(properties.socialLinks).length >= 7
                    }
                  >
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.filter(
                      (p) => !properties.socialLinks[p.name],
                    ).map((platform) => (
                      <SelectItem key={platform.name} value={platform.name}>
                        <div className="flex items-center gap-2">
                          {platform.icon}
                          <span>{platform.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Profile URL..."
                  value={newSocialLink}
                  onChange={(e) => setNewSocialLink(e.target.value)}
                  onFocus={() => setFocusedField("socialLinks")}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-muted/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSocialLinkAdd();
                  }}
                  disabled={
                    readOnly || Object.keys(properties.socialLinks).length >= 7
                  }
                />
              </div>
              <Button
                variant="secondary"
                onClick={handleSocialLinkAdd}
                disabled={
                  !selectedPlatform ||
                  !newSocialLink ||
                  readOnly ||
                  Object.keys(properties.socialLinks).length >= 7
                }
                className="w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" /> Add Profile
              </Button>
            </div>
          </div>

          <div className="my-6 border-t" />

          <CardTitle className="text-lg">Enquiry Subjects</CardTitle>
          {properties.services.map((service, index) => (
            <div key={service.id} className="flex items-center gap-2">
              <Input
                placeholder={`Service ${index + 1} Title`}
                value={service.title}
                onChange={(e) => {
                  const newServices = [...properties.services];
                  newServices[index].title = e.target.value;
                  onChange({
                    ...properties,
                    services: newServices,
                  });
                }}
                onFocus={() => setFocusedField("services")}
                onBlur={() => setFocusedField(null)}
                maxLength={40}
                className="bg-muted/30 border-input text-foreground"
                disabled={readOnly}
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeletingServiceIndex(index)}
                className="text-destructive hover:bg-destructive/10 flex-none"
                disabled={readOnly}
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={handleAddService}
            className="w-full mt-4 bg-secondary border-border hover:bg-secondary/80 text-secondary-foreground"
            disabled={readOnly}
          >
            + Add New Service
          </Button>
        </div>
      </div>

      <AlertDialog
        open={deletingServiceIndex !== null}
        onOpenChange={(open) => !open && setDeletingServiceIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service &quot;
              {deletingServiceIndex !== null
                ? properties.services[deletingServiceIndex].title
                : ""}
              &quot; and its <strong>entire associated workflow</strong>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Service & Workflow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
