import { ProductRepository } from '@/repositories/product.repository.js'
import { FindAllOptions, PaginationResult } from '@/repositories/base.repository.js'
import { IProduct } from '@/models/product/product.model.js'

export class ProductService {
    private productRepository: ProductRepository

    constructor() {
        this.productRepository = new ProductRepository()
    }

    /**
     * -----------------------------------------
     * CREATE PRODUCT
     * -----------------------------------------
     */
    async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        // Later: validation, admin checks, image processing, etc.
        return await this.productRepository.create(data)
    }

    /**
     * -----------------------------------------
     * GET PRODUCTS (PAGINATED – ADMIN)
     * -----------------------------------------
     */
    async getProducts(
        options: FindAllOptions<IProduct> & { search?: string }
    ): Promise<PaginationResult<IProduct>> {
        const { search, ...restOptions } = options
        const filter: any = {}

        if (search) {
            const searchRegex = new RegExp(search, 'i')
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
            ]
        }

        return await this.productRepository.getProducts({
            ...restOptions,
            filter,
        })
    }

    /**
     * -----------------------------------------
     * UPDATE PRODUCT
     * -----------------------------------------
     */
    async updateProduct(
        id: string,
        data: Partial<IProduct>
    ): Promise<IProduct | null> {
        const updated = await this.productRepository.updateProduct(id, data)

        if (!updated) {
            throw new Error('Product not found or already deleted')
        }

        return updated
    }

    /**
     * -----------------------------------------
     * SOFT DELETE PRODUCT
     * -----------------------------------------
     */
    async deleteProduct(id: string): Promise<IProduct | null> {
        const deleted = await this.productRepository.deleteProduct(id)

        if (!deleted) {
            throw new Error('Product not found')
        }

        return deleted
    }

    /**
     * -----------------------------------------
     * GET SOFT-DELETED PRODUCTS (PAGINATED)
     * -----------------------------------------
     */
    async getDeletedProducts(
        page: number,
        limit: number,
        search?: string
    ): Promise<PaginationResult<IProduct>> {
        const filter: any = {}

        if (search) {
            const searchRegex = new RegExp(search, 'i')
            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
            ]
        }

        return await this.productRepository.getDeletedProducts(page, limit, filter)
    }

    /**
     * -----------------------------------------
     * RESTORE SOFT-DELETED PRODUCT
     * -----------------------------------------
     */
    async restoreProduct(id: string): Promise<IProduct | null> {
        const restored = await this.productRepository.restoreProduct(id)

        if (!restored) {
            throw new Error('Product not found or already restored')
        }

        return restored
    }

    /**
     * -----------------------------------------
     * INFINITE SCROLL PRODUCTS (PUBLIC)
     * -----------------------------------------
     */
    async getProductsInfinite({
        limit,
        lastCreatedAt,
    }: {
        limit?: number
        lastCreatedAt?: Date
    }) {
        return await this.productRepository.getProductsInfiniteScroll({
            limit,
            lastCreatedAt,
        })
    }

    /**
     * -----------------------------------------
     * GET PRODUCT BY SLUG (PUBLIC)
     * -----------------------------------------
     */
    async getProductBySlug(slug: string): Promise<IProduct | null> {
        const product = await this.productRepository.findBySlug(slug)

        if (!product) {
            throw new Error('Product not found')
        }

        return product
    }
}
