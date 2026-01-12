import { Request, Response, NextFunction } from 'express'
import { ProductService } from '@/services/feature/product.service.js'
import {
    CreateProductSchema,
    UpdateProductSchema,
    PaginationSchema,
    ProductIdSchema,
    ProductSlugSchema,
    InfiniteScrollSchema,
} from '@/validations/product.validation.js'

const productService = new ProductService()

export class ProductController {
    /**
     * -----------------------------------------
     * CREATE PRODUCT (ADMIN)
     * -----------------------------------------
     */
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const data = CreateProductSchema.parse(req.body)

            const product = await productService.createProduct(data)

            return res.status(201).json({
                success: true,
                data: product,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * GET PRODUCTS (PAGINATED – ADMIN)
     * -----------------------------------------
     */
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, search } = PaginationSchema.parse(req.query)

            const result = await productService.getProducts({
                page,
                limit,
                search,
            })

            return res.status(200).json({
                success: true,
                ...result,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * UPDATE PRODUCT (ADMIN)
     * -----------------------------------------
     */
    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = ProductIdSchema.parse(req.params)
            const data = UpdateProductSchema.parse(req.body)

            const product = await productService.updateProduct(id, data)

            return res.status(200).json({
                success: true,
                data: product,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * SOFT DELETE PRODUCT (ADMIN)
     * -----------------------------------------
     */
    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = ProductIdSchema.parse(req.params)

            await productService.deleteProduct(id)

            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * GET SOFT-DELETED PRODUCTS (ADMIN)
     * -----------------------------------------
     */
    async getDeletedProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, search } = PaginationSchema.parse(req.query)

            const result = await productService.getDeletedProducts(page, limit, search)

            return res.status(200).json({
                success: true,
                ...result,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * RESTORE SOFT-DELETED PRODUCT (ADMIN)
     * -----------------------------------------
     */
    async restoreProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = ProductIdSchema.parse(req.params)

            const product = await productService.restoreProduct(id)

            return res.status(200).json({
                success: true,
                data: product,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * INFINITE SCROLL PRODUCTS (PUBLIC)
     * -----------------------------------------
     */
    async getProductsInfinite(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit, search } = PaginationSchema.parse(req.query)

            const result = await productService.getProducts({
                page,
                limit,
                search,
            })

            return res.status(200).json({
                success: true,
                ...result,
            })
        } catch (error) {
            next(error)
        }
    }

    /**
     * -----------------------------------------
     * GET PRODUCT BY SLUG (PUBLIC)
     * -----------------------------------------
     */
    async getProductBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const { slug } = ProductSlugSchema.parse(req.params)

            const product = await productService.getProductBySlug(slug)

            return res.status(200).json({
                success: true,
                data: product,
            })
        } catch (error) {
            next(error)
        }
    }
}
