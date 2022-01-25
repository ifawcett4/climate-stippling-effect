import React, {useRef, useEffect, useState } from "react"
import gsap from 'gsap'
import '../stylesheets/Camera.scss';
import './Results'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap';
// import axios from 'axios'


const Camera = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const [photoIsCaptured, setPhotoIsCaptured] =  useState(false)

    //get camerafeed
    const getVideo = () =>{
        navigator.mediaDevices
        .getUserMedia({video: {width: 1920, height: 1080}}) //camera feed size not end display size
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        } )
        .catch(err => {
            console.error(err);
        })
    }

    // you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined.
    useEffect(()=>{
        getVideo();
    }, [videoRef] ) //useEffect AFTER video set


    //capture current canvas as photo
    const takePhoto = () => {
        const width = 1920;
        const height = width / (16/9); //aspect ratio of camera

        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let context = photo.getContext('2d');
        context.drawImage(video, 0 , 0, width, height);
        setPhotoIsCaptured(true);

        gsap.from(".results-container", {
            yPercent: 200,
            duration: 2,
            ease: "expo.out",
        });

        gsap.to(".results-container", {
            yPercent: 50,
            duration: 2,
            ease: "expo.out",
        });


        document.querySelector('.camera').style.display = "none";
        document.querySelector('.results-container').style.display = "block";

    }

    //re-take photo
    const tryAgain = () => {    
        gsap.to(".results-container", {
            yPercent: 0,
            duration: 1,
        });
        document.querySelector('.camera').style.display = "block";
        document.querySelector('.results-container').style.display = "none";
    }

    // "Save & Continue" = Convert canvas to image & upload to url
    const canvasToImage = () => {
        console.log('convert')
        var canvas = document.querySelector('.photo');
        var dataURL = canvas.toDataURL("image/jpeg", 1.0); //store this data to get image later
        // downloadImage(dataURL, 'my-canvas.jpeg'); //name of image in downloads

        //set data to localStorage
        localStorage.setItem('imageData', JSON.stringify(dataURL))    

    }



    // Save/Download image function
    // function downloadImage(data, filename = 'untitled.jpeg') {
    //     console.log('downloadImage')
    //     var a = document.createElement('a');
    //     a.href = data;
    //     a.download = filename;
    //     document.body.appendChild(a);
    //     a.click();
    //     console.log(a)
    // }

  return (
      <div>
        <div className='camera'>
            <video ref={videoRef}></video>
            {/* take photo only captures to canvas w/o saving any data for preview only*/}
            <button  onClick={takePhoto}> take picture </button> 
        </div>
        <div className={'results' + (photoIsCaptured ? 'photoIsCaptured' : '')}>
            <div className="results-container">
                <canvas className='photo' ref={photoRef}></canvas>
                <div className='buttons'>
                    <button onClick={tryAgain}  className="btn"> Try Again </button>
                    {/* save btn converts and saves the img data for later*/}
                    <Link to="/qr">
                    <Button className="btn" variant="outline-light" size="lg" onClick={canvasToImage}> save and continue </Button>
                    </Link> 

                </div>

            </div>

       </div>
      </div>

  );
}

export default Camera;
