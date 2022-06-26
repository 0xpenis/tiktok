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
     data.filter(elem=>elem.data.domain==="redgifs.com").map((elem, idx)=>{
         console.log(elem.data.secure_media.oembed.thumbnail_url)
        let urlArray = elem.data.secure_media.oembed.thumbnail_url.slice(0,-11)
        let htmlString = `
        <div class="video">
        <video id="video-${idx}" class="video_player" src="${urlArray}.mp4" autoplay loop>
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
    // videoStreams[`video-${idx}`] = elem.data.preview.reddit_video_preview.dash_url.split("?")[0]
    })
    urlChanger();

}

const initializeVideo = (id, url, prev = document.getElementById("video-0")) => {
    console.log(id,url, prev)
    let elem = document.getElementById(id)
        player.initialize(elem, url, true);
        prev.pause()
        elem.play()  
}

function urlChanger(){         
    let video = document.querySelectorAll("video");
    video.forEach((video) => {
      let playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          let observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                video.muted = false;
                if (entry.intersectionRatio !== 1 && !video.paused) {
                  video.pause();
                } else if (entry.intersectionRatio > 0.5 && video.paused) {
                  video.play();
                }
              });
            },
            { threshold: 0.5 }
          );
          observer.observe(video);
        });
      }
    });
}