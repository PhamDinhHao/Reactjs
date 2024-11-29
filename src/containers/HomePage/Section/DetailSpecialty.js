import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Home from '../../routes/Home';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
import HandBook from './Section/HandBook';
import About from './Section/About';
import HomeFooter from './HomeFooter';
import './HomePage.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
class DetailSpecialty extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    async componentDidMount(){

    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){
        }
    }



    render(){
        return (
            <>
                <HomeHeader />
                <div className='detail-specialty-container'>
                    hello
                </div>
            </>

        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
