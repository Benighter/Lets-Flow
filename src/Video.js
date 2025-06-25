import React, { Component } from 'react'
import io from 'socket.io-client'
import faker from "faker"

import {
	IconButton,
	Badge,
	Input,
	Button,
	Tooltip,
	Slider,
	Typography,
	Card,
	CardContent,
	Fab,
	LinearProgress,
	Chip
} from '@material-ui/core'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare'
import CallEndIcon from '@material-ui/icons/CallEnd'
import ChatIcon from '@material-ui/icons/Chat'
import SettingsIcon from '@material-ui/icons/Settings'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import PeopleIcon from '@material-ui/icons/People'
import LinkIcon from '@material-ui/icons/Link'
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver'

import { message } from 'antd'
import 'antd/dist/antd.css'
import { Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import "./Video.css"

const server_url = process.env.NODE_ENV === 'production' ? 'https://lets-flow-connect-backend.onrender.com' : "http://localhost:4001"

var connections = {}
const peerConnectionConfig = {
	'iceServers': [
		// { 'urls': 'stun:stun.services.mozilla.com' },
		{ 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var socket = null
var socketId = null
var elms = 0

class Video extends Component {
	constructor(props) {
		super(props)

		this.localVideoref = React.createRef()
		this.audioContextRef = React.createRef()
		this.analyserRef = React.createRef()
		this.micTestIntervalRef = React.createRef()

		this.videoAvailable = false
		this.audioAvailable = false

		this.state = {
			video: false,
			audio: false,
			screen: false,
			showModal: false,
			screenAvailable: false,
			messages: [],
			message: "",
			newmessages: 0,
			askForUsername: true,
			username: faker.internet.userName(),
			// New enhanced UI states
			isFullscreen: false,
			showSettings: false,
			micVolume: 50,
			speakerVolume: 80,
			isMicTesting: false,
			micTestLevel: 0,
			participantCount: 1,
			connectionQuality: 'excellent',
			isRecording: false,
			showParticipants: false,
			roomName: '',
			meetingDuration: 0,
			showControls: true,
			controlsTimeout: null
		}
		connections = {}

		this.getPermissions()
		this.startMeetingTimer()
	}

	getPermissions = async () => {
		try{
			await navigator.mediaDevices.getUserMedia({ video: true })
				.then(() => this.videoAvailable = true)
				.catch(() => this.videoAvailable = false)

			await navigator.mediaDevices.getUserMedia({ audio: true })
				.then(() => this.audioAvailable = true)
				.catch(() => this.audioAvailable = false)

			if (navigator.mediaDevices.getDisplayMedia) {
				this.setState({ screenAvailable: true })
			} else {
				this.setState({ screenAvailable: false })
			}

			if (this.videoAvailable || this.audioAvailable) {
				navigator.mediaDevices.getUserMedia({ video: this.videoAvailable, audio: this.audioAvailable })
					.then((stream) => {
						window.localStream = stream
						this.localVideoref.current.srcObject = stream
					})
					.then((stream) => {})
					.catch((e) => console.log(e))
			}
		} catch(e) { console.log(e) }
	}

	getMedia = () => {
		this.setState({
			video: this.videoAvailable,
			audio: this.audioAvailable
		}, () => {
			this.getUserMedia()
			this.connectToSocketServer()
		})
	}

	getUserMedia = () => {
		if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
			navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
				.then(this.getUserMediaSuccess)
				.then((stream) => {})
				.catch((e) => console.log(e))
		} else {
			try {
				let tracks = this.localVideoref.current.srcObject.getTracks()
				tracks.forEach(track => track.stop())
			} catch (e) {}
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch(e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				video: false,
				audio: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch(e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				for (let id in connections) {
					connections[id].addStream(window.localStream)

					connections[id].createOffer().then((description) => {
						connections[id].setLocalDescription(description)
							.then(() => {
								socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
							})
							.catch(e => console.log(e))
					})
				}
			})
		})
	}

	getDislayMedia = () => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
					.then(this.getDislayMediaSuccess)
					.then((stream) => {})
					.catch((e) => console.log(e))
			}
		}
	}

	getDislayMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch(e) { console.log(e) }

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream)

			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
					})
					.catch(e => console.log(e))
			})
		}

		stream.getTracks().forEach(track => track.onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch(e) { console.log(e) }

				let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				this.getUserMedia()
			})
		})
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socketId) {
			if (signal.sdp) {
				connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						connections[fromId].createAnswer().then((description) => {
							connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
							}).catch(e => console.log(e))
						}).catch(e => console.log(e))
					}
				}).catch(e => console.log(e))
			}

			if (signal.ice) {
				connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
			}
		}
	}

	changeCssVideos = (main) => {
		let widthMain = main.offsetWidth
		let minWidth = "30%"
		if ((widthMain * 30 / 100) < 300) {
			minWidth = "300px"
		}
		let minHeight = "40%"

		let height = String(100 / elms) + "%"
		let width = ""
		if(elms === 0 || elms === 1) {
			width = "100%"
			height = "100%"
		} else if (elms === 2) {
			width = "45%"
			height = "100%"
		} else if (elms === 3 || elms === 4) {
			width = "35%"
			height = "50%"
		} else {
			width = String(100 / elms) + "%"
		}

		let videos = main.querySelectorAll("video")
		for (let a = 0; a < videos.length; ++a) {
			videos[a].style.minWidth = minWidth
			videos[a].style.minHeight = minHeight
			videos[a].style.setProperty("width", width)
			videos[a].style.setProperty("height", height)
		}

		return {minWidth, minHeight, width, height}
	}

	connectToSocketServer = () => {
		socket = io.connect(server_url, { secure: true })

		socket.on('signal', this.gotMessageFromServer)

		socket.on('connect', () => {
			socket.emit('join-call', window.location.href)
			socketId = socket.id

			socket.on('chat-message', this.addMessage)

			socket.on('user-left', (id) => {
				let video = document.querySelector(`[data-socket="${id}"]`)
				if (video !== null) {
					elms--
					video.parentNode.removeChild(video)

					let main = document.getElementById('main')
					this.changeCssVideos(main)
				}
			})

			socket.on('user-joined', (id, clients) => {
				clients.forEach((socketListId) => {
					connections[socketListId] = new RTCPeerConnection(peerConnectionConfig)
					// Wait for their ice candidate       
					connections[socketListId].onicecandidate = function (event) {
						if (event.candidate != null) {
							socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
						}
					}

					// Wait for their video stream
					connections[socketListId].onaddstream = (event) => {
						// TODO mute button, full screen button
						var searchVidep = document.querySelector(`[data-socket="${socketListId}"]`)
						if (searchVidep !== null) { // if i don't do this check it make an empyt square
							searchVidep.srcObject = event.stream
						} else {
							elms = clients.length
							let main = document.getElementById('main')
							let cssMesure = this.changeCssVideos(main)

							let video = document.createElement('video')

							let css = {minWidth: cssMesure.minWidth, minHeight: cssMesure.minHeight, maxHeight: "100%", margin: "10px",
								borderStyle: "solid", borderColor: "#bdbdbd", objectFit: "fill"}
							for(let i in css) video.style[i] = css[i]

							video.style.setProperty("width", cssMesure.width)
							video.style.setProperty("height", cssMesure.height)
							video.setAttribute('data-socket', socketListId)
							video.srcObject = event.stream
							video.autoplay = true
							video.playsinline = true

							main.appendChild(video)
						}
					}

					// Add the local video stream
					if (window.localStream !== undefined && window.localStream !== null) {
						connections[socketListId].addStream(window.localStream)
					} else {
						let blackSilence = (...args) => new MediaStream([this.black(...args), this.silence()])
						window.localStream = blackSilence()
						connections[socketListId].addStream(window.localStream)
					}
				})

				if (id === socketId) {
					for (let id2 in connections) {
						if (id2 === socketId) continue
						
						try {
							connections[id2].addStream(window.localStream)
						} catch(e) {}
			
						connections[id2].createOffer().then((description) => {
							connections[id2].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
								})
								.catch(e => console.log(e))
						})
					}
				}
			})
		})
	}

	silence = () => {
		let ctx = new AudioContext()
		let oscillator = ctx.createOscillator()
		let dst = oscillator.connect(ctx.createMediaStreamDestination())
		oscillator.start()
		ctx.resume()
		return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
	}
	black = ({ width = 640, height = 480 } = {}) => {
		let canvas = Object.assign(document.createElement("canvas"), { width, height })
		canvas.getContext('2d').fillRect(0, 0, width, height)
		let stream = canvas.captureStream()
		return Object.assign(stream.getVideoTracks()[0], { enabled: false })
	}

	handleVideo = () => this.setState({ video: !this.state.video }, () => this.getUserMedia())
	handleAudio = () => this.setState({ audio: !this.state.audio }, () => this.getUserMedia())
	handleScreen = () => this.setState({ screen: !this.state.screen }, () => this.getDislayMedia())

	handleEndCall = () => {
		try {
			let tracks = this.localVideoref.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) {}
		this.stopMeetingTimer()
		window.location.href = "/"
	}

	// New enhanced methods
	startMeetingTimer = () => {
		this.meetingTimer = setInterval(() => {
			this.setState({ meetingDuration: this.state.meetingDuration + 1 })
		}, 1000)
	}

	stopMeetingTimer = () => {
		if (this.meetingTimer) {
			clearInterval(this.meetingTimer)
		}
	}

	formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = seconds % 60
		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`
	}

	toggleFullscreen = () => {
		if (!this.state.isFullscreen) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen()
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen()
			}
		}
		this.setState({ isFullscreen: !this.state.isFullscreen })
	}

	toggleSettings = () => {
		this.setState({ showSettings: !this.state.showSettings })
	}

	handleMicVolumeChange = (event, newValue) => {
		this.setState({ micVolume: newValue })
		// Apply microphone gain
		if (window.localStream) {
			const audioTracks = window.localStream.getAudioTracks()
			if (audioTracks.length > 0) {
				// Note: This is a simplified implementation
				// In a real app, you'd use Web Audio API for proper gain control
			}
		}
	}

	handleSpeakerVolumeChange = (event, newValue) => {
		this.setState({ speakerVolume: newValue })
		// Apply speaker volume to all remote videos
		const videos = document.querySelectorAll('video:not(#my-video)')
		videos.forEach(video => {
			video.volume = newValue / 100
		})
	}

	startMicTest = () => {
		if (this.state.isMicTesting) {
			this.stopMicTest()
			return
		}

		this.setState({ isMicTesting: true })

		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				const audioContext = new (window.AudioContext || window.webkitAudioContext)()
				const analyser = audioContext.createAnalyser()
				const microphone = audioContext.createMediaStreamSource(stream)
				const dataArray = new Uint8Array(analyser.frequencyBinCount)

				microphone.connect(analyser)
				analyser.fftSize = 256

				const updateMicLevel = () => {
					if (!this.state.isMicTesting) return

					analyser.getByteFrequencyData(dataArray)
					const average = dataArray.reduce((a, b) => a + b) / dataArray.length
					this.setState({ micTestLevel: Math.min(100, (average / 128) * 100) })

					requestAnimationFrame(updateMicLevel)
				}

				updateMicLevel()

				// Store references for cleanup
				this.audioContextRef.current = audioContext
				this.analyserRef.current = analyser
				this.micTestStream = stream
			})
			.catch(err => {
				console.error('Error accessing microphone:', err)
				this.setState({ isMicTesting: false })
			})
	}

	stopMicTest = () => {
		this.setState({ isMicTesting: false, micTestLevel: 0 })

		if (this.micTestStream) {
			this.micTestStream.getTracks().forEach(track => track.stop())
		}

		if (this.audioContextRef.current) {
			this.audioContextRef.current.close()
		}
	}

	toggleParticipants = () => {
		this.setState({ showParticipants: !this.state.showParticipants })
	}

	showControlsTemporarily = () => {
		this.setState({ showControls: true })

		if (this.state.controlsTimeout) {
			clearTimeout(this.state.controlsTimeout)
		}

		const timeout = setTimeout(() => {
			this.setState({ showControls: false })
		}, 3000)

		this.setState({ controlsTimeout: timeout })
	}

	componentDidMount() {
		// Auto-hide controls after 3 seconds of inactivity
		document.addEventListener('mousemove', this.showControlsTemporarily)
		document.addEventListener('keydown', this.showControlsTemporarily)
	}

	componentWillUnmount() {
		this.stopMeetingTimer()
		this.stopMicTest()
		document.removeEventListener('mousemove', this.showControlsTemporarily)
		document.removeEventListener('keydown', this.showControlsTemporarily)

		if (this.state.controlsTimeout) {
			clearTimeout(this.state.controlsTimeout)
		}
	}

	openChat = () => this.setState({ showModal: true, newmessages: 0 })
	closeChat = () => this.setState({ showModal: false })
	handleMessage = (e) => this.setState({ message: e.target.value })

	addMessage = (data, sender, socketIdSender) => {
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data }],
		}))
		if (socketIdSender !== socketId) {
			this.setState({ newmessages: this.state.newmessages + 1 })
		}
	}

	handleUsername = (e) => this.setState({ username: e.target.value })

	sendMessage = () => {
		socket.emit('chat-message', this.state.message, this.state.username)
		this.setState({ message: "", sender: this.state.username })
	}

	copyUrl = () => {
		let text = window.location.href
		if (!navigator.clipboard) {
			let textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy')
				message.success("Link copied to clipboard!")
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, () => {
			message.error("Failed to copy")
		})
	}

	connect = () => this.setState({ askForUsername: false }, () => this.getMedia())

	isChrome = function () {
		let userAgent = (navigator && (navigator.userAgent || '')).toLowerCase()
		let vendor = (navigator && (navigator.vendor || '')).toLowerCase()
		let matchChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null
		// let matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
		// return matchChrome !== null || matchFirefox !== null
		return matchChrome !== null
	}

	render() {
		if(this.isChrome() === false){
			return (
				<div className="browser-warning">
					<Card elevation={3} className="warning-card">
						<CardContent>
							<Typography variant="h4" className="warning-title">
								Browser Not Supported
							</Typography>
							<Typography variant="body1" className="warning-text">
								Let's Flow Connect works best with Google Chrome for optimal video calling experience.
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
								className="download-chrome-btn"
							>
								Download Chrome
							</Button>
						</CardContent>
					</Card>
				</div>
			)
		}
		return (
			<div className="meeting-container">
				{this.state.askForUsername === true ?
					<div className="pre-meeting-setup">
						<div className="setup-card-container">
							<Card elevation={6} className="setup-card">
								<CardContent className="setup-content">
									<Typography variant="h4" className="setup-title">
										Join Meeting Room
									</Typography>
									<Typography variant="body2" className="setup-subtitle">
										Set your display name and test your devices
									</Typography>

									<div className="username-section">
										<Input
											placeholder="Enter your name"
											value={this.state.username}
											onChange={e => this.handleUsername(e)}
											className="username-input"
											fullWidth
											disableUnderline
										/>
									</div>

									<div className="device-preview">
										<div className="video-preview-container">
											<video
												id="preview-video"
												ref={this.localVideoref}
												autoPlay
												muted
												className="video-preview"
											></video>
											<div className="preview-overlay">
												<Chip
													icon={<RecordVoiceOverIcon />}
													label={this.state.username || 'Guest User'}
													className="user-chip"
												/>
											</div>
										</div>
									</div>

									<div className="device-controls">
										<div className="control-group">
											<Tooltip title={this.state.video ? "Turn off camera" : "Turn on camera"}>
												<IconButton
													onClick={this.handleVideo}
													className={`control-btn ${this.state.video ? 'active' : 'inactive'}`}
												>
													{this.state.video ? <VideocamIcon /> : <VideocamOffIcon />}
												</IconButton>
											</Tooltip>

											<Tooltip title={this.state.audio ? "Mute microphone" : "Unmute microphone"}>
												<IconButton
													onClick={this.handleAudio}
													className={`control-btn ${this.state.audio ? 'active' : 'inactive'}`}
												>
													{this.state.audio ? <MicIcon /> : <MicOffIcon />}
												</IconButton>
											</Tooltip>

											<Tooltip title="Test microphone">
												<IconButton
													onClick={this.startMicTest}
													className={`control-btn ${this.state.isMicTesting ? 'testing' : ''}`}
												>
													<VolumeUpIcon />
												</IconButton>
											</Tooltip>
										</div>

										{this.state.isMicTesting && (
											<div className="mic-test-section">
												<Typography variant="body2" className="mic-test-label">
													Microphone Test - Speak now
												</Typography>
												<LinearProgress
													variant="determinate"
													value={this.state.micTestLevel}
													className="mic-level-bar"
												/>
												<Typography variant="caption" className="mic-test-instruction">
													{this.state.micTestLevel > 10 ? 'Great! Your microphone is working' : 'Speak louder to test your microphone'}
												</Typography>
											</div>
										)}
									</div>

									<Button
										variant="contained"
										color="primary"
										onClick={this.connect}
										className="join-meeting-btn"
										size="large"
										disabled={!this.state.username.trim()}
									>
										Join Meeting
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
					:
					<div className="main-meeting-interface">
						{/* Top Bar */}
						<div className={`meeting-header ${this.state.showControls ? 'visible' : 'hidden'}`}>
							<div className="meeting-info">
								<Typography variant="h6" className="meeting-title">
									Let's Flow Connect
								</Typography>
								<div className="meeting-stats">
									<Chip
										icon={<PeopleIcon />}
										label={`${this.state.participantCount} participant${this.state.participantCount !== 1 ? 's' : ''}`}
										size="small"
										className="participant-chip"
									/>
									<Chip
										label={this.formatDuration(this.state.meetingDuration)}
										size="small"
										className="duration-chip"
									/>
									<Chip
										label={this.state.connectionQuality}
										size="small"
										className={`quality-chip ${this.state.connectionQuality}`}
									/>
								</div>
							</div>

							<div className="header-actions">
								<Tooltip title="Meeting Link">
									<IconButton onClick={this.copyUrl} className="header-btn">
										<LinkIcon />
									</IconButton>
								</Tooltip>

								<Tooltip title="Participants">
									<IconButton onClick={this.toggleParticipants} className="header-btn">
										<Badge badgeContent={this.state.participantCount} color="primary">
											<PeopleIcon />
										</Badge>
									</IconButton>
								</Tooltip>

								<Tooltip title="Settings">
									<IconButton onClick={this.toggleSettings} className="header-btn">
										<SettingsIcon />
									</IconButton>
								</Tooltip>

								<Tooltip title={this.state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
									<IconButton onClick={this.toggleFullscreen} className="header-btn">
										{this.state.isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
									</IconButton>
								</Tooltip>
							</div>
						</div>

						{/* Settings Panel */}
						{this.state.showSettings && (
							<Card className="settings-panel" elevation={8}>
								<CardContent>
									<Typography variant="h6" className="settings-title">
										Audio & Video Settings
									</Typography>

									<div className="setting-group">
										<Typography variant="body2" className="setting-label">
											Microphone Volume
										</Typography>
										<div className="volume-control">
											<VolumeOffIcon className="volume-icon" />
											<Slider
												value={this.state.micVolume}
												onChange={this.handleMicVolumeChange}
												className="volume-slider"
												min={0}
												max={100}
											/>
											<VolumeUpIcon className="volume-icon" />
											<Typography variant="caption" className="volume-value">
												{this.state.micVolume}%
											</Typography>
										</div>
									</div>

									<div className="setting-group">
										<Typography variant="body2" className="setting-label">
											Speaker Volume
										</Typography>
										<div className="volume-control">
											<VolumeOffIcon className="volume-icon" />
											<Slider
												value={this.state.speakerVolume}
												onChange={this.handleSpeakerVolumeChange}
												className="volume-slider"
												min={0}
												max={100}
											/>
											<VolumeUpIcon className="volume-icon" />
											<Typography variant="caption" className="volume-value">
												{this.state.speakerVolume}%
											</Typography>
										</div>
									</div>

									<div className="setting-group">
										<Button
											variant={this.state.isMicTesting ? "contained" : "outlined"}
											onClick={this.startMicTest}
											className="mic-test-btn"
											startIcon={<RecordVoiceOverIcon />}
										>
											{this.state.isMicTesting ? 'Stop Mic Test' : 'Test Microphone'}
										</Button>

										{this.state.isMicTesting && (
											<div className="mic-test-display">
												<LinearProgress
													variant="determinate"
													value={this.state.micTestLevel}
													className="mic-level-indicator"
												/>
												<Typography variant="caption">
													Mic Level: {Math.round(this.state.micTestLevel)}%
												</Typography>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Main Video Area */}
						<div className="video-grid-container">
							<div id="main" className="video-grid">
								<div className="local-video-container">
									<video
										id="my-video"
										ref={this.localVideoref}
										autoPlay
										muted
										className="local-video"
									></video>
									<div className="video-overlay">
										<div className="user-info">
											<Chip
												label={`${this.state.username} (You)`}
												size="small"
												className="user-name-chip"
											/>
										</div>
										<div className="video-controls-overlay">
											{!this.state.audio && (
												<div className="muted-indicator">
													<MicOffIcon className="muted-icon" />
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Bottom Controls */}
						<div className={`meeting-controls ${this.state.showControls ? 'visible' : 'hidden'}`}>
							<div className="controls-container">
								<div className="primary-controls">
									<Tooltip title={this.state.audio ? "Mute microphone" : "Unmute microphone"}>
										<Fab
											onClick={this.handleAudio}
											className={`control-fab ${this.state.audio ? 'active' : 'muted'}`}
											size="medium"
										>
											{this.state.audio ? <MicIcon /> : <MicOffIcon />}
										</Fab>
									</Tooltip>

									<Tooltip title="End call">
										<Fab
											onClick={this.handleEndCall}
											className="control-fab end-call"
											size="large"
										>
											<CallEndIcon />
										</Fab>
									</Tooltip>

									<Tooltip title={this.state.video ? "Turn off camera" : "Turn on camera"}>
										<Fab
											onClick={this.handleVideo}
											className={`control-fab ${this.state.video ? 'active' : 'inactive'}`}
											size="medium"
										>
											{this.state.video ? <VideocamIcon /> : <VideocamOffIcon />}
										</Fab>
									</Tooltip>
								</div>

								<div className="secondary-controls">
									{this.state.screenAvailable && (
										<Tooltip title={this.state.screen ? "Stop sharing" : "Share screen"}>
											<IconButton
												onClick={this.handleScreen}
												className={`secondary-control-btn ${this.state.screen ? 'active' : ''}`}
											>
												{this.state.screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
											</IconButton>
										</Tooltip>
									)}

									<Tooltip title="Chat">
										<IconButton
											onClick={this.openChat}
											className="secondary-control-btn"
										>
											<Badge badgeContent={this.state.newmessages} color="error">
												<ChatIcon />
											</Badge>
										</IconButton>
									</Tooltip>
								</div>
							</div>
						</div>

						{/* Enhanced Chat Modal */}
						<Modal show={this.state.showModal} onHide={this.closeChat} className="chat-modal">
							<Modal.Header closeButton className="chat-header">
								<Modal.Title className="chat-title">
									<ChatIcon className="chat-icon" />
									Meeting Chat
								</Modal.Title>
							</Modal.Header>
							<Modal.Body className="chat-body">
								<div className="messages-container">
									{this.state.messages.length > 0 ? this.state.messages.map((item, index) => (
										<div key={index} className="message-item">
											<div className="message-header">
												<span className="message-sender">{item.sender}</span>
												<span className="message-time">
													{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
												</span>
											</div>
											<div className="message-content">
												{item.data}
											</div>
										</div>
									)) : (
										<div className="no-messages">
											<ChatIcon className="no-messages-icon" />
											<Typography variant="body2">No messages yet</Typography>
											<Typography variant="caption">Start the conversation!</Typography>
										</div>
									)}
								</div>
							</Modal.Body>
							<Modal.Footer className="chat-footer">
								<div className="message-input-container">
									<Input
										placeholder="Type your message..."
										value={this.state.message}
										onChange={e => this.handleMessage(e)}
										className="message-input"
										fullWidth
										disableUnderline
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												this.sendMessage()
											}
										}}
									/>
									<Button
										variant="contained"
										color="primary"
										onClick={this.sendMessage}
										className="send-button"
										disabled={!this.state.message.trim()}
									>
										Send
									</Button>
								</div>
							</Modal.Footer>
						</Modal>

						{/* Meeting Link Display (Hidden but accessible) */}
						<div className="meeting-link-hidden">
							<Input value={window.location.href} style={{ display: 'none' }} />
						</div>
					</div>
				}
			</div>
		)
	}
}

export default Video