import path from 'path'
import express, { Router } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import openapiDoc from '../schemas/openapi.json'

export const router = Router()

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Tài liệu API',
      version: '0.1.0',
      description: 'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'http://localhost:4000'
      },
      contact: {
        name: 'Phạm Đắc Hiếu',
        url: 'http://localhost:4000',
        email: 'hieutedam2k2@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
}

const specs = swaggerJsdoc(options)
router.use('/', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))

// (optional) serve the OpenAPI specification
router.use('/openapi.json', express.static(path.join(__dirname, '../schemas/openapi.json')))
