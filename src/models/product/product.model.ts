import { Schema, model, Document } from 'mongoose'

export interface IProduct extends Document {
    name: string
    slug: string
    description: string
    price: number
    image: string
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true, // 🔥 index for fast lookup
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
            index: true, // useful for sorting & filtering
        },
        image: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true, // important for soft delete queries
        },
    },
    {
        timestamps: true,
    }
)


ProductSchema.pre('validate', async function (this: IProduct) {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
    }
})

/**
 * Compound index (optional but powerful)
 * Example use case: find active products fast
 */
ProductSchema.index({ slug: 1, isDeleted: 1 })

export const ProductModel = model<IProduct>('Product', ProductSchema)
