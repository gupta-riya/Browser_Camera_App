
let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture");
let videoElem = document.querySelector("#video-elem");
let timingElem = document.querySelector(".timing");
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
        // convert any blob in url
        const url = window.URL.createObjectURL(blob);
    
        let a = document.createElement("a");
        a.download = "file.mp4";
        a.href = url;
        a.click();
        //clear buffer
        buffer = [];
    
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
    // draw frame on canvas
    tool.drawImage(videoElem,0,0);
    // canvas to data URL and download
    let link = canvas.toDataURL();
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.download = "frame.png";
    anchor.click();
    anchor.remove();
    canvas.remove();

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