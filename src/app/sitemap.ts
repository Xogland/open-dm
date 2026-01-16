import { MetadataRoute } from 'next';
import { CURRENT_PLATFORM_STATUS, PlatformStatus } from '@/constants/platform';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://opendm.io';

    // Base routes always visible
    const routes = [
        '',
        '/about',
        '/contact',
        '/faq',
        '/features',
        '/how-it-works',
        '/privacy',
        '/terms',
        '/pricing',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // If we are in preregistration, we might want to adjust priorities or routes
    if (CURRENT_PLATFORM_STATUS === PlatformStatus.PREREGISTRATION) {
        // Maybe set higher priority for landing and contact
        return routes.map(r => {
            if (r.url === baseUrl) return { ...r, priority: 1.0 };
            return r;
        });
    }

    return routes;
}
