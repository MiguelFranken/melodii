// Code largely inspired by https://www.arduino.cc/en/Tutorial/Wifi101WiFiUdpSendReceiveString

// Switch which line is commented to enable or disable debug messages.
#define HBDEBUG(i) i
//#define HBDEBUG(i)

#include <SPI.h>
#include <WiFi101.h>
#include <WiFiUdp.h>
#include <OSCMessage.h>

int status = WL_IDLE_STATUS;

// Overwrite the following if you need to connect to a different message server
// than the standard Raspberry Pi.
#define SECRET_SSID "pi3hotspot"
#define SECRET_PASS "password"
#define SECRET_IP "10.0.0.1"

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int keyIndex = 0; // your network key Index number (needed only for WEP)

unsigned int localPort = 2390; // local port to listen on (also needed if only sending messages)

WiFiUDP Udp;

int ledPin = LED_BUILTIN;

int sensorPin = A1;

int trigPin = 1;
int echoPin = 0;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(sensorPin, INPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    Serial.println("WiFi shield not present");
    // don't continue:
    while (true);
  }

  // attempt to connect to WiFi network:
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID (refresh in 1s): ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 1 second for connection:
    delay(1000);
  }

  Serial.println("Connected to wifi");
  printWiFiStatus();

  // This is needed for sending, too!
  Udp.begin(localPort);
}

void send(OSCMessage msg) {
  if (Udp.beginPacket(SECRET_IP, 57121) == 0) Serial.println("beginPacket failed");
  msg.send(Udp);
  if (Udp.endPacket() == 0) Serial.println("reply send failed");
}

void loop() {
  handleLight();
  handleSonar();
  delay(50);
}

float oldLightValue = 0;
int lightSamples = 5;

void handleLight() {
  float newLightAverage = 0;
  for (int i = 0; i < lightSamples; i++) {
    int newValue = analogRead(sensorPin);
    float normalized = 1 - ((float) newValue / (float) 1023);
    newLightAverage += normalized;
  }
  float newValue = newLightAverage / lightSamples;
  

  float difference = abs(newValue - oldLightValue);
  oldLightValue = newValue;
  if (difference > 0.04) {
    HBDEBUG(Serial.print("! "););
    OSCMessage msg("/effect/master/reverb/wet");
    msg.add(1 - newValue);
    send(msg);
  } else {
    HBDEBUG(Serial.print("  "););
  }
  
  HBDEBUG(
    for (int i = 0; i < newValue * 100; i++) {
      Serial.print("*");
    }
    Serial.println();
  )
}


long maxDuration = 1000;
long oldDuration = maxDuration;
int sonarSamples = 5;

void handleSonar() {
  long duration = 0;
  for (int i = 0; i < sonarSamples; i++) {
    // Send sonar.
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
  
    // Measure distance.
    // pulseIn subtracts some unexplained 500us from the maxDuration, so we compensate.
    long durationSample = pulseIn(echoPin, HIGH, maxDuration + 500);
    // When no pulse is detected, 0 is returned.
    // In that case assume that no one is blocking the ultrasound.
    if (durationSample == 0) {
      durationSample = maxDuration;
    }

    duration += durationSample;
  }
  long newValue = duration / sonarSamples;


  float difference = abs(newValue - oldDuration);
  oldDuration = newValue;
  if (difference > 5) {
    HBDEBUG(Serial.print("! "););
    OSCMessage msg("/effect/master/eq/high");
    float normalized = newValue / (float) maxDuration;
    int volume = normalized * 20 - 20;
    msg.add(volume);
    send(msg);
  } else {
    HBDEBUG(Serial.print("  "););
  }
  
  HBDEBUG(
    for (int i = 0; i < (newValue / 10.0) && i < 100; i++) {
      Serial.print("=");
    }
    Serial.println();
  );
}

void printWiFiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI): ");
  Serial.print(rssi);
  Serial.println(" dBm");
}