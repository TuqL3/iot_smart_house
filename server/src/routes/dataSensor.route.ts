import { Router } from 'express'
import { getDataSensors, saveDataSensor } from '~/controllers/dataSensor.controller'

export const router = Router()

/**
 *  @swagger
 *  components:
 *    schemas:
 *      DataSensorBody:
 *        types: object
 *        properties:
 *          temperature:
 *            type: string
 *            description: Dữ liệu nhiệt độ
 *          humidity:
 *            type: string
 *            description: Dữ liệu độ ẩm
 *          light:
 *            type: string
 *            description: Dữ liệu ánh sáng
 *        example:
 *            temperature: '7'
 *            humidity: '25'
 *            light: '41'
 *      DataSensor:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: Tự động tạo bên server
 *          temperature:
 *            type: string
 *            description: Dữ liệu nhiệt độ
 *          humidity:
 *            type: string
 *            description: Dữ liệu độ ẩm
 *          light:
 *            type: string
 *            description: Dữ liệu ánh sáng
 *          createdAt:
 *            type: string
 *            format: date
 *            description: Ngày khởi tạo
 *        example:
 *            id: 1
 *            temperature: '7'
 *            humidity: '25'
 *            light: '41'
 *            createAt: '2024-01-25T14:16:33.000Z'
 *      ListDataSensor:
 *        type: object
 *        properties:
 *          success:
 *            type: boolean
 *            description: Thành công trả về true
 *          data:
 *            type: object
 *            description: dữ liệu
 *            properties:
 *              data:
 *                type: array
 *                description: tất cả dữ liệu
 *                items:
 *                   $ref: '#/components/schemas/DataSensor'
 *              totalPage:
 *                type: integer
 *                description: Tổng số lượng page
 *              total:
 *                type: integer
 *                description: Tổng số lượng dữ liệu
 *              page:
 *                type: integer
 *                description: Vị trí page hiện tại
 *              limit:
 *                type: integer
 *                description: Giới hạn dữ liệu
 *              orderBy:
 *                type: string
 *                description: Sắp xếp theo trường
 *              sortBy:
 *                type: string
 *                description: Sắp xếp theo thứ tự
 *              s:
 *                type: string
 *                description: Tìm kiếm theo từ khóa
 *        example:
 *          success: true
 *          data:
 *            data:
 *              - id: 1
 *                temperature: '7'
 *                humidity: '25'
 *                light: '41'
 *                createAt: '2024-01-25T14:16:33.000Z'
 *              - id: 2
 *                temperature: '84'
 *                humidity: '4'
 *                light: '91'
 *                createAt: '2024-01-25T14:16:34.000Z'
 *              - id: 3
 *                temperature: '38'
 *                humidity: '30'
 *                light: '79'
 *                createAt: '2024-01-25T14:16:35.000Z'
 *              - id: 4
 *                temperature: '53'
 *                humidity: '13'
 *                light: '5'
 *                createAt: '2024-01-25T14:16:36.000Z'
 *              - id: 5
 *                temperature: '34'
 *                humidity: '88'
 *                light: '14'
 *                createAt: '2024-01-25T14:16:37.000Z'
 *              - id: 6
 *                temperature: '86'
 *                humidity: '47'
 *                light: '24'
 *                createAt: '2024-01-25T14:16:38.000Z'
 *              - id: 7
 *                temperature: '15'
 *                humidity: '31'
 *                light: '62'
 *                createAt: '2024-01-25T14:16:39.000Z'
 *              - id: 8
 *                temperature: '94'
 *                humidity: '64'
 *                light: '73'
 *                createAt: '2024-01-25T14:16:40.000Z'
 *              - id: 9
 *                temperature: '72'
 *                humidity: '67'
 *                light: '56'
 *                createAt: '2024-01-25T14:16:41.000Z'
 *              - id: 10
 *                temperature: '60'
 *                humidity: '77'
 *                light: '68'
 *                createAt: '2024-01-25T14:16:42.000Z'
 *            totalPage: 433
 *            total: 4330
 *            page: 1
 *            limit: 10
 *            orderBy: id
 *            sortBy: ASC
 *            s: ''
 *
 */

/**
 * @swagger
 * /api/datasensors:
 *   get:
 *     summary: Lấy tất cả danh sách dữ liệu
 *     tags: [DataSensor]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang thứ mấy
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Giới hạn dữ liệu
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [id, temperature, humidity, light, createAt]
 *         description: Sắp xếp theo trường
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp thứ tự
 *       - in: query
 *         name: s
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo ký tự
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [id, temperature, humidity, light, createAt]
 *         description: Search theo trường
 *     responses:
 *       200:
 *         description: Danh sách dữ liệu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListDataSensor'
 */

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, orderBy = 'id', order = 'ASC', s = '', searchBy = '' } = req.query

    console.log(page, limit, orderBy, order, s)

    const data = await getDataSensors({
      page: +page,
      limit: +limit,
      orderBy: orderBy.toString(),
      sortBy: order.toString(),
      s: s?.toString(),
      searchBy: searchBy?.toString()
    })

    return res.json({ success: true, data: data })
  } catch (error) {
    console.log(error)
  }
})

/**
 *  @swagger
 *  /api/datasensors:
 *    post:
 *      summary: Lưu một bản ghi vào CSDL
 *      tags: [DataSensor]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/DataSensorBody'
 *      responses:
 *        201:
 *          description: Tạo thành công.
 *          content:
 *            application/json:
 *              schema:
 *                types: object
 *                properties:
 *                  success: boolean
 *                example:
 *                  success: true
 *
 */
router.post('/', async (req, res) => {
  try {
    const data = req.body

    await saveDataSensor(data)

    return res.json({ success: true })
  } catch (error) {
    console.log(error)
  }
})
