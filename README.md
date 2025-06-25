# 🎥 Let's Flow Connect - Video Meeting App

[![GitHub stars](https://img.shields.io/github/stars/Benighter/Lets-Flow?style=social)](https://github.com/Benighter/Lets-Flow/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Benighter/Lets-Flow?style=social)](https://github.com/Benighter/Lets-Flow/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Benighter/Lets-Flow)](https://github.com/Benighter/Lets-Flow/issues)
[![GitHub license](https://img.shields.io/github/license/Benighter/Lets-Flow)](https://github.com/Benighter/Lets-Flow/blob/main/LICENSE)

A modern, feature-rich video conferencing application built with React.js and Node.js. **Let's Flow Connect** is a complete Google Meet/Zoom clone that enables seamless video communication with real-time chat, screen sharing, and peer-to-peer connectivity.

![Lets Flow Demo](https://i.imgur.com/HhZD01o.jpg)

## 🌟 Live Demo

Experience **Let's Flow Connect** in action: [Coming Soon - Deploy Link]

## ✨ Features

### 🎯 Core Features
- **🆓 100% Free & Open Source** - No hidden costs or premium tiers
- **🚫 No Account Required** - Jump into meetings instantly
- **👥 Unlimited Participants** - Host meetings with any number of users
- **💬 Real-time Chat** - Integrated messaging system during video calls
- **📺 HD Video Streaming** - Crystal clear video quality
- **🔊 High-Quality Audio** - Clear audio communication
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### 🚀 Advanced Features
- **🖥️ Screen Sharing** - Share your screen, applications, or browser tabs
- **🔗 Peer-to-Peer Connection** - Direct WebRTC connections for optimal performance
- **🔒 Secure Communication** - End-to-end encrypted connections
- **⚡ Real-time Synchronization** - Instant updates using Socket.IO
- **🎨 Modern UI/UX** - Clean, intuitive interface built with Material-UI
- **📊 Connection Status** - Real-time connection quality indicators
- **🔇 Mute/Unmute Controls** - Easy audio and video controls
- **📋 Meeting Room Management** - Create and join rooms with unique IDs

## 🛠️ Technology Stack

### Frontend
- **React.js** (v16.13.1) - Modern JavaScript library for building user interfaces
- **Material-UI** (v4.9.7) - React components implementing Google's Material Design
- **React Router** (v5.1.2) - Declarative routing for React applications
- **Bootstrap** (v4.4.1) - CSS framework for responsive design
- **Socket.IO Client** (v2.3.0) - Real-time bidirectional event-based communication

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** (v4.17.1) - Fast, unopinionated web framework for Node.js
- **Socket.IO** (v2.3.0) - Real-time communication library
- **CORS** (v2.8.5) - Cross-Origin Resource Sharing middleware
- **XSS Protection** (v1.0.8) - Cross-site scripting protection

### WebRTC & Communication
- **WebRTC** - Peer-to-peer real-time communication
- **Socket.IO** - Signaling server for WebRTC connections
- **Media Stream API** - Access to camera and microphone

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **npm** or **yarn** package manager
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Benighter/Lets-Flow.git
   cd Lets-Flow
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev
   ```

4. **Open your browser**
   - Frontend: `http://localhost:8000`
   - Backend: `http://localhost:4001`

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run server
   ```

## 📁 Project Structure

```
Lets-Flow-Connect/
├── public/                 # Static files
├── src/                   # React frontend source code
│   ├── App.js            # Main application component
│   ├── Home.js           # Home page component
│   ├── Video.js          # Video call component
│   ├── Home.css          # Home page styles
│   ├── Video.css         # Video call styles
│   └── index.js          # Application entry point
├── app.js                # Express server and Socket.IO setup
├── package.json          # Project dependencies and scripts
└── README.md            # Project documentation
```

## 🎮 How to Use

### Starting a Meeting
1. Open the application in your web browser
2. Enter a room name or use the generated room ID
3. Click "Create Room" or "Join Room"
4. Allow camera and microphone permissions
5. Share the room link with participants

### During a Meeting
- **Mute/Unmute**: Click the microphone icon
- **Camera On/Off**: Click the camera icon
- **Screen Share**: Click the screen share button
- **Chat**: Use the chat panel for text messages
- **Leave**: Click the leave button to exit the meeting

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=4001
CLIENT_PORT=8000
```

### Server Configuration
The server runs on port 4001 by default. You can change this in `app.js`:

```javascript
app.set('port', (process.env.PORT || 4001))
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 **Report Bugs** - Found a bug? [Open an issue](https://github.com/Benighter/Lets-Flow/issues)
- 💡 **Feature Requests** - Have an idea? [Suggest a feature](https://github.com/Benighter/Lets-Flow/issues)
- 🔧 **Code Contributions** - Submit pull requests
- 📖 **Documentation** - Help improve our docs
- ⭐ **Star the Project** - Show your support!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the React development server |
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run server` | Start the backend server in production mode |
| `npm run build` | Build the app for production |
| `npm test` | Run the test suite |

## 🌐 Browser Support

**Lets Flow** supports all modern browsers with WebRTC capabilities:

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+

## 🔒 Security Features

- **XSS Protection** - Input sanitization to prevent cross-site scripting
- **CORS Configuration** - Proper cross-origin resource sharing setup
- **WebRTC Encryption** - Peer-to-peer connections are encrypted by default
- **Input Validation** - All user inputs are validated and sanitized

## 🚀 Deployment

### Deploy to Heroku
1. Create a Heroku app
2. Set environment variables
3. Deploy using Git or GitHub integration

### Deploy to Vercel
1. Connect your GitHub repository
2. Configure build settings
3. Deploy with automatic CI/CD

### Deploy to DigitalOcean
1. Create a droplet
2. Install Node.js and dependencies
3. Configure reverse proxy with Nginx

## 📊 Performance

- **Lightweight** - Optimized bundle size
- **Fast Loading** - Efficient code splitting
- **Low Latency** - Direct peer-to-peer connections
- **Scalable** - Handles multiple concurrent rooms

## 🐛 Troubleshooting

### Common Issues

**Camera/Microphone not working**
- Ensure browser permissions are granted
- Check if other applications are using the devices
- Try refreshing the page

**Connection Issues**
- Check your internet connection
- Ensure WebRTC is supported in your browser
- Try using a different browser

**Audio/Video Quality Issues**
- Check your internet bandwidth
- Close other bandwidth-intensive applications
- Try reducing video quality in settings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

**Bennet Nkolele**

I'm a passionate full-stack developer who loves creating innovative web applications and solving complex problems through code. Let's Flow Connect represents my commitment to building modern, user-friendly solutions for real-world communication needs.

### 🔗 Connect with Me

[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://react-personal-portfolio-alpha.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bennet-nkolele)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Benighter)

- 🌐 **Portfolio**: [react-personal-portfolio-alpha.vercel.app](https://react-personal-portfolio-alpha.vercel.app/)
- 💼 **LinkedIn**: [linkedin.com/in/bennet-nkolele](https://www.linkedin.com/in/bennet-nkolele)
- 💻 **GitHub**: [github.com/Benighter](https://github.com/Benighter)

### 💡 What I Do

- **Frontend Development**: React.js, JavaScript, HTML5, CSS3, Material-UI
- **Backend Development**: Node.js, Express.js, Socket.IO, RESTful APIs
- **Real-time Applications**: WebRTC, Socket.IO, Peer-to-peer connections
- **Deployment & DevOps**: Vercel, Heroku, DigitalOcean, CI/CD pipelines

*Feel free to reach out for collaborations, opportunities, or just to connect!*

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Inspired by modern video conferencing solutions
- Built with love for the open-source community

## 📈 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Benighter/Lets-Flow)
![GitHub code size](https://img.shields.io/github/languages/code-size/Benighter/Lets-Flow)
![GitHub last commit](https://img.shields.io/github/last-commit/Benighter/Lets-Flow)

------

⭐ **Star this repository if you found it helpful!**

🔗 **Share with your friends and colleagues!**

💬 **Have questions? [Open an issue](https://github.com/Benighter/Lets-Flow/issues) or reach out!**