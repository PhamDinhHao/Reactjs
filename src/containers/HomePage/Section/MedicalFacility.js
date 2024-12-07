import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import './MedicalFacility.scss';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if (res) {
            this.setState({
                dataClinics: res
            })
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }

    getImageUrl = (imageBuffer) => {
        if (imageBuffer && imageBuffer.data) {
            const chars = imageBuffer.data.map(byte => String.fromCharCode(byte)).join('');
            if (chars.startsWith('data:image')) {
                return chars;
            }
        }
        return 'https://via.placeholder.com/400x250?text=No+Image';
    }

    render() {
        let { dataClinics } = this.state;
        console.log('check dataClinics', dataClinics);
        return (
            <div className='medical-facility-section'>
                <div className='section-container'>
                    <div className='section-header'>
                        <div className='title-container'>
                            <h2 className='title-section'>
                                <i className="fas fa-hospital-alt"></i>
                                Cơ sở y tế nổi bật
                            </h2>
                            <div className='title-description'>
                                Các cơ sở y tế hàng đầu được tin tưởng
                            </div>
                        </div>
                        <button className='btn-section'>
                            Xem thêm
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>

                    <div className='section-body'>
                        <Slider {...this.props.setting}>
                            {dataClinics && dataClinics.length > 0 && 
                                dataClinics.map((item, index) => (
                                    <div 
                                        className='clinic-card' 
                                        key={index} 
                                        onClick={() => this.handleViewDetailClinic(item)}
                                    >
                                        <div className='clinic-image'>
                                            <img 
                                                src={this.getImageUrl(item.image)} 
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
                                                }}
                                            />
                                            <div className='clinic-overlay'>
                                                <span>Xem chi tiết</span>
                                            </div>
                                        </div>
                                        <div className='clinic-info'>
                                            <h3 className='clinic-name'>{item.name}</h3>
                                            <div className='clinic-address'>
                                                <i className="fas fa-map-marker-alt"></i>
                                                {item.address || 'Địa chỉ đang cập nhật'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
