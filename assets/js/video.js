let videoStreams = {};
let prev;

let isApple = false;
let videoRoot = document.getElementById("appVideos");
const parser = new DOMParser();
let subReddits = ["desi_boners", "delhigw", "indianfetish", "indiansafterdark","desiindianslutty"];
let subObj ={}
subReddits.forEach(elem=> subObj[elem]="")
const getSub = () =>  subReddits[Math.floor((Math.random()*subReddits.length))]


const fetchPosts = () => {
  let sub = getSub()
  fetch(`https://www.reddit.com/r/${sub}.json?after=${subObj[sub]}`)
    .then(function (res) {
      return res.json(); 
    })
    .then(function (data) {
      console.log(data.data);
      subObj[sub]=data.data.after
      appendPosts(data.data.children);
    })
    .catch(function (err) {
      console.log(err); 
    });
};

fetchPosts();

function compare(a, b) {
  if (
    a.data.preview.reddit_video_preview.duration <
    b.data.preview.reddit_video_preview.duration
  ) {
    return -1;
  }
  if (
    a.data.preview.reddit_video_preview.duration >
    b.data.preview.reddit_video_preview.duration
  ) {
    return 1;
  }
  return 0;
}

const appendPosts = (data) => {
  data
    .filter(
      (elem) => elem.data.domain === "redgifs.com" && elem.data.secure_media
    )
    .filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.data.secure_media?.oembed.thumbnail_url ===
            value.data.secure_media?.oembed.thumbnail_url
        )
    )
    .sort(compare)
    .map((elem, idx) => {
      console.log(elem.data.preview.reddit_video_preview.duration);
      let urlArray = elem.data.secure_media?.oembed.thumbnail_url;
      // getVideos(`${urlArray.slice(0,-4)}.mp4`, idx, elem.data.title)
      let htmlString = `
        <div class="video">
        <video id="video-${idx}" class="video_player" src="${urlArray.slice(
        0,
        -4
      )}.mp4" autoplay muted playsinline loop>
        </video>
        <div class="videoFooter">
            <div class="videoFooterTicker">
                <span class="material-icons">send</span>
                <marquee>${elem.data.title}</marquee>
            </div>
        </div>
        </div>`;
      let videoElem = parser.parseFromString(htmlString, "text/html");
      videoRoot.appendChild(videoElem.firstChild.children[1].firstChild);
    });
  urlChanger();
};

function urlChanger() {
  let videos = document.querySelectorAll("video");
  videos.forEach((video) => {
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
              if (entry.isIntersecting && entry.target===videos[videos.length-1]) {
                fetchPosts()
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

// data.preview.reddit_video_preview.duration
const getVideos = (url, id, title) => {
  const myInit = {
    method: "GET",
    mode: "no-cors",
  };

  const myRequest = new Request(url);

  fetch(myRequest, myInit)
    .then((response) => response.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((href) => {
      console.log(url);
      let htmlString = `
        <div class="video">
        <video id="video-${id}" class="video_player" src="${href}" autoplay muted playsinline loop>
        </video>
        <div class="videoFooter">
            <div class="videoFooterTicker">
                <span class="material-icons">send</span>
                <marquee>${title}</marquee>
            </div>
        </div>
        </div>`;
      let videoElem = parser.parseFromString(htmlString, "text/html");
      videoRoot.appendChild(videoElem.firstChild.children[1].firstChild);
    });
};

// accept: */*
// accept-encoding: identity;q=1, *;q=0
// accept-language: en-GB,en;q=0.9
// range: bytes=0-
// referer: https://www.redgifs.com/
// sec-fetch-dest: video
// sec-fetch-mode: no-cors
// sec-fetch-site: same-site
// sec-gpc: 1
// user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.115 Safari/537.36
