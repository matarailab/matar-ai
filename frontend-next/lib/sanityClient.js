import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '7lp9d7cd',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: process.env.NEXT_PUBLIC_SANITY_USE_CDN !== 'false',
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

export const getPostsQuery = (limit = 10, skip = 0, category = null) => {
  const categoryFilter = category ? `&& category == "${category}"` : '';
  return `*[_type == "post" ${categoryFilter}] | order(published_at desc)[${skip}...${skip + limit}] {
    _id,
    title,
    slug,
    excerpt,
    content,
    "mainImage": cover_image { ..., asset-> },
    author,
    "publishedAt": published_at,
    category,
    seo_title,
    seo_description,
    tags
  }`;
};

export const getPostBySlugQuery = (slug) => `*[_type == "post" && slug.current == "${slug}"][0] {
  _id,
  title,
  slug,
  content,
  "mainImage": cover_image { ..., asset-> },
  author,
  "publishedAt": published_at,
  category,
  seo_title,
  seo_description,
  tags,
  excerpt
}`;

export const getLatestPostsQuery = (limit = 3) => `*[_type == "post"] | order(published_at desc)[0...${limit}] {
  _id,
  title,
  slug,
  excerpt,
  "mainImage": cover_image,
  "publishedAt": published_at,
  category,
  tags
}`;

export const getCategoriesQuery = () => `*[_type == "category"] {
  _id,
  title,
  slug
}`;

export const getPostCountQuery = (category = null) => {
  const categoryFilter = category ? `&& category == "${category}"` : '';
  return `count(*[_type == "post" ${categoryFilter}])`;
};
