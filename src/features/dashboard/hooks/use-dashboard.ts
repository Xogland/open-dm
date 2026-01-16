import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { useUserData } from "@/features/organization/providers/user-data-provider";
import { useUserAuth } from "@/features/auth/providers/user-auth-provider";
import { startOfMonth, subMonths } from "date-fns";
import { useRouter } from "next/navigation";

export function useDashboard() {
    const { user } = useUserAuth();
    const { selectedOrganization } = useUserData();
    const router = useRouter();

    // Fetch all submissions for the organization
    const submissions = useQuery(api.submission.getSubmissions, {
        organisation: selectedOrganization?._id,
        userEmail: user?.email ?? "",
    });

    const form = useQuery(api.form.get, {
        formId: selectedOrganization?.formId,
    });

    const isLoading = submissions === undefined || form === undefined;

    // Derived Stats
    const stats = useMemo(() => {
        if (!submissions || !form) return null;

        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));

        const totalSubmissions = submissions.length;
        const lastMonthSubmissions = submissions.filter(s => {
            const date = new Date(s._creationTime);
            return date >= startOfLastMonth && date < startOfCurrentMonth;
        }).length;

        // Use total views from the organization object
        const totalViews = selectedOrganization?.views ?? 0;

        // Conversion Rate
        const conversionRate = totalViews > 0
            ? Math.round((totalSubmissions / totalViews) * 100)
            : 0;

        const activeServices = form.services.length;

        return {
            totalSubmissions,
            lastMonthSubmissions,
            activeServices,
            totalViews,
            conversionRate,
        };
    }, [submissions, form, selectedOrganization?.views]);

    // Recent Submissions
    const recentSubmissions = useMemo(() => {
        if (!submissions) return [];
        return [...submissions].sort((a, b) => b._creationTime - a._creationTime).slice(0, 5);
    }, [submissions]);

    // Daily Stats (Last 30 days) - Derive from submissions
    const dailyStats = useMemo(() => {
        if (!submissions) return [];

        // Create a map for the last 30 days
        const map = new Map<string, { date: string, submissions: number, views: number }>();
        const now = new Date();

        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            map.set(key, { date: key, submissions: 0, views: 0 });
        }

        // Fill Submissions
        submissions.forEach(s => {
            const key = new Date(s._creationTime).toISOString().split('T')[0];
            if (map.has(key)) {
                const entry = map.get(key)!;
                entry.submissions++;
                map.set(key, entry);
            }
        });

        // Note: Daily views are no longer tracked to save database space
        return Array.from(map.values());
    }, [submissions]);

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    // Service Distribution (Top 5)
    const serviceDistribution = useMemo(() => {
        if (!submissions) return [];
        const counts = new Map<string, number>();
        submissions.forEach(s => {
            const service = s.service || "General Inquiry";
            counts.set(service, (counts.get(service) || 0) + 1);
        });

        return Array.from(counts.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [submissions]);

    const trends = {
        submissionTrend: stats ? calculateTrend(stats.totalSubmissions, stats.lastMonthSubmissions) : 0,
    };

    return {
        user,
        stats,
        recentSubmissions,
        dailyStats,
        serviceDistribution,
        trends,
        isLoading,
        navigateToInbox: () => router.push("/inbox"),
        navigateToForms: () => router.push("/dashboard"),
    };
}
