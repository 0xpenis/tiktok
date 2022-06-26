// let video = document.querySelectorAll("video");
// video.forEach((video) => {
//   let playPromise = video.play();
//   if (playPromise !== undefined) {
//     playPromise.then(() => {
//       let observer = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             video.muted = false;
//             if (entry.intersectionRatio !== 1 && !video.paused) {
//               video.pause();
//             } else if (entry.intersectionRatio > 0.5 && video.paused) {
//               video.play();
//             }
//           });
//         },
//         { threshold: 0.5 }
//       );
//       observer.observe(video);
//     });
//   }
// });
let videoStreams = {}
let prev

let isApple = false
let videoRoot = document.getElementById("appVideos")
const parser = new DOMParser();
var player = dashjs.MediaPlayer().create();


fetch('https://www.reddit.com/r/hoottgirls.json')
  .then(function(res) {
    return res.json();   // Convert the data into JSON
  })
  .then(function(data) {
    console.log(data.data)
    appendPosts(data.data.children);  
  })
  .catch(function(err) {
    console.log(err);   // Log error if any
  });

const appendPosts = (data) => {
     data.filter(elem=>elem.data.preview.reddit_video_preview?.dash_url).map((elem, idx)=>{
         console.log(elem)
        let htmlString = `
        <div class="video">
        <video id="video-${idx}" class="video_player" data-dashjs-player loop>
        </video>
        <div class="videoFooter">
            <div class="videoFooterTicker">
                <span class="material-icons">send</span>
                <marquee>${elem.data.title}</marquee>
            </div>
        </div>
    </div>`
    let videoElem = parser.parseFromString(htmlString, "text/html");
    videoRoot.appendChild(videoElem.firstChild.children[1].firstChild)
    videoStreams[`video-${idx}`] = elem.data.preview.reddit_video_preview.dash_url.split("?")[0]
    })
    urlChanger();

}

const initializeVideo = (id, url, prev = document.getElementById("video-0")) => {
    console.log(id,url, prev)
    let elem = document.getElementById(id)
        player.initialize(elem, url, true);
        prev.pause()
        elem.play()  
    // if(elem.src === ""){
    //     console.log(1)
    //     player.initialize(elem, url, true);
    //     prev.pause()
    //     elem.play()        
    // }
    // else {
    //     console.log(2)
    //     prev.pause()
    //     elem.play()
    // }
}

function urlChanger(){         
    let videoObserver = new IntersectionObserver((entries, videoObserver) => { 
        entries.forEach(entry => {
            
        if(entry.intersectionRatio>0.5){
            console.log(entry)
            initializeVideo(entry.target.firstElementChild.id,videoStreams[entry.target.firstElementChild.id], prev)
            prev = entry.target.firstElementChild
        }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.video').forEach(div => { videoObserver.observe(div) });   
      
}
// <video class="video_player" src="${isApple?elem.data.media.reddit_video.hls_url.split("?")[0]:elem.data.media.reddit_video.dash_url.split("?")[0]}" autoplay="" muted="" controls="" loop="" disablepictureinpicture="" controlslist="nodownload noplaybackrate">
// <source src="${isApple?elem.data.media.reddit_video.hls_url.split("?")[0]:elem.data.media.reddit_video.fallback_url.split("?")[0]}" type="application/dash+xml">
// </video>