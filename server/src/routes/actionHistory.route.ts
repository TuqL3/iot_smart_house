import { Router } from 'express'
import { getActionHistorys, saveActionHistory } from '~/controllers/actionHistory.controller'

export const router = Router()

/**
 *  @swagger
 *  components:
 *    schemas:
 *      ActionHistoryBody:
 *        type: object
 *        properties:
 *          device:
 *            type: string
 *            description: Dữ liệu nhiệt độ
 *          act:
 *            type: string
 *            description: Dữ liệu độ ẩm
 *        example:
 *            device: Light
 *            act: 'On'
 *      ActionHistory:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: Tự động tạo bên server
 *          device:
 *            type: string
 *            description: Dữ liệu nhiệt độ
 *          act:
 *            type: string
 *            description: Dữ liệu độ ẩm
 *          createdAt:
 *            type: string
 *            format: date
 *            description: Ngày khởi tạo
 *        example:
 *            id: 1
 *            device: Light
 *            act: 'On'
 *            createAt: '2024-02-16T03:37:21.000Z'
 *      ListActionHistory:
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
 *                   $ref: '#/components/schemas/ActionHistory'
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
 *                device: Light
 *                act: 'On'
 *                createAt: '2024-02-16T03:37:21.000Z'
 *              - id: 2
 *                device: Light
 *                act: 'Off'
 *                createAt: '2024-02-16T03:37:22.000Z'
 *              - id: 3
 *                device: Fan
 *                act: 'Off'
 *                createAt: '2024-02-16T03:37:23.000Z'
 *              - id: 4
 *                device: Light
 *                act: 'On'
 *                createAt: '2024-02-16T03:37:24.000Z'
 *              - id: 5
 *                device: Fan
 *                act: 'Off'
 *                createAt: '2024-02-16T03:37:25.000Z'
 *              - id: 6
 *                device: Fan
 *                act: 'On'
 *                createAt: '2024-02-16T03:37:26.000Z'
 *              - id: 7
 *                device: Light
 *                act: 'Off'
 *                createAt: '2024-02-16T03:37:27.000Z'
 *              - id: 8
 *                device: Fan
 *                act: 'On'
 *                createAt: '2024-02-16T03:37:28.000Z'
 *              - id: 9
 *                device: Light
 *                act: 'On'
 *                createAt: '2024-02-16T03:37:29.000Z'
 *              - id: 10
 *                device: Light
 *                act: 'On'
 *                createAt: '2024-02-16T03:37:30.000Z'
 *            totalPage: 8
 *            total: 78
 *            page: 1
 *            limit: 10
 *            orderBy: id
 *            sortBy: ASC
 *            s: ''
 *
 */

/**
 *  @swagger
 * tags:
 *   name: ActionHistory
 *   description: API dữ liệu bật tắt thiết bị
 * /api/actionhistory:
 *   get:
 *     summary: Lấy tất cả danh sách dữ liệu
 *     tags: [ActionHistory]
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
 *           enum: [id, device, act, createAt]
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
 *           enum: [id, device, act, createAt]
 *         description: Search theo trường
 *     responses:
 *       200:
 *         description: Danh sách dữ liệu.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListActionHistory'
 */

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, orderBy = 'id', order = 'ASC', s = '', searchBy = '' } = req.query

    console.log(page, limit, orderBy, order, s, searchBy)

    const data = await getActionHistorys({
      page: +page,
      limit: +limit,
      orderBy: orderBy.toString(),
      sortBy: order.toString(),
      s: s?.toString(),
      searchBy: searchBy?.toString()
    })
    // console.log('data index: ', data);

    return res.json({ success: true, data: data })
  } catch (error) {
    console.log(error)
  }
})

/**
 *  @swagger
 *  /api/actionhistory:
 *    post:
 *      summary: Lưu một bản ghi vào CSDL
 *      tags: [ActionHistory]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ActionHistoryBody'
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

    await saveActionHistory(data)

    return res.json({ success: true })
  } catch (error) {
    console.log(error)
  }
})
