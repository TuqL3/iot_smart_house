import { DataSensors } from '~/models/dataSensors.model'
import { pool } from '~/db/connectDB'
import { IParams } from '~/common'

export const saveDataSensor = async (dataSensor: DataSensors) => {
  await pool.query('INSERT INTO data_sensor (temperature, humidity, light, power, motion) VALUES(?,?,?)', [
    dataSensor.temperature,
    dataSensor.humidity,
    dataSensor.light,
    dataSensor.totalPower,
    dataSensor.motion
  ])
}

// pagination/ sort/ search/ filter?
export const getDataSensors = async ({ page, limit, orderBy, sortBy, s, searchBy }: IParams) => {
  try {
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM view_data_sensor'
    let queryPage = 'SELECT count(*) FROM view_data_sensor'

    if (s) {
      if (searchBy) {
        query += ` WHERE ${searchBy} LIKE '%${s}%'`
        queryPage += ` WHERE ${searchBy} LIKE '%${s}%'`
      } else {
        query += ` WHERE searchCol LIKE '%${s}%'`
        queryPage += ` WHERE searchCol LIKE '%${s}%'`
      }
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy} ${sortBy}`
      queryPage += ` ORDER BY ${orderBy} ${sortBy}`
    }

    if (limit && page) {
      query += ` LIMIT ${+limit} OFFSET ${+offset}`
    }

    console.log(query)

    const [data] = await pool.execute(query)

    const [totalPageData] = await pool.execute(queryPage)
    console.log(totalPageData)

    const totalPage = +limit === 0 ? 1 : Math.ceil(+(totalPageData as unknown as any)[0]?.['count(*)'] / limit)

    return {
      data,
      totalPage,
      total: +(totalPageData as unknown as any)[0]?.['count(*)'],
      page: +limit === 0 ? 1 : page,
      limit,
      orderBy,
      sortBy,
      s,
      searchBy
    }
  } catch (error) {
    console.log(error)
  }
}

export const getDataSensorsById = async (dataSensorsId: number) => {
  try {
    const [dataSensor] = await pool.execute('SELECT * FROM data_sensor WHERE id = ?', [dataSensorsId])

    return dataSensor
  } catch (error) {
    console.log(error)
  }
}

export const updateDataSensors = async (dataSensors: DataSensors) => {
  try {
    await pool.query(
      'UPDATE data_sensor SET temperature = ?, humidity = ?, light = ?, power = ?, motion = ? WHERE id = ?',
      [
        dataSensors.temperature,
        dataSensors.humidity,
        dataSensors.light,
        dataSensors.totalPower,
        dataSensors.motion,
        dataSensors.id
      ]
    )
  } catch (error) {
    console.log(error)
  }
}

export const deleteDataSensor = async (dataSensorsId: number) => {
  try {
    await pool.query('DELETE FROM data_sensor WHERE id = ?', [dataSensorsId])
  } catch (error) {
    console.log(error)
  }
}

export const deleteAllDataSensors = async () => {
  try {
    await pool.query('DELETE FROM data_sensor')
  } catch (error) {
    console.log(error)
  }
}
