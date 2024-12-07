import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import './HandBook.scss';

class HandBook extends Component {
    render() {
        const settings = {
            ...this.props.settings,
            className: "handbook-slider"
        };

        const handbooks = [
            {
                id: 1,
                title: 'Điều trị cơ xương khớp',
                description: 'Các phương pháp điều trị hiện đại',
                image: 'handbook-1.jpg'
            },
            {
                id: 2,
                title: 'Chăm sóc xương khớp',
                description: 'Hướng dẫn tập luyện phục hồi',
                image: 'handbook-2.jpg'
            },
            // Add more items as needed
        ];

        return (
            <div className='handbook-section'>
                <div className='handbook-container'>
                    <div className='section-header'>
                        <div className='header-content'>
                            <h2 className='title'>
                                <i className="fas fa-book-medical"></i>
                                <FormattedMessage id="homepage.handbook"/>
                            </h2>
                            <button className='view-more'>
                                <span>
                                    <FormattedMessage id="homepage.more-info"/>
                                </span>
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <div className='section-body'>
                        <Slider {...settings}>
                            {handbooks.map(handbook => (
                                <div key={handbook.id} className='handbook-item'>
                                    <div className='handbook-content'>
                                        <div 
                                            className='handbook-image'
                                            style={{
                                                backgroundImage: `url(${handbook.image})`
                                            }}
                                        >
                                            <div className='overlay'></div>
                                        </div>
                                        <div className='handbook-info'>
                                            <h3 className='handbook-title'>
                                                {handbook.title}
                                            </h3>
                                            <p className='handbook-description'>
                                                {handbook.description}
                                            </p>
                                            <div className='handbook-footer'>
                                                <span className='read-more'>
                                                    <FormattedMessage id="homepage.read-more"/>
                                                    <i className="fas fa-chevron-right"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
});

export default connect(mapStateToProps)(HandBook);
