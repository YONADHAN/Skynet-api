import { BaseRepository, FindAllOptions, PaginationResult } from './base.repository.js'
import { ProductModel, IProduct } from '../models/product/product.model.js'

export class ProductRepository extends BaseRepository<IProduct> {
    constructor() {
        super(ProductModel)
    }

    /**
     * -----------------------------------------
     * CREATE PRODUCT
     * -----------------------------------------
     * Uses BaseRepository.create()
     */

    /**
     * -----------------------------------------
     * GET PRODUCT BY SLUG
     * -----------------------------------------
     */
    async findBySlug(slug: string): Promise<IProduct | null> {
        return await ProductModel.findOne({
            slug,
            isDeleted: false,
        })
    }

    /**
     * -----------------------------------------
     * GET PRODUCTS (PAGINATED)
     * -----------------------------------------
     * Reuses BaseRepository.findAll()
     */
    async getProducts(
        options: FindAllOptions<IProduct>
    ): Promise<PaginationResult<IProduct>> {
        return await this.findAll(options)
    }

    /**
     * -----------------------------------------
     * UPDATE PRODUCT
     * -----------------------------------------
     * Reuses BaseRepository.updateById()
     */
    async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        return await this.updateById(id, data)
    }

    /**
     * -----------------------------------------
     * SOFT DELETE PRODUCT
     * -----------------------------------------
     * Reuses BaseRepository.softDelete()
     */
    async deleteProduct(id: string): Promise<IProduct | null> {
        return await this.softDelete(id)
    }

    /**
     * -----------------------------------------
     * RESTORE DELETED PRODUCT
     * -----------------------------------------
     * Reuses BaseRepository.restore()
     */
    async restoreProduct(id: string): Promise<IProduct | null> {
        return await this.restore(id)
    }

    /**
     * -----------------------------------------
     * GET DELETED PRODUCTS (PAGINATED)
     * -----------------------------------------
     */
    async getDeletedProducts(
        page = 1,
        limit = 10,
        filter: any = {}
    ): Promise<PaginationResult<IProduct>> {
        const skip = (page - 1) * limit

        const finalFilter = { isDeleted: true, ...filter }

        const [data, totalCount] = await Promise.all([
            ProductModel.find(finalFilter)
                .sort({ updatedAt: -1, _id: 1 })
                .skip(skip)
                .limit(limit),
            ProductModel.countDocuments(finalFilter),
        ])

        return {
            data,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount,
        }
    }

    /**
     * -----------------------------------------
     * INFINITE SCROLL PRODUCTS
     * -----------------------------------------
     * Cursor-based pagination (better than page-based)
     */
    async getProductsInfiniteScroll({
        limit = 10,
        lastCreatedAt,
    }: {
        limit?: number
        lastCreatedAt?: Date
    }) {
        const filter: any = {
            isDeleted: false,
        }

        if (lastCreatedAt) {
            filter.createdAt = { $lt: lastCreatedAt }
        }

        const data = await ProductModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)

        const nextCursor =
            data.length > 0 ? data[data.length - 1].createdAt : null

        return {
            data,
            nextCursor,
            hasMore: data.length === limit,
        }
    }
}
