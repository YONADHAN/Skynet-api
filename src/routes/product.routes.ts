import { Router } from 'express'
import { ProductController } from '@/controllers/product.controller.js'
import { authMiddleware } from '@/middlewares/auth.middleware.js'
// import { adminMiddleware } from '@/middlewares/admin.middleware.js' // optional

const router = Router()
const controller = new ProductController()

/**
 * -----------------------------------------
 * ADMIN ROUTES
 * -----------------------------------------
 */

// Add product
router.post(
    '/',
    authMiddleware,
    /* adminMiddleware, */
    controller.createProduct
)

// Get products (paginated) – Admin listing
router.get(
    '/',
    authMiddleware,
    /* adminMiddleware, */
    controller.getProducts
)

// Edit product
router.put(
    '/:id',
    authMiddleware,
    /* adminMiddleware, */
    controller.updateProduct
)

// Soft delete product
router.delete(
    '/:id',
    authMiddleware,
    /* adminMiddleware, */
    controller.deleteProduct
)

// Get soft-deleted products (paginated)
router.get(
    '/deleted/list',
    authMiddleware,
    /* adminMiddleware, */
    controller.getDeletedProducts
)

// Restore soft-deleted product
router.patch(
    '/restore/:id',
    authMiddleware,
    /* adminMiddleware, */
    controller.restoreProduct
)

/**
 * -----------------------------------------
 * PUBLIC ROUTES
 * -----------------------------------------
 */

// Infinite scroll products
router.get(
    '/infinite',
    controller.getProductsInfinite
)

// Get product by slug
router.get(
    '/slug/:slug',
    controller.getProductBySlug
)

export default router
