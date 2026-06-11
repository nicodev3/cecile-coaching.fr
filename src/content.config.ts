import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
		schema: ({ image }) =>
		z.object({
			title: z.string(),
			/** Title SEO (<title>) si différent du H1 ; utilisé verbatim, sans suffixe de marque */
			seoTitle: z.string().optional(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			/** Maillage SEO vers les pages piliers */
			relatedPillars: z.array(z.enum(['apa', 'maladie-chronique', 'fatigue'])).optional(),
		}),
});

export const collections = { blog };
