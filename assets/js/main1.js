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
let TOKEN
async function postData(url, data) {
    let creds= btoa('Ost6M33aehUHm2j-J8FYnQ:uqW3rpO4j6l_yyWSDnZ8f89AOgEIRw')
    const response = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${creds}`
      },
    body: form// body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
  const form = new URLSearchParams({
    grant_type: 'password',
    username: 'Famous-Rub-203',
    password: 'ashish0054'})

async function getPosts(url, params) {
    const response = await fetch(url, {
        method: 'POST', 
        headers: {'Authorization': `bearer ${TOKEN}`,'User-Agent': 'MyBot/0.0.1'},
    });
    return response.json(); 
    }
    params= new URLSearchParams({'limit':100, 't':'week'}) 

  
  postData('https://www.reddit.com/api/v1/access_token', form)
    .then(data => {
      TOKEN=data["access_token"]
      getPosts('https://oauth.reddit.com/api/v1/me', params)
      .then(data => {
          console.log(data)
      });
    });


     



// # note that CLIENT_ID refers to 'personal use script' and SECRET_TOKEN to 'token'
// auth = requests.auth.HTTPBasicAuth('Ost6M33aehUHm2j-J8FYnQ', 'uqW3rpO4j6l_yyWSDnZ8f89AOgEIRw')

// # here we pass our login method (password), username, and password
// data = {'grant_type': 'password',
//         'username': 'Famous-Rub-203',
//         'password': 'ashish0054'}

// # setup our header info, which gives reddit a brief description of our app
// headers = {'User-Agent': 'MyBot/0.0.1'}

// # send our request for an OAuth token
// res = requests.post('https://www.reddit.com/api/v1/access_token', auth=auth, data=data, headers=headers)

// print(res.json())

// # convert response to JSON and pull access_token value
// TOKEN = res.json()['access_token']

// # add authorization to our headers dictionary
// headers = {**headers, **{'Authorization': f"bearer {TOKEN}"}}

// # while the token is valid (~2 hours) we just add headers=headers to our requests
// # requests.get('https://oauth.reddit.com/api/v1/me', headers=headers)
// meme_file=open("memes.txt","a+")

// def get_reddit_posts():
//         params= {'limit':100, 't':'week'}
//         ['hot','new','rising', 'controversial', 'top']
//         res1 = requests.get("https://oauth.reddit.com/r/premiuminternet/top",params=params,headers=headers)                #get posts from new/top/controverisal



class VideoComponent extends HTMLElement {
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
    }
    static get observeAttributes(){
        return ["dash", "hls"];
    }
  
    connectedCallback(){
        this.render()
    }
    render() {
      this.shadow.innerHTML = `
          <div class="video">
          <div class="videoHeader">
              <span class="material-icons"> arrow_back</span>
              <h3>Reels</h3>
              <span class="material-icons"> camera_alt</span>
          </div>
          <video class="video_player" autoplay muted controls loop disablepictureinpicture controlslist="nodownload noplaybackrate">
              <source src="${this.url}">
          </video>
          <div class="videoFooter">
              <div class="videoFooterText">
                  <img class="user_avatar" src="https://imgs.search.brave.com/ajLBedAg-Urs8cAFoEIqK3VJlCTZy7skDZgqKC4j3dI/rs:fit:512:512:1/g:ce/aHR0cHM6Ly9jZG40/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYXZhdGFyLWNp/cmNsZS0xLTEvNzIv/NTItNTEyLnBuZw" alt="">
                  <h3>Nora Fatehi . <button>Follow</button></h3>
              </div>
              <div class="videoFooterTicker">
                  <span class="material-icons"> music_note</span>
                  <marquee>Song Name</marquee>
              </div>
              <div class="videoFooterActions">
                  <div class="videoFooterActionsIcon">
                      <span class="material-icons"> favorite</span>
                      <span class="material-icons"> mode_comment</span>
                      <span class="material-icons"> send</span>
                      <span class="material-icons"> more_horiz</span>
                  </div>
              </div>
          </div>
          </div>
          `;
    }
  }
  customElements.define('video-component', VideoComponent)