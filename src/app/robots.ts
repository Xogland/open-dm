import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/settings/',
                '/inbox/',
                '/connections/',
                '/storage/',
                '/teams/',
                '/onboarding/',
                '/edit/',
                '/api/',
            ],
        },
        sitemap: 'https://opendm.io/sitemap.xml',
    }
}
