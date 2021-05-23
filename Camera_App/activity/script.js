
let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture");
let videoElem = document.querySelector("#video-elem");
let constraints = {
    video: true,
    audio: true
}
let recordState = false;
let mediaRecorder;
let buffer = [];


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
        recordState = true;
    }
    else
    {
        //stop recording
        mediaRecorder.stop();
        // videoRecorder.innerHTML = "Record";
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

})