import '../stylesheets/QRcode.scss';
import { Link } from 'react-router-dom'
import React, {Component } from "react"
import { Button } from 'react-bootstrap';

const qrimg = require('../assets/img/qr-port.png')

class QRcode extends Component {
    render(){
        return (
            <div className='QRcode'>
                <h2> scan this code with your phone to view effect</h2>
                <img src={qrimg} alt="qr code"></img>
                <Link to="/">
                <Button variant="outline-light" size="lg"> restart</Button>
                </Link>            
            </div>
        );
    }
}

export default QRcode;
