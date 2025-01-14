/**
 * @swagger
 * tags:
 *   name: Socket
 *   description: Socket
 *   /:
 *     publish: # socket.emit(eventName[, ...args][, ack])
 *       message:
 *         name: hello #eventNam
 *         payload: #payload
 *           types: object
 *           properties:
 *             foo:
 *               type: string
 *     subscribe: #socket.on(eventName, (...args)=>{})
 *       message:
 *         name: hello #eventNam
 *         payload: #payload
 *           types: object
 *           properties:
 *             foo:
 *               type: string
 *
 */
