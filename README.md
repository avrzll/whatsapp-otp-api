# WhatsApp OTP Service

A WhatsApp-based OTP service with copy button feature and informative messages for secure verification.

## 📑 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
  - [Generate OTP](#1-generate-otp)
  - [Verify OTP](#2-verify-otp)
- [Rate Limiting](#-rate-limiting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Features

- ✨ WhatsApp-based OTP delivery
- 📋 One-click OTP copy button
- ⏱️ 5-minute OTP validity
- 🔒 Secure OTP verification
- 📱 Professional message formatting
- 🛡️ Rate limiting protection

## 📋 Prerequisites

Before running this project, ensure you have installed:

- Node.js (version 18 or higher)
- npm or yarn
- Registered WhatsApp number (for bot)

## 🛠️ Installation

1. Clone this repository:

```bash
git clone https://github.com/avrzll/whatsapp-otp-api.git
cd whatsapp-otp-api
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure port and rate limit in `./src/config/config.js`

## ⚙️ Configuration

1. Ensure your WhatsApp number is registered for bot usage
2. When running the application for the first time, you'll be prompted to enter your WhatsApp number with country code (e.g., 62 for Indonesia) and pairing code
3. Follow the terminal instructions to complete the pairing process

## 🚀 Running the Application

1. Start the server:

```bash
npm start
# or
yarn start
```

2. The server will run on `http://localhost:3030` (or your configured port)

## 📡 API Documentation

### 1. Generate OTP

```http
POST /otp/generate-otp
Content-Type: application/json

{
    "userId": "user123",
    "phoneNumber": "6281234567890"
}
```

#### Success Response (200 OK)

```json
{
  "status": true,
  "otp_code": "123456",
  "message": "OTP generated and sent successfully"
}
```

#### Error Responses

1. Missing Request Body (400 Bad Request)

```json
{
  "status": false,
  "message": "Request body is required"
}
```

2. Missing Required Fields (400 Bad Request)

```json
{
  "status": false,
  "message": "userId and phoneNumber are required"
}
```

3. WhatsApp Connection Error (500 Internal Server Error)

```json
{
  "status": false,
  "message": "WhatsApp connection not established"
}
```

4. Message Sending Error (500 Internal Server Error)

```json
{
  "status": false,
  "message": "Failed to send OTP via WhatsApp",
  "error": "Error message details"
}
```

### 2. Verify OTP

```http
POST /otp/verify-otp
Content-Type: application/json

{
    "userId": "user123",
    "otp": "123456"
}
```

#### Success Response (200 OK)

```json
{
  "status": true,
  "message": "OTP verified successfully"
}
```

#### Error Responses

1. Missing Request Body (400 Bad Request)

```json
{
  "status": false,
  "message": "Request body is required"
}
```

2. Missing Required Fields (400 Bad Request)

```json
{
  "status": false,
  "message": "userId and otp are required"
}
```

3. OTP Not Found (400 Bad Request)

```json
{
  "status": false,
  "message": "OTP not found or expired"
}
```

4. OTP Expired (400 Bad Request)

```json
{
  "status": false,
  "message": "OTP expired"
}
```

5. Invalid OTP (400 Bad Request)

```json
{
  "status": false,
  "message": "Invalid OTP"
}
```

## 🔒 Rate Limiting

The application implements rate limiting to prevent abuse:

- Window: 15 minutes
- Maximum requests: 10 requests per window

When rate limit is exceeded, the API will return:

```json
{
  "status": false,
  "message": "Too many requests :("
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for discussion.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 👥 Contact

- Author: @avrzll\_
- Email: avrizalrendiprayoga@gmail.com

---

Made with ❤️ by @avrzll\_
