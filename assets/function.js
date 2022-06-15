const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn =$('.btn-repeat')
const playlist= $(".playlist")
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat:false,
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "https://songs16.vlcmusic.com/download.php?track_id=45438&format=320",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Tribute To Sidhu Moose Wala Sufi Balbir",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "https://songs16.vlcmusic.com/download.php?track_id=45443&format=48",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "https://songs16.vlcmusic.com/download.php?track_id=37890&format=48",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "https://songs16.vlcmusic.com/download.php?track_id=37701&format=48",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
        <div class="song ${index===this.currentIndex?'active':''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
      `;
    });
    $(".playlist").innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    // console.log(this);
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    // _this=app
    _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // Quay trong 10s
      iterations: Infinity, // Liên quan đến timing function
    });
    cdThumbAnimate.pause();
    //  Xử lý phóng to thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      //  set chiều cao
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      // set độ mờ
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //  Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    // Khi song dc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // Khi song dc pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause(); // Animate API
    };
    //  Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      // console.log(audio.currentTime/audio.duration*100)
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;
      }
    };
    //  Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    }
    // Khi nhẫn next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render()
      _this.scrollToActiveSong();
    };
    //  Khi nhấn prev
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.preSong();
      }
      audio.play();
    };
    //  Khi nhấn random bài bật tắt
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
     //  Khi nhân phát lại
     repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended=function(){
      if(_this.isRepeat){
audio.play();
      }else{
        nextBtn.onclick()
      }
    }
// Lắng nghe click vào playlist
    playlist.onclick=function(e){
      const songNode=e.target.closest('.song:not(.active)');
      // Nếu nó không active và và là option thì
      if(songNode||e.target.closest('.option')){
        if(songNode){
          console.log(songNode.getAttribute('data-index'))
          
        }
          //Xử lý khi click vào song
      } 
          //Xử lý khi click vào option
      else{


      }
        

    }
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    audio.textContent = this.currentSong.name;
  },
  //  Chuyển bài
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex ===  newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong:function(){
    setTimeout(()=> $('.song.active').scrollIntoView({
      behavior:'smooth',
      block:'nearest'

    }))
  },
  start: function () {
    //Định nghĩa các thuộc tính cho ob
    this.defineProperties();

    // Lắng nghe xử lý các sự kiện
    this.handleEvent();

    //Tải thông tin bài hát vào UI
    this.loadCurrentSong();
    //  Render danh sách bài hát
    this.render();
  },
};
app.start();
