import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: '7lp9d7cd',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)

// Query: lista articoli con paginazione e filtro categoria
export const getPostsQuery = (limit = 9, skip = 0, category = null) => {
  const catFilter = category ? `&& category == "${category}"` : ''
  return `{
    "posts": *[_type == "post" ${catFilter}] | order(published_at desc, _createdAt desc) [${skip}...${skip + limit}] {
      _id,
      title,
      title_en,
      "slug": slug.current,
      category,
      excerpt,
      excerpt_en,
      tags,
      published_at,
      _createdAt,
      "cover_image": cover_image.asset->url,
    },
    "total": count(*[_type == "post" ${catFilter}])
  }`
}

// Query: singolo articolo per slug
export const getPostBySlugQuery = (slug) => `
  *[_type == "post" && slug.current == "${slug}"][0] {
    _id,
    title,
    title_en,
    "slug": slug.current,
    category,
    excerpt,
    excerpt_en,
    content,
    content_en,
    tags,
    seo_title,
    seo_description,
    published_at,
    _createdAt,
    "cover_image": cover_image.asset->url,
  }
`

// Query: ultimi 3 articoli per la homepage
export const getLatestPostsQuery = () => `
  *[_type == "post"] | order(published_at desc, _createdAt desc) [0...3] {
    _id,
    title,
    title_en,
    "slug": slug.current,
    category,
    excerpt,
    excerpt_en,
    published_at,
    _createdAt,
    "cover_image": cover_image.asset->url,
  }
`
