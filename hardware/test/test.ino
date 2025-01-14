#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// Pin definitions
#define DHTPIN D5           // DHT11 sensor pin
#define DHTTYPE DHT11       // DHT sensor type
#define PIR_PIN D4          // PIR motion sensor pin
#define POWER_SENSOR_PIN A0 // Power sensor analog pin (ACS712)
#define LED1_PIN D6         // Original LED
#define LED2_PIN D7         // Original fan control
#define LED3_PIN D8         // New motion-activated LED

// Network and MQTT configuration
const char* ssid = "Hieu Pham";    
const char* password = "hieupham";    
const char* mqtt_server = "172.20.10.2";
const char* topic = "dataSensor";
const char* user = "tung";
const char* passwd = "a";

// Constants for power calculation
const float VCC = 5.0;              // Supply voltage
const float VOLTAGE_MAINS = 220.0;  // Mains voltage (VAC)
const float ACS_SENSITIVITY = 0.066; // For ACS712 30A version: 66mV/A
const float ACS_OFFSET = VCC / 2;   // Offset voltage at 0A

// Global variables
DHT_Unified dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
unsigned long lastMotionTime = 0;
String msgStr = "";
float temp, hum, totalPower;
bool motionDetected = false;
bool awayMode = false;
const unsigned long MOTION_TIMEOUT = 5000; // 5 seconds timeout for motion-activated LED

// Variables for power measurement
const int SAMPLES = 1000;  // Number of samples for power measurement
unsigned long lastPowerCalculation = 0;
const unsigned long POWER_CALC_INTERVAL = 1000; // Calculate power every second

void turnOffAllDevices() {
  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, LOW);
  digitalWrite(LED3_PIN, LOW);
  
  const char* ledMsg = "{\"status\":\"false\",\"message\":\"Light turns off due to away mode!\"}";
  const char* fanMsg = "{\"status\":\"false\",\"message\":\"Fan turns off due to away mode!\"}";
  client.publish("device/led/message", ledMsg);
  client.publish("device/fan/message", fanMsg);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    digitalWrite(2,0);
    delay(200);
    digitalWrite(2,1);
    delay(200);
  }

  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

float calculateTotalPower() {
  float sumSquares = 0;
  float maxCurrent = 0;
  float minCurrent = 999;
  
  // Sample the sensor multiple times to get RMS current
  for(int i = 0; i < SAMPLES; i++) {
    float rawValue = analogRead(POWER_SENSOR_PIN);
    float voltage = (rawValue * VCC) / 1024.0;
    float current = (voltage - ACS_OFFSET) / ACS_SENSITIVITY;
    
    // Track max and min for peak-to-peak calculation
    if(current > maxCurrent) maxCurrent = current;
    if(current < minCurrent) minCurrent = current;
    
    sumSquares += current * current;
    delayMicroseconds(200); // Small delay between samples
  }
  
  // Calculate RMS current
  float rmsValue = sqrt(sumSquares / SAMPLES);
  
  // Alternative peak-to-peak method
  float peakToPeak = maxCurrent - minCurrent;
  float rmsFromPeak = peakToPeak / 2.0 / sqrt(2);
  
  // Use the larger of the two calculations
  float finalRMS = max(rmsValue, rmsFromPeak);
  
  // Calculate power (P = V * I for resistive loads)
  // For more accuracy, you might want to consider power factor
  float power = VOLTAGE_MAINS * finalRMS * 0.95; // 0.95 is an estimated power factor
  
  return power;
}

void handleMotionSensor() {
  if (digitalRead(PIR_PIN) == HIGH) {
    if (!motionDetected) {
      motionDetected = true;
      digitalWrite(LED3_PIN, HIGH);
      lastMotionTime = millis();
      // Publish motion detection event
      const char* motionMsg = "{\"motion\":true,\"message\":\"Motion detected!\"}";
      client.publish("device/motion", motionMsg);
    }
  }
  
  // Turn off LED after timeout
  if (motionDetected && (millis() - lastMotionTime >= MOTION_TIMEOUT)) {
    motionDetected = false;
    digitalWrite(LED3_PIN, LOW);
    // Publish motion end event
    const char* motionEndMsg = "{\"motion\":false,\"message\":\"Motion ended\"}";
    client.publish("device/motion", motionEndMsg);
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if (strcmp(topic, "device/away") == 0) {
    if ((char)payload[0] == '1') {
      awayMode = true;
      turnOffAllDevices();
      const char* awayMsg = "{\"status\":\"true\",\"message\":\"Away mode activated!\"}";
      client.publish("device/away/message", awayMsg);
    } else if ((char)payload[0] == '0') {
      awayMode = false;
      const char* awayMsg = "{\"status\":\"false\",\"message\":\"Away mode deactivated!\"}";
      client.publish("device/away/message", awayMsg);
    }
    return;
  }

  if (awayMode) {
    const char* errorMsg = "{\"error\":\"Cannot control devices in away mode\"}";
    client.publish("device/error", errorMsg);
    return;
  }


  // LED 1 control
 if ((char)payload[0] == '0' && strcmp(topic, "device/led") == 0) {
    digitalWrite(LED1_PIN, LOW);
    const char* alterMsg = "{\"status\":\"false\",\"message\":\"Light turns off!!!\"}";
    client.publish("device/led/message", alterMsg);
  } else if ((char)payload[0] == '1' && strcmp(topic, "device/led") == 0) {
    digitalWrite(LED1_PIN, HIGH);
    const char* alterMsg = "{\"status\":\"true\",\"message\":\"Light turns on!!!\"}";
    client.publish("device/led/message", alterMsg);
  }
  // Fan control
  else if ((char)payload[0] == '0' && strcmp(topic, "device/fan") == 0) {
    digitalWrite(LED2_PIN, LOW);
    const char* alterMsg = "{\"status\":\"false\",\"message\":\"Fan turns off!!!\"}";
    client.publish("device/fan/message", alterMsg);
  }
  else if ((char)payload[0] == '1' && strcmp(topic, "device/fan") == 0) {
    digitalWrite(LED2_PIN, HIGH);
    const char* alterMsg = "{\"status\":\"true\",\"message\":\"Fan turns on!!!\"}";
    client.publish("device/fan/message", alterMsg);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str(), user, passwd)) {
      Serial.println("connected");
      client.subscribe("device/led");
      client.subscribe("device/fan");
      client.subscribe("device/away");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  
  dht.begin();
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  dht.humidity().getSensor(&sensor);
  
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1889);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Handle motion sensor
  handleMotionSensor();

  // Update power measurement periodically
  if (millis() - lastPowerCalculation >= POWER_CALC_INTERVAL) {
    totalPower = calculateTotalPower();
    lastPowerCalculation = millis();
  }

  unsigned long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;

    // Read DHT sensor
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (!isnan(event.temperature)) {
      temp = event.temperature;
    }
    
    dht.humidity().getEvent(&event);
    if (!isnan(event.relative_humidity)) {
      hum = event.relative_humidity;
    }

    // Read light sensor
    int lightLevel = analogRead(A0);
    
    // Prepare and publish message
    msgStr = "{\"light\":" + String(lightLevel) + 
             ",\"temperature\":" + String(temp) + 
             ",\"humidity\":" + String(hum) + 
             ",\"totalPower\":" + String(totalPower, 2) + // Power in Watts, 2 decimal places
             ",\"motion\":" + String(motionDetected) + "}";

    byte arrSize = msgStr.length() + 1;
    char msg[arrSize];
    Serial.print("PUBLISH DATA:");
    Serial.println(msgStr);
    msgStr.toCharArray(msg, arrSize);
    client.publish(topic, msg);
    msgStr = "";
    delay(3000);
  }
}