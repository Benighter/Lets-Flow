import React, { Component } from 'react';
import { Input, Button, Card, CardContent, Typography, Grid, Chip } from '@material-ui/core';
import { VideoCall, PersonAdd, Security, Speed, Chat, ScreenShare } from '@material-ui/icons';
import "./Home.css"

class Home extends Component {
  	constructor (props) {
		super(props)
		this.state = {
			meetingId: '',
			showJoinForm: false,
			showStartForm: false
		}
	}

	handleChange = (e) => this.setState({ meetingId: e.target.value })

	startMeeting = () => {
		const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
		window.location.href = `/${roomId}`
	}

	joinMeeting = () => {
		if (this.state.meetingId.trim() !== "") {
			const meetingId = this.state.meetingId.trim().replace(/\s+/g, '').toUpperCase()
			window.location.href = `/${meetingId}`
		}
	}

	toggleJoinForm = () => {
		this.setState({
			showJoinForm: !this.state.showJoinForm,
			showStartForm: false,
			meetingId: ''
		})
	}

	toggleStartForm = () => {
		this.setState({
			showStartForm: !this.state.showStartForm,
			showJoinForm: false,
			meetingId: ''
		})
	}

	render() {
		return (
			<div className="landing-container">
				{/* Hero Section */}
				<div className="hero-section">
					<div className="hero-content">
						<div className="logo-section">
							<VideoCall className="logo-icon" />
							<h1 className="app-title">Let's Flow Connect</h1>
						</div>
						<p className="app-subtitle">
							Connect, collaborate, and communicate seamlessly with high-quality video meetings
						</p>
						<div className="feature-chips">
							<Chip icon={<Security />} label="Secure" className="feature-chip" />
							<Chip icon={<Speed />} label="Fast" className="feature-chip" />
							<Chip icon={<Chat />} label="Chat" className="feature-chip" />
							<Chip icon={<ScreenShare />} label="Screen Share" className="feature-chip" />
						</div>
					</div>
				</div>

				{/* Action Section */}
				<div className="action-section">
					<Grid container spacing={4} justifyContent="center" alignItems="stretch">
						{/* Start Meeting Card */}
						<Grid item xs={12} sm={6} md={5}>
							<Card className="action-card start-card" elevation={3}>
								<CardContent className="card-content">
									<VideoCall className="card-icon start-icon" />
									<Typography variant="h5" className="card-title">
										Start a Meeting
									</Typography>
									<Typography variant="body2" className="card-description">
										Create a new meeting room and invite others to join
									</Typography>
									{!this.state.showStartForm ? (
										<Button
											variant="contained"
											className="primary-button start-button"
											onClick={this.toggleStartForm}
											size="large"
										>
											Start Meeting
										</Button>
									) : (
										<div className="form-section">
											<Typography variant="body2" className="form-text">
												Ready to start your meeting?
											</Typography>
											<div className="button-group">
												<Button
													variant="contained"
													className="primary-button"
													onClick={this.startMeeting}
													size="large"
												>
													Create Room
												</Button>
												<Button
													variant="outlined"
													className="secondary-button"
													onClick={this.toggleStartForm}
													size="large"
												>
													Cancel
												</Button>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</Grid>

						{/* Join Meeting Card */}
						<Grid item xs={12} sm={6} md={5}>
							<Card className="action-card join-card" elevation={3}>
								<CardContent className="card-content">
									<PersonAdd className="card-icon join-icon" />
									<Typography variant="h5" className="card-title">
										Join a Meeting
									</Typography>
									<Typography variant="body2" className="card-description">
										Enter a meeting ID to join an existing room
									</Typography>
									{!this.state.showJoinForm ? (
										<Button
											variant="outlined"
											className="secondary-button join-button"
											onClick={this.toggleJoinForm}
											size="large"
										>
											Join Meeting
										</Button>
									) : (
										<div className="form-section">
											<Input
												placeholder="Enter Meeting ID"
												value={this.state.meetingId}
												onChange={this.handleChange}
												className="meeting-input"
												fullWidth
												disableUnderline
											/>
											<div className="button-group">
												<Button
													variant="contained"
													className="primary-button"
													onClick={this.joinMeeting}
													disabled={!this.state.meetingId.trim()}
													size="large"
												>
													Join Room
												</Button>
												<Button
													variant="outlined"
													className="secondary-button"
													onClick={this.toggleJoinForm}
													size="large"
												>
													Cancel
												</Button>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</div>

				{/* Features Section */}
				<div className="features-section">
					<Typography variant="h4" className="features-title">
						Why Choose Let's Flow Connect?
					</Typography>
					<Grid container spacing={3} justifyContent="center">
						<Grid item xs={12} sm={6} md={3}>
							<div className="feature-item">
								<Security className="feature-icon" />
								<Typography variant="h6" className="feature-name">Secure</Typography>
								<Typography variant="body2" className="feature-desc">
									End-to-end encrypted video calls
								</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<div className="feature-item">
								<Speed className="feature-icon" />
								<Typography variant="h6" className="feature-name">Fast</Typography>
								<Typography variant="body2" className="feature-desc">
									Lightning-fast connection setup
								</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<div className="feature-item">
								<Chat className="feature-icon" />
								<Typography variant="h6" className="feature-name">Chat</Typography>
								<Typography variant="body2" className="feature-desc">
									Real-time messaging during calls
								</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<div className="feature-item">
								<ScreenShare className="feature-icon" />
								<Typography variant="h6" className="feature-name">Share</Typography>
								<Typography variant="body2" className="feature-desc">
									Screen sharing made simple
								</Typography>
							</div>
						</Grid>
					</Grid>
				</div>
			</div>
		)
	}
}

export default Home;