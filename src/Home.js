import React, { Component } from 'react';
import { Input, Button, Card, CardContent, Typography, Grid, IconButton } from '@material-ui/core';
import { VideoCall, PersonAdd, Speed, Chat, ScreenShare, Language, LinkedIn, GitHub, FileCopy, Edit, Refresh, Visibility, VisibilityOff } from '@material-ui/icons';
import "./Home.css"

class Home extends Component {
  	constructor (props) {
		super(props)
		this.state = {
			meetingLink: '',
			generatedMeetingLink: '',
			meetingPassword: '',
			isEditingPassword: false,
			showJoinForm: false,
			showStartForm: false,
			showGeneratedLink: false
		}
	}

	handleChange = (e) => this.setState({ meetingLink: e.target.value })

	handlePasswordChange = (e) => this.setState({ meetingPassword: e.target.value })

	generateRandomPassword = () => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		let password = ''
		for (let i = 0; i < 6; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length))
		}
		return password
	}

	generateMeetingLink = () => {
		const roomId = Math.random().toString(36).substring(2, 8).toUpperCase()
		const meetingLink = `${window.location.origin}/${roomId}`
		const password = this.generateRandomPassword()
		this.setState({
			generatedMeetingLink: meetingLink,
			meetingPassword: password,
			showGeneratedLink: true,
			isEditingPassword: false
		})
	}

	startMeeting = () => {
		const roomId = this.state.generatedMeetingLink.split('/').pop()
		window.location.href = `/${roomId}`
	}

	copyMeetingLink = () => {
		navigator.clipboard.writeText(this.state.generatedMeetingLink)
		// You could add a toast notification here
	}

	copyMeetingPassword = () => {
		navigator.clipboard.writeText(this.state.meetingPassword)
	}

	togglePasswordEdit = () => {
		this.setState({ isEditingPassword: !this.state.isEditingPassword })
	}

	regeneratePassword = () => {
		const newPassword = this.generateRandomPassword()
		this.setState({ meetingPassword: newPassword })
	}

	joinMeeting = () => {
		if (this.state.meetingLink.trim() !== "") {
			const meetingLink = this.state.meetingLink.trim()

			// Extract room ID from the meeting link
			try {
				// Handle full URLs like "http://localhost:3000/ABC123" or "https://domain.com/ABC123"
				if (meetingLink.includes('/')) {
					const roomId = meetingLink.split('/').pop()
					if (roomId && roomId.length > 0) {
						window.location.href = `/${roomId}`
					}
				} else {
					// If it's just a room ID, use it directly
					window.location.href = `/${meetingLink.toUpperCase()}`
				}
			} catch (error) {
				console.error('Invalid meeting link format')
			}
		}
	}

	toggleJoinForm = () => {
		this.setState({
			showJoinForm: !this.state.showJoinForm,
			showStartForm: false,
			meetingLink: ''
		})
	}

	toggleStartForm = () => {
		this.setState({
			showStartForm: !this.state.showStartForm,
			showJoinForm: false,
			meetingLink: '',
			generatedMeetingLink: '',
			meetingPassword: '',
			showGeneratedLink: false,
			isEditingPassword: false
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
						<div className="features-showcase">
							<div className="feature-item">
								<div className="feature-icon-wrapper">
									<Speed className="feature-icon" />
								</div>
								<span className="feature-label">Lightning Fast</span>
							</div>
							<div className="feature-item">
								<div className="feature-icon-wrapper">
									<Chat className="feature-icon" />
								</div>
								<span className="feature-label">Real-time Chat</span>
							</div>
							<div className="feature-item">
								<div className="feature-icon-wrapper">
									<ScreenShare className="feature-icon" />
								</div>
								<span className="feature-label">Screen Sharing</span>
							</div>
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
											{!this.state.showGeneratedLink ? (
												<>
													<Typography variant="body2" className="form-text">
														Ready to start your meeting?
													</Typography>
													<div className="button-group">
														<Button
															variant="contained"
															className="primary-button"
															onClick={this.generateMeetingLink}
															size="large"
														>
															Generate Link
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
												</>
											) : (
												<>
													<Typography variant="body2" className="form-text">
														Meeting link generated! Share this link with participants:
													</Typography>
													<div className="meeting-link-container">
														<Input
															value={this.state.generatedMeetingLink}
															className="meeting-link-input"
															fullWidth
															readOnly
															disableUnderline
														/>
														<IconButton
															className="copy-button"
															onClick={this.copyMeetingLink}
															title="Copy Link"
														>
															<FileCopy />
														</IconButton>
													</div>

													<Typography variant="body2" className="form-text password-label">
														Meeting Password:
													</Typography>
													<div className="meeting-password-container">
														{!this.state.isEditingPassword ? (
															<>
																<Input
																	value={this.state.meetingPassword}
																	className="meeting-password-input"
																	fullWidth
																	readOnly
																	disableUnderline
																/>
																<IconButton
																	className="copy-button"
																	onClick={this.copyMeetingPassword}
																	title="Copy Password"
																>
																	<FileCopy />
																</IconButton>
																<IconButton
																	className="edit-button"
																	onClick={this.togglePasswordEdit}
																	title="Edit Password"
																>
																	<Edit />
																</IconButton>
																<IconButton
																	className="refresh-button"
																	onClick={this.regeneratePassword}
																	title="Generate New Password"
																>
																	<Refresh />
																</IconButton>
															</>
														) : (
															<>
																<Input
																	value={this.state.meetingPassword}
																	onChange={this.handlePasswordChange}
																	className="meeting-password-input"
																	fullWidth
																	disableUnderline
																	placeholder="Enter custom password (6 characters)"
																	inputProps={{ maxLength: 6 }}
																/>
																<IconButton
																	className="save-button"
																	onClick={this.togglePasswordEdit}
																	title="Save Password"
																>
																	<Visibility />
																</IconButton>
																<IconButton
																	className="cancel-button"
																	onClick={() => {
																		this.setState({
																			meetingPassword: this.generateRandomPassword(),
																			isEditingPassword: false
																		})
																	}}
																	title="Cancel Edit"
																>
																	<VisibilityOff />
																</IconButton>
															</>
														)}
													</div>
													<div className="button-group">
														<Button
															variant="contained"
															className="primary-button"
															onClick={this.startMeeting}
															size="large"
														>
															Start Meeting
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
												</>
											)}
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
										Enter a meeting link to join an existing room
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
												placeholder="Enter Meeting Link (e.g., http://localhost:3000/ABC123)"
												value={this.state.meetingLink}
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
													disabled={!this.state.meetingLink.trim()}
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

				{/* Footer Section */}
				<footer className="footer">
					<div className="footer-content">
						<Typography variant="body2" className="footer-text">
							Made with <span className="heart">♥</span> by <span className="creator-name">Bennet Nkolele</span>
						</Typography>

						<div className="social-icons">
							<IconButton
								className="social-icon"
								onClick={() => window.open('https://react-personal-portfolio-alpha.vercel.app/', '_blank')}
								title="Portfolio"
							>
								<Language />
							</IconButton>
							<IconButton
								className="social-icon"
								onClick={() => window.open('https://www.linkedin.com/in/bennet-nkolele', '_blank')}
								title="LinkedIn"
							>
								<LinkedIn />
							</IconButton>
							<IconButton
								className="social-icon"
								onClick={() => window.open('https://github.com/Benighter', '_blank')}
								title="GitHub"
							>
								<GitHub />
							</IconButton>
						</div>
					</div>
				</footer>
			</div>
		)
	}
}

export default Home;