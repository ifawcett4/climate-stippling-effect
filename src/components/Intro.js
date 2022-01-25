import '../stylesheets/Intro.scss';
import { Link } from 'react-router-dom'
import React, {Component } from "react"
import { Button } from 'react-bootstrap';


class Intro extends Component {
    render(){
        return (
            <div className='intro'>
                <h1> logo or something </h1>
                <h2> click continue to take your picture and view the effect</h2>
                <Link to="/camera">
                <Button variant="outline-light" size="lg"> continue</Button>
                </Link>            
            </div>
        );
    }
}

export default Intro;
