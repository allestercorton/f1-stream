# F1Stream

![F1Stream Preview](./frontend/public/preview.png)

F1Stream is an open-source web application that allows users to watch **live Formula 1 races** for free, interact in a **real-time global chat**, and stay updated with the **next race session countdown**. The project is designed with a **minimal dark mode UI**, inspired by Apple's UI/UX principles.

## 🚀 Features

- **Live F1 Streams** – Instantly watch Formula 1 races without any sign-up.
- **Real-Time Global Chat** – Engage with other F1 fans worldwide using Socket.io.
- **Next Race Countdown** – Stay informed about upcoming sessions with a live timer.
- **User Authentication** – Sign up, log in, and reset passwords securely.
- **Guest Access** – Visitors can view the livestream and chat without signing up, but authentication is required to participate in the chat.

## 🛠 Tech Stack

- **Frontend:** React (TypeScript)
- **Backend:** Node.js, Express, MongoDB (MERN stack + TypeScript)
- **Real-Time Communication:** Socket.io
- **State Management:** Zustand & TanStack Query
- **Authentication:** JWT-based authentication with password reset
- **Deployment:** Vercel (Frontend), Render (Backend)

## 🎨 UI/UX Design

- **Minimal dark mode interface**, inspired by Apple's design principles.
- **Intuitive and accessible layout** for a smooth user experience.

---

### 🌎 Live Demo

[🔗 Visit F1Stream](https://f1stream.vercel.app/)

### 🛠 Installation & Setup

```sh
# Clone the repository
git clone https://github.com/allestercorton/f1-stream.git
cd f1stream

# Install dependencies for the backend
npm install

# Start the backend development server
npm run dev

# Change directory to ./frontend and install dependencies for the frontend
cd frontend && npm install

# Start the frontend development server
npm run dev
```

## 📜 License

This project is **open-source** under the **MIT License**.

## 👨‍💻 Creator

Developed by **Allester Corton**. Contributions and feedback are welcome!

### 🤝 Contributing

Feel free to submit issues or pull requests to improve the project!

---

Enjoy the races! 🏎️🔥
