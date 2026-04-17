# 🏠 Smart Home Automation System with RBAC-ABAC

## 📖 Abstract
This project presents a **Smart Home Automation System** that allows users to control and monitor smart devices such as door locks through a web-based interface. The system integrates **Role-Based Access Control (RBAC)** and **Attribute-Based Access Control (ABAC)** to ensure secure and authorized access.

It is designed to be scalable and can be extended with **blockchain technology** for decentralized and tamper-proof access control.

---

## 🎯 Objectives
- Develop a secure smart home system  
- Implement RBAC and ABAC models  
- Provide an interactive user dashboard  
- Maintain activity logs for monitoring  
- Enable future IoT integration  

---

## 🚀 Features
- 🔐 Smart Lock Control  
- 👥 Role-Based Access (Admin/User)  
- 📊 Dashboard Monitoring  
- 🕒 Activity Logs  
- ⚙️ Auto Lock Feature  
- 📱 Responsive UI  

---

## 🏗️ Architecture
The system consists of the following layers:

- **Frontend** – React-based UI  
- **Control Layer** – Handles device operations  
- **Access Control Layer** – RBAC + ABAC logic  
- **Future Scope** – Blockchain & IoT integration  

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite)  
- **Styling:** CSS  
- **Runtime:** Node.js  
- **Version Control:** Git & GitHub  

---

## 📂 Project Structure
```bash
website/
│── public/
│── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── ControlPanel.jsx
│   │   ├── AutoLock.jsx
│   │   ├── ActivityLogs.jsx
│   │   └── AccessControl.jsx
│   ├── App.jsx
│   └── main.jsx
│── index.html
│── package.json
│── vite.config.js
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/MANISHKHANDELWAL004/smarthomeautomation.git
```

### 2. Navigate to project folder
```bash
cd website
```

### 3. Install dependencies
```bash
npm install
```

### 4. Run the project
```bash
npm run dev
```

---

## 🔐 Access Control

### RBAC (Role-Based Access Control)
- Admin → Full access  
- User → Limited access  

### ABAC (Attribute-Based Access Control)
Access depends on:
- User role  
- Environment conditions  
- Device type  

---

## 📊 Use Case
- Admin can control all devices and view logs  
- Users can access limited features  
- Unauthorized access is restricted  

---

## 🔮 Future Scope
- Blockchain-based authentication  
- ESP8266/ESP32 integration  
- Mobile application  
- Cloud database (Firebase/MongoDB)  

---



## 👨‍💻 Author
**Manish Khandelwal**
**Natiesh Bhau**
**Nikhil choudhary**

---

## 📜 License
This project is for educational purposes only.
