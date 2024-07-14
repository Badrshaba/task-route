import { paginationFunction } from "./pagination.js"


export class APIFeature {
    constructor(query, mongooseQuery) {
        this.query = query // we can remove this variable becaue we didn't use it
        this.mongooseQuery = mongooseQuery
    }

    pagination({ page, size }) {
        const { limit, skip } = paginationFunction({ page, size })  //{limit: 2, skip: 0}
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)  // mongoose query
        return this
    }

    sort(sortBy) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') // 'stock  desc' => 'stock: -1'
        const [key, value] = formula.split(':')

        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }
    filters(filters) {
        const queryFilter = JSON.parse(
            JSON.stringify(filters).replace(
                /gt|gte|lt|lte|in|nin|eq|ne|regex/g,
                (operator) => `$${operator}`,
            ),
        )
        this.mongooseQuery.find(queryFilter)
        return this
    }
}