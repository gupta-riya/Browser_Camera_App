let request = indexedDB.open("camera",1);
let db;
request.onsuccess = function(){

    db = request.result;
}

request.onerror = function(){
    console.log(err);
}

request.onupgradeneeded = function(){
    // 1st create
    db = request.result;
    db.createObjectStore("gallery",{keyPath:"mid"});
    
}

function addMediaToGallery(data, type){

    
    let tx = db.transaction('gallery',"readwrite");
    let gallery = tx.objectStore('gallery');
    gallery.add({mid:Date.now(),type,media:data});
}

function viewGallery(){

    let cursor = request.result;
    if(cursor)
    {
        if(cursor.value.type=="video")
        {
            let vidContainer = document.createElement("div");
            vidContainer.setAttribute('data-mId',cursor.value.mId);
            vidContainer.classList.add('gallery-vid-container');
            let video = document.createElement('video');
            vidContainer.appendChild(video);
            let deleteBtn = document.createElement('button');
            deleteBtn.classList.add('gallery-delete-button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.addEventListener('click',deleteBtnHandler);
            let downloadBtn = document.createElement('button');
            downloadBtn.classList.add('gallery-download-button');
            downloadBtn.innerText = 'Download';
            downloadBtn.addEventListener('click',downloadBtnHandler);
            vidContainer.appendChild(deleteBtn);
            vidContainer.appendChild(downloadBtn);
            video.controls = true;
            video.autoplay = true;
            video.src = URL.createObjectURL(cursor.value.media);
            body.appendChild(vidContainer);
        }
    }

}