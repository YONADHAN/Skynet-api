import { Model, Document } from 'mongoose'
import type mongoose from 'mongoose'

/**
 * Standard paginated response structure
 */
export interface PaginationResult<T> {
  data: T[]
  totalPages: number
  currentPage: number
  totalCount: number
}

/**
 * Options for findAll()
 */
export interface FindAllOptions<T> {
  page?: number
  limit?: number
  filter?: Record<string, any> // 👈 replaced FilterQuery
  populate?: string | string[] | any
  sort?: Record<string, 1 | -1>
}

/**
 * Generic base repository for all models
 */
export class BaseRepository<T extends Document> {
  protected model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  // ----------------- CREATE -----------------
  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data)
    return await doc.save()
  }

  // ----------------- GET BY ID -----------------
  async findById(
    id: string,
    populate?: string | string[] | any
  ): Promise<T | null> {
    let query = this.model.findOne({
      _id: id,
      isDeleted: false,
    })

    if (populate) {
      query = query.populate(populate)
    }

    return await query.exec()
  }

  // ----------------- GET ALL (PAGINATED) -----------------
  async findAll(options: FindAllOptions<T> = {}): Promise<PaginationResult<T>> {
    const {
      page = 1,
      limit = 10,
      filter = {},
      populate,
      sort = { createdAt: -1, _id: 1 },
    } = options

    const skip = (page - 1) * limit

    // Always exclude soft deleted records
    const finalFilter = {
      isDeleted: false,
      ...filter,
    }

    let query = this.model.find(finalFilter).sort(sort).skip(skip).limit(limit)

    if (populate) {
      query = query.populate(populate)
    }

    const [data, totalCount] = await Promise.all([
      query.exec(),
      this.model.countDocuments(finalFilter),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      data,
      totalPages,
      currentPage: page,
      totalCount,
    }
  }

  // ----------------- UPDATE -----------------
  async updateById(
    id: string,
    update: mongoose.UpdateQuery<T>
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      { _id: id, isDeleted: false },
      update,
      { new: true }
    )
  }

  // ----------------- SOFT DELETE -----------------
  async softDelete(id: string): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    )
  }

  // ----------------- RESTORE -----------------
  async restore(id: string): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    )
  }

  // ----------------- HARD DELETE (OPTIONAL) -----------------
  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id)
  }
}
