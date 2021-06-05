
let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture");
let videoElem = document.querySelector("#video-elem");
let timingElem = document.querySelector(".timing");
let allFilters = document.querySelectorAll(".filter");
let uiFilter = document.querySelector(".ui-filter");
let zoomOutElem = document.getElementById("minus-container");
let zoomInElem = document.getElementById("plus-container");
let zoomlevel = 1;

let filterColor = "";
let constraints = {
    video: true,
    audio: true
}
let recordState = false;
let mediaRecorder;
let buffer = [];
let clearObj;



navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
    
    // feed ui
    videoElem.srcObject = mediaStream;
    // new media recorder object
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.addEventListener("dataavailable",function(e){
    buffer.push(e.data);

    mediaRecorder.addEventListener("stop",function(){
        // convert the data into a blob
        // mime type
        let blob = new Blob(buffer,{type: "video/mp4"});
        
        buffer = [];
        addMediaToGallery(blob,"video");
        
    
    })
})
}).catch(function(err){
    console.log(err);
})




videoRecorder.addEventListener("click",function(){

    if(!mediaRecorder)
    {
        alert("First allow media permission");
    }
    if(recordState==false)
    {
        // start recording
        mediaRecorder.start();
        // videoRecorder.innerHTML = "Recording...";
        videoRecorder.classList.add("record-animation");
        startCounting();
        recordState = true;
    }
    else
    {
        //stop recording
        mediaRecorder.stop();
        // videoRecorder.innerHTML = "Record";
        stopCounting();
        videoRecorder.classList.remove("record-animation");
        recordState = false;
    }
})



// capture
captureBtn.addEventListener("click",function(){
    
    //create a canvas element and assign dim same of video frame
    let canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;

    let tool = canvas.getContext("2d");
    captureBtn.classList.add("capture-animation");

    // always scale image before drawing 
    // scale on center using translate function else it will click from 0,0
    tool.scale(zoomlevel,zoomlevel);
    // take out center coordinates
    let x = (canvas.width/zoomlevel - canvas.width)/2;
    let y = (canvas.height/zoomlevel - canvas.height)/2;
    
    // draw frame on canvas
    tool.drawImage(videoElem,x,y);

    

    // if only we have a filter color
    if(filterColor)
    {
        //add filter color
        tool.fillStyle = filterColor;
        //this will create a layer on top of image
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    
    // things are drawn above this layer

    // canvas to data URL and download
    let link = canvas.toDataURL();
    addMediaToGallery(link,"img");

    // let anchor = document.createElement("a");
    // anchor.href = link;
    // anchor.download = "frame.png";
    // anchor.click();
    // anchor.remove();
    // canvas.remove();

    // we need only a single second animation
    setTimeout(function(){
        captureBtn.classList.remove("capture-animation");
    },1000);

})

function startCounting(){

    timingElem.classList.add(".timing-active");
    let timeCount = 0;
    clearObj = setInterval(function(){
        let seconds = (timeCount%60) < 10 ? `0${Number.parseInt(timeCount%60)}` : `${Number.parseInt(timeCount%60)}`;
        let minutes = (timeCount/60) < 10 ? `0${Number.parseInt(timeCount/60)}` : `${Number.parseInt(timeCount/60)}`;
        let hours = (timeCount/3600) < 10 ? `0${Number.parseInt(timeCount/3600)}` : `${Number.parseInt(timeCount/3600)}`;
        timingElem.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    },1000);
}

function stopCounting(){
    timingElem.classList.remove(".timing-active");
    timingElem.innerText = "00:00:00";
    clearInterval(clearObj);
}


// filter apply
for(let i = 0 ; i < allFilters.length; i++)
{
    allFilters[i].addEventListener("click",function(){

        // add filter to ui
        let color = allFilters[i].style.backgroundColor;
        if(color){

            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        }
        else
        {
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor = "";
            filterColor="";
        }
    })
}



// zoom in and out
zoomInElem.addEventListener("click",function(){
    zoomlevel += 0.2;
    if(zoomlevel < 3){
        videoElem.style.transform = `scale(${zoomlevel})`;
    }
    else{
        zoomlevel = 3;
    }
})

zoomOutElem.addEventListener("click",function(){
    zoomlevel -= 0.2;
    if(zoomlevel > 1)
    {
        videoElem.style.transform = `scale(${zoomlevel})`;
    }
    else
    {
        zoomlevel = 1;
    }
})