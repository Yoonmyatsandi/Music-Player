const container = document.querySelector('.container');
const repeatBtn = container.querySelector('#repeatIcon');
const songImg = container.querySelector('.musicImg img');
const songName = container.querySelector('.aboutSong .songName');
const songArtist = container.querySelector('.aboutSong .artist');
const currentAudio = container.querySelector('#currentAudio');
const playBtn = container.querySelector('.playBtn');
const forwardBtn = container.querySelector('#forwardBtn');
const backwardBtn = container.querySelector('#backwardBtn');
const progressBar = container.querySelector('.progressBar');
const progressSec = container.querySelector('.progressSec');
const songLists = container.querySelector('.songLists');
const moreSongsBtn = container.querySelector('#moreSongs');
const closeSongBtn = container.querySelector('#closeBtn');



let songIndex = 2;
let loopCount = 0;

function loadSong(indexNumber) {
  songName.innerText = musicInfo[indexNumber].songName;
  songArtist.innerText = musicInfo[indexNumber].artist;
  songImg.src = musicInfo[indexNumber].cover;
  currentAudio.src = musicInfo[indexNumber].src;
}

function playMusic() {
  container.classList.add('paused');
  playBtn.querySelector('i').classList.remove('bi-play-circle-fill');
  playBtn.querySelector('i').classList.add('bi-pause-circle-fill');
  currentAudio.play();
}

function pauseMusic() {
  container.classList.remove('paused');
  playBtn.querySelector('i').classList.remove('bi-pause-circle-fill');
  playBtn.querySelector('i').classList.add('bi-play-circle-fill');
  currentAudio.pause();
}

function forwardSong() {
  songIndex++;
  songIndex > musicInfo.length ? (songIndex = 1) : (songIndex = songIndex);
  loadSong(songIndex);
  playMusic();
}

function backwardSong() {
  songIndex--;
  songIndex < 1 ? (songIndex = musicInfo.length) : (songIndex = songIndex);
  loadSong(songIndex);
  playMusic();
}

loadSong(songIndex);

playBtn.addEventListener('click', () => {
  const isPaused = container.classList.contains('paused');
  isPaused ? pauseMusic() : playMusic();
});

forwardBtn.addEventListener('click', () => {
  forwardSong();
});

backwardBtn.addEventListener('click', () => {
  backwardSong();
});

repeatBtn.addEventListener('click', () => {
  loopCount++;

  if (loopCount === 1) {
    repeatBtn.innerHTML = '<span class="loop-number">1</span>';
    repeatBtn.setAttribute('title', 'Song looped');
  } else if (loopCount === 2) {
    repeatBtn.innerHTML = '';
    repeatBtn.classList.remove('bi-arrow-repeat');
    repeatBtn.classList.add('bi-shuffle');
    repeatBtn.setAttribute('title', 'Playback shuffled');
  } else if (loopCount === 3) {
    repeatBtn.innerHTML = '';
    repeatBtn.classList.remove('bi-shuffle');
    repeatBtn.classList.add('bi-arrow-repeat');
    repeatBtn.setAttribute('title', 'Repeat playlist');
    loopCount = 0;
  }
});

currentAudio.addEventListener('timeupdate', (e) => {
  const currentTime = e.target.currentTime;
  const songDuration = e.target.duration;

  if (isNaN(songDuration)) {
    return;
  }

  let progressDuration = (currentTime / songDuration) * 100;
  progressBar.style.width = `${progressDuration}%`;

  let songCurrentTime = container.querySelector('.currentTime');
  let songDurationElement = container.querySelector('.songDuration');

  let currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  let durationMinutes = Math.floor(songDuration / 60);
  let durationSeconds = Math.floor(songDuration % 60);

  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
}



if (durationSeconds < 10) {
  durationSeconds = `0${durationSeconds}`;
}

songCurrentTime.innerText = `${currentMinutes}:${currentSeconds}`;
songDurationElement.innerText = `${durationMinutes}:${durationSeconds}`;
});


currentAudio.addEventListener('ended', () => {
let gettingText = repeatBtn.innerHTML;

switch (gettingText) {
  case '<span class="loop-number">1</span>':
    currentAudio.currentTime = 0;
    loadSong(songIndex);
    playMusic();
    break;

  case '':
    let randIndex;
    do {
      randIndex = Math.floor(Math.random() * musicInfo.length);
    } while (songIndex === randIndex);

    songIndex = randIndex;
    loadSong(songIndex);
    playMusic();
    break;

  default:
    forwardSong();
}
});

progressSec.addEventListener('click', (e) => {
let progressReach = progressSec.clientWidth;
let clickOffSetX = e.offsetX;
let songDurationTime = currentAudio.duration;

currentAudio.currentTime = (clickOffSetX / progressReach) * songDurationTime;
playMusic();

// progressBar.style.background = `linear-gradient(to right, #ffcc00, #8fc8fd, transparent ${clickOffSetX}px)`;
});

currentAudio.addEventListener('loadeddata', () => {
let mainDuration = currentAudio.duration;

let totalMinutes = Math.floor(mainDuration / 60);
let totalSeconds = Math.floor(mainDuration % 60);

if (totalSeconds < 10) {
  totalSeconds = `0${totalSeconds}`;
}

currentAudio.innerText = `${totalMinutes}:${totalSeconds}`;
});



moreSongsBtn.addEventListener('click',() => {
  songLists.classList.toggle("show");
})


closeSongBtn.addEventListener('click',() => {
   moreSongsBtn.click();
})





const ul = songLists.querySelector('ul');

for (let i = 0; i < musicInfo.length; i++) {
  let li = `
    <li  li-index="${i}">
      <div class="row">
        <span>${musicInfo[i].songName}</span>
        <p>${musicInfo[i].artist}</p>
      </div>
      <audio class="${musicInfo[i].src}" src="${musicInfo[i].src}" data-index="${i}"></audio>
      <span class="songDuration" data-index="${i}">0:00</span>
    </li>
  `;

  ul.insertAdjacentHTML("beforeend", li);

  let liAudio = ul.querySelectorAll('audio')[i];
  let songTime = ul.querySelectorAll('.songDuration')[i];

  liAudio.addEventListener('canplaythrough', function() {
    let duration = this.duration;
    let totalMinutes = Math.floor(duration / 60);
    let totalSeconds = Math.floor(duration % 60);

    if (totalSeconds < 10) {
      totalSeconds = `0${totalSeconds}`;
    }
    document.querySelector(`.songDuration[data-index="${i}"]`).innerText = `${totalMinutes}:${totalSeconds}`;
  });

  liAudio.dispatchEvent(new Event('canplaythrough'));
}



const allLi = ul.querySelectorAll('li');
for(j=0; j<musicInfo.length;j++){

  if(allLi[j].getAttribute("li-index") == songIndex){
    allLi[j].classList.add("playing");

  }

  allLi[j].setAttribute('onclick', "clicked(this)");
}

function clicked(element){
  let getLi = element.getAttribute("li-index");
  songIndex = getLi;
  loadSong(songIndex);
  playMusic();
  
}


