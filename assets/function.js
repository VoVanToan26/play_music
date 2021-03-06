const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY='TOAN_PLAYER';

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
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
  songs: [
    {
      name: "Home-Westlife",
      singer: "Raftaar x Fortnite",
      path: "/assets/music/Home-Westlife.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Nothing gonna change my love on you",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "/assets/music/Nothing-gonna-change-my-love-on-you.mp3",
      image:
        "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
    },
    {
      name: "Sugar-Sam",
      singer: "Raftaar x Brobha V",
      path: "/assets/music/Sugar-Sam-Tsui.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
    },
    {
      name: "Try",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "/assets/music/Try-P-nk.mp3",
      image:
        "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
    },
  ],
  setConfig:function(key,value){
    this.config[key]=value;
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config) )
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    });
    $(".playlist").innerHTML = htmls.join("");
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

    // X??? l?? CD quay v?? d???ng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // Quay trong 10s
      iterations: Infinity, // Li??n quan ?????n timing function
    });
    cdThumbAnimate.pause();
    //  X??? l?? ph??ng to thu nh??? cd
    document.onscroll = function () {
      const scrollTop = window.scrollY;
      const newCdWidth = cdWidth - scrollTop;
      //  set chi???u cao
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      // set ????? m???
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //  X??? l?? khi click play
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
    //  Khi ti???n ????? b??i h??t thay ?????i
    audio.ontimeupdate = function () {
      // console.log(audio.currentTime/audio.duration*100)
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //  X??? l?? khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    // Khi nh???n next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //  Khi nh???n prev
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.preSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //  Khi nh???n random b??i b???t t???t
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom',_this.isRandom)
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //  Khi nh??n ph??t l???i
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat',_this.isRepeat)

      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.onclick();
      }
    };
    // L???ng nghe click v??o playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const option = e.target.closest(".option");
      // N???u n?? kh??ng active v?? v?? l?? option th??
      if (songNode || option) {
        if (songNode) {
          // console.log(songNode.dataset.index)
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        if (option) {
          console.log(option);
        }
      }
      //X??? l?? khi click v??o option
      else {
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    audio.textContent = this.currentSong.name;
  },
  loadConfig:function(){
    this.isRandom= this.config.isRandom
    this.isRepeat= this.config.isRepeat
  },
  //  Chuy???n b??i
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
      this.currentIndex = this.songs.length-1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === newIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() =>
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    );
  },
  start: function () {
    //G??n c???u h??nh t??? config v??o object ?????c t??? local storage --> config
    this.loadConfig();
    //?????nh ngh??a c??c thu???c t??nh cho ob
    this.defineProperties();

    // L???ng nghe x??? l?? c??c s??? ki???n
    this.handleEvent();

    //T???i th??ng tin b??i h??t v??o UI
    this.loadCurrentSong();
    //  Render danh s??ch b??i h??t
    this.render();

    //  Hi???n th??? trang th??i ban ?????u c???a btn repaet and random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
    console.log(this.config)

  },
};
app.start();
