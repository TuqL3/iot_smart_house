CREATE VIEW view_data_sensor
SELECT *, 
CONCAT(
    CONVERT(data_sensor.id, CHAR), 
    data_sensor.temperature, 
    data_sensor.humidity, 
    data_sensor.light, 
    CONVERT(data_sensor.createAt, CHAR)
    ) AS searchCol 
FROM data_sensor

CREATE VIEW view_action_history
SELECT *, 
CONCAT(
    CONVERT(action_history.id, CHAR), 
    action_history.device, 
    action_history.act, 
    CONVERT(action_history.createAt, CHAR)
    ) AS searchCol 
FROM action_history