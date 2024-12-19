import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';

import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Home from "../../routes/Home";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import OutStandingDoctor from "./Section/OutStandingDoctor";
import HandBook from "./Section/HandBook";
import About from "./Section/About";
import HomeFooter from "./HomeFooter";
import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      input: "",
      isChatOpen: false,
    };
  }

  sendMessage = async () => {
    const { input, messages } = this.state;
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    this.setState(prevState => ({
      messages: [...prevState.messages, userMessage]
    }));

    try {
      const response = await axios.post('http://localhost:8080/api/chat', { message: input });
      const botMessage = { sender: 'bot', text: response.data.reply };
      this.setState(prevState => ({
        messages: [...prevState.messages, botMessage]
      }));
    } catch (error) {
      console.error('Error:', error);
    }

    this.setState({ input: '' });
  };

  handleInputChange = (e) => {
    this.setState({ input: e.target.value });
  };

  toggleChat = () => {
    this.setState(prevState => ({
      isChatOpen: !prevState.isChatOpen
    }));
  };

  render() {
    let setting = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,

      // nextArrow: <SampleNextArrow />,
      // prevArrow: <SamplePrevArrow />
    };

    return (
      <>
        <div>
          <HomeHeader isShowBanner={true} />
          <Specialty setting={setting} />
          <MedicalFacility setting={setting} />
          <OutStandingDoctor setting={setting} />
          <HandBook setting={setting} />
          <HomeFooter />
        </div>
        <div className="chat-button" onClick={this.toggleChat}>
          <i className="fas fa-comments"></i>
        </div>
        {this.state.isChatOpen && (
          <div className="chatbox">
            <div className="chat-header">
              <span>Chat với chúng tôi</span>
              <button className="close-btn" onClick={this.toggleChat}>×</button>
            </div>
            <div className="messages">
              {this.state.messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
            </div>
            <div className="input-box">
              <input
                type="text"
                value={this.state.input}
                onChange={this.handleInputChange}
                placeholder="Nhập tin nhắn..."
              />
              <button onClick={this.sendMessage}>Gửi</button>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
