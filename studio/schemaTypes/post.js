import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Articolo',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titolo (IT)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: 'Titolo (EN)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'AI per Aziende', value: 'AI per Aziende'},
          {title: 'Automazioni', value: 'Automazioni'},
          {title: 'Formazione AI', value: 'Formazione AI'},
          {title: 'Trend AI', value: 'Trend AI'},
          {title: '3D/AR/VR', value: '3D/AR/VR'},
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'cover_image',
      title: 'Immagine di copertina',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'excerpt',
      title: 'Estratto (IT)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'excerpt_en',
      title: 'Estratto (EN)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Contenuto (IT)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normale', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Citazione', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Grassetto', value: 'strong'},
              {title: 'Corsivo', value: 'em'},
              {title: 'Codice', value: 'code'},
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'caption', type: 'string', title: 'Didascalia'},
            {name: 'alt', type: 'string', title: 'Testo alternativo'},
          ],
        },
      ],
    }),
    defineField({
      name: 'content_en',
      title: 'Contenuto (EN)',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
          },
        },
        {
          type: 'image',
          options: {hotspot: true},
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'seo_title',
      title: 'SEO Title',
      type: 'string',
    }),
    defineField({
      name: 'seo_description',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'published_at',
      title: 'Data pubblicazione',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'cover_image',
    },
    prepare({title, category, media}) {
      return {title, subtitle: category, media}
    },
  },
})
