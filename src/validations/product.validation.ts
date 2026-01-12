import { z } from 'zod'

/**
 * -----------------------------------------
 * SHARED VALIDATORS
 * -----------------------------------------
 */
const ObjectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId')

export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    search: z.string().optional(),
})

/**
 * -----------------------------------------
 * PRODUCT SCHEMAS
 * -----------------------------------------
 */

export const CreateProductSchema = z
    .object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().min(1, 'Description is required'),
        price: z.number().positive('Price must be positive'),
        image: z.string().url('Invalid image URL'),
    })
    .strict()

export const UpdateProductSchema = CreateProductSchema.partial().strict()

export const ProductIdSchema = z.object({
    id: ObjectIdSchema,
})

export const ProductSlugSchema = z.object({
    slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
})

export const InfiniteScrollSchema = z.object({
    limit: z.coerce.number().int().positive().default(10),
    cursor: z.string().datetime().optional(), // ISO date string
})
