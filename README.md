# 🖐️ Fingerprint Attendance System 🥶

A frosty IoT project using **ESP8266**, **AS608 fingerprint sensor**, **LCD**, and **Buzzer** to track attendance in real-time.  
Attendance data is stored in **Firebase Realtime Database**, making monitoring automated and easy. 🌐✨

---

## 🔹 Features

- Enroll teachers with fingerprint authentication 🧑‍🏫  
- Real-time attendance logging (time-in and time-out) ⏱️  
- Firebase cloud storage ☁️  
- LCD display shows status messages 📟  
- Buzzer feedback for successful/failed scans 🔔  
- Responsive web dashboard to view attendance 💻📱  
- Easy to extend for multiple users and schools 🏫  

---

## 🔹 Hardware Required

- ESP8266 (NodeMCU or similar) ⚡  
- AS608 Fingerprint Sensor 🖐️  
- LCD 16x2 with I2C interface 📟  
- Buzzer 🔔  
- Jumper wires & breadboard 🔌  
- USB cable for programming 💻  

---

## 🔹 Software Required

- Arduino IDE (2.x recommended) 🖥️  
- Firebase Realtime Database account 🌐  
- Required Arduino Libraries:  
  - `Adafruit Fingerprint Sensor Library`  
  - `ESP8266WiFi`  
  - `Firebase ESP8266`  
  - `LiquidCrystal_I2C`  

---

## 🔹 Wiring

| Component            | Pin on ESP8266         |
|----------------------|----------------------|
| AS608 VCC            | 3.3V                 |
| AS608 GND            | GND                  |
| AS608 TX             | D6 (GPIO4)           |
| AS608 RX             | D7 (GPIO5)           |
| LCD SDA              | D2 (GPIO4)           |
| LCD SCL              | D1 (GPIO5)           |
| Buzzer (+)           | D5 (GPIO14)          |
| Buzzer (-)           | GND                  |

> ⚠️ Make sure SDA/SCL pins don’t conflict with other I2C devices. Adjust pins if needed.  

---

## 🔹 Installation & Setup

1. Clone this repository:  
   ```bash https://github.com/Elisee-M/Fingerprint-based-attendance ```
  
## 🔹 Installation & Setup

1. Open the project in **Arduino IDE**.  
2. Install required libraries via **Library Manager**.  
3. Configure **WiFi** and **Firebase** credentials in the `config.h` or main code file:

```cpp```
#define WIFI_SSID "your_wifi_name"
#define WIFI_PASSWORD "your_wifi_password"
#define FIREBASE_HOST "your-project.firebaseio.com"
#define FIREBASE_AUTH "your_firebase_secret"

4. Upload the code to your **ESP8266**. ⚡  

5. Open the **Serial Monitor** to enroll fingerprints and monitor attendance. 🖥️  

---

## 🔹 How it Works 🧊

1. Teacher places finger on **AS608 sensor** 🖐️  
2. Sensor scans fingerprint and sends data to **ESP8266** ⚡  
3. ESP8266 checks fingerprint database and logs **time-in/out** in Firebase ⏱️  
4. LCD shows scan status and teacher info 📟  
5. Buzzer gives audio feedback:  
   - ✅ **Success beep**  
   - ❌ **Failure beep**  
6. Admins can view attendance in real-time on the **web dashboard** 🌐  

---

## 🔹 Contribution 💡❄️

Fork, modify, and contribute! Keep it icy and awesome 🥶✨


