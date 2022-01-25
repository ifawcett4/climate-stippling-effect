import '../stylesheets/Filter.scss';
// import { Delaunay } from 'd3-delaunay';
// import * as d3 from 'd3-transition'
import * as d3 from 'd3-delaunay';
import { useEffect } from 'react';


const Filter = () => {


  //image data URL from localstorage
  let imageData = localStorage.getItem('imageData') //get data from link from camera
  imageData = JSON.parse(imageData)
  console.log("imageData")

  // download image pt.1
  const clickedDownload = () => {
    downloadImage(imageData, 'my-particles.jpeg'); //name of image in downloads
  }
  //Download image pt.2
  function downloadImage(data, filename = 'my-particles.jpeg') {
    console.log('downloadImage')
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    console.log(a)
  }

  //---- Runs after the first render() lifecycle ------
  useEffect(() => {
    console.log('started')
    
    // draw imageData to canvas (for stippling)
    const canvas = document.querySelector('.imgCanvas');
    let ctx = canvas.getContext('2d');
    let img = document.querySelector('.importedImage');

    canvas.width = 500;
    canvas.height = canvas.width / (16/9);

    img.width = canvas.width
    img.height = canvas.height


    img.onload = function(){
      ctx.drawImage(img,0,0, canvas.width, canvas.height); //! come back to this
      stipple(canvas)

    };
    img.src = imageData;


    //stipple effect 
    function stipple(canvas){
      console.log('stipple effect ')
        const data = {
            width: canvas.width,
            height: canvas.height,
            bwData: imgToBW(canvas),
            n: Math.round((canvas.width * canvas.height /20))
        }
        let points = generatePoints(data);
        drawPoints(points, data.bwData, canvas)
    }

    //convert image to black and white
    function imgToBW(canvas){
      console.log('imgToBW ')
        const imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        const bwData = new Array(imgData.data.length / 4);
        for (let i = 0; i < bwData.length; i++){
            const idx = i * 4;
            let px = (imgData.data[idx] + imgData.data[idx + 1] + imgData.data[idx + 2]) / 3;
            px /= 255;
            px = 1 - px;
            px = px * px * px * px * px * px;
            px *= 255;
            bwData[i] = px;
        }
        return bwData;
    }

    //generate stipple points
    function generatePoints({bwData, width, height, n}){
      console.log('generatePoints ')

        const points = new Array(n * 2);
        const c = new Array(n * 2);
        const s = new Array(n);

        //initialize points using rejection sampling
        for (let i = 0; i < n; i++){
            for (let j = 0; j < 30; j++){
                const x = points[i * 2] = Math.floor(Math.random() * width);
                const y = points[i * 2 + 1] = Math.floor(Math.random() * height);
                if (Math.random() < bwData[y * width + x]) break;
            }
        }

        const delaunay = new d3.Delaunay(points);
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        for (let k = 0; k < 80; k++){
            //compute the weighted centroid for each voronoi cell
            c.fill(0);
            s.fill(0);
            for (let y = 0, i = 0; y < height; y++){
                for (let x = 0; x < width; ++x) {
                    const w = bwData[y * width + x];
                    i = delaunay.find(x + 0.5, y + 0.5, i);
                    s[i] += w;
                    c[i * 2] += w * (x + 0.5);
                    c[i * 2 + 1] += w * (y + 0.5);
                }
            }
            // Relax the diagram by moving points to the weighted centroid.
            // Wiggle the points a little bit so they don’t get stuck.
            const w = Math.pow(k + 1, -0.8) * 10;

            for (let i = 0; i < n; ++i) {
                const x0 = points[i * 2], y0 = points[i * 2 + 1];
                const x1 = s[i] ? c[i * 2] / s[i] : x0, y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
                points[i * 2] = x0 + (x1 - x0) * 1.8 + (Math.random() - 0.5) * w;
                points[i * 2 + 1] = y0 + (y1 - y0) * 1.8 + (Math.random() - 0.5) * w;
            }
            voronoi.update();
        }
        return points;
    }
    //draw points to canvas
    function drawPoints(points, bwData, canvas){
      console.log('drawPoints ')

        const ctx = canvas.getContext('2d');
        //draw bg
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //draw points
        ctx.fillStyle = 'black';
        // console.log("bwData.length:" , bwData.length)
        
        for (let i = 0; i < points.length; i += 2){
            const x = Math.round(points[i]);
            const y = Math.round(points[i + 1]);
            const luma = bwData[y * canvas.width + x] / 255;
            const size = lerp(luma, 1, 4);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    //run for every point in the imag
    function lerp(x, a, b){
      console.log('lerp ')
        return x * (b - a) + a;
    }

}, [imageData]);


  return (
    <div className='filter'> 
      <canvas className='imgCanvas'></canvas>
      <img className='importedImage' alt='capture from camera'></img>
      <button onClick={clickedDownload} > Download </button>
    </div>
  );
}

export default Filter;
