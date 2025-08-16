console.log("Starting some Java Script");

let currentSong = new Audio();
let songs = [], musicSeq = [];

async function getSongs() {
    let data = await fetch("http://127.0.0.1:5500/ASSETS/SONGS/");
    let response = await data.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let names = div.getElementsByTagName("a");

    for (let name of names) {
        if (name.href.endsWith('.mp3'))
            songs.push(decodeURIComponent(name.href.split('/SONGS/')[1]));
    }
    return songs;
}

async function songsName() {
    songs = await getSongs();

    let arrMusicSeq = document.querySelectorAll("#first .card");
    findMusic(arrMusicSeq[0].dataset.musicName);

    for (let songSeq of arrMusicSeq) {
        let music = songs.filter(song => song.indexOf(songSeq.dataset.musicName) !== -1);
        musicSeq.push(music[0]);
    }

    progressLoad();
    let songElement = document.querySelectorAll("#first > .card");

    songElement.forEach(element => {
        element.addEventListener("click", (event) => {

            document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-play", "fa-circle-pause");
            let srcOfImage = element.childNodes[1].childNodes[1].src.split("/");
            setMusicCardInPlayBar(srcOfImage.at(-1));
            let musicDetail = element.innerText.split("\n\n");

            setMusicNameInPlayBar(musicDetail[0], musicDetail[1]);

            let musicName = element.dataset.musicName;
            findMusic(musicName);

            progressLoad();
        });
    });
}

songsName();

let findMusic = (musicName) => {
    for (let song of songs) {
        if (song.indexOf(musicName) != -1) {
            playMusic(song);
            break;
        }
    }
}

let progressLoad = () => {
    currentSong.ontimeupdate = () => {      //YAHA PR EVENT LISTENER BHI LGA SKTE HAI

        document.querySelector("#music-progress").value = currentSong.currentTime;
        timeDuration(document.querySelector("#dt"), currentSong.currentTime);

        if (currentSong.ended || currentSong.paused) {
            document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-pause", "fa-circle-play");
        } else if(currentSong.played){
            document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-play", "fa-circle-pause");
        }

    };

    currentSong.addEventListener("loadedmetadata", () => {

        timeDuration(document.querySelector("#tot"), currentSong.duration);
        document.querySelector("#music-progress").setAttribute("max", currentSong.duration);

    });
}

document.querySelectorAll(".card-container .next-song-button").forEach(element => {
    element.addEventListener("click", (event) => {
        let cardContainer = element.previousElementSibling;
        cardContainer.scroll({
            left: cardContainer.scrollLeft + 200,
            behavior: "smooth"
        });
    });
});

document.querySelectorAll(".card-container .previous-song-button").forEach(element => {
    element.addEventListener("click", (event) => {
        let cardContainer = element.nextElementSibling;
        cardContainer.scroll({
            left: cardContainer.scrollLeft - 200,
            behavior: "smooth"
        });
    });
});

document.querySelector("#music-progress").addEventListener("input", (event) => {
    currentSong.currentTime = event.target.value;
});

let play = document.querySelector(".player-controls > .play-icon");

play.addEventListener("click", () => {
    play.classList.toggle("fa-circle-pause");
    play.classList.toggle("fa-circle-play");
    if (currentSong.paused) {
        currentSong.play();
    }
    else {
        currentSong.pause();
    }
});

document.querySelector("#next-song").addEventListener("click", (event) => {
    let index = musicNextPrevious(event.target.id);
    let nameOfSong = musicSeq[(index + 1) % musicSeq.length];
    playMusic(nameOfSong);
});


document.querySelector("#previous-song").addEventListener("click", (event) => {
    let index = musicNextPrevious(event.target.id);
    let nameOfSong = musicSeq[(index - 1 + musicSeq.length) % musicSeq.length];
    playMusic(nameOfSong);
});

let musicNextPrevious = (btn) => {
    for (let element of document.querySelectorAll("#first .card")) {
        if ((currentSong.innerText.indexOf(element.dataset.musicName) != -1 && btn == "next-song")) {
            if (element.nextElementSibling == null) {
                setMusicCardInPlayBar(document.querySelector(".cards").firstElementChild.querySelector("img").src.split("/").at(-1));
                setMusicNameInPlayBar(document.querySelector(".cards").firstElementChild.querySelector("h4").innerText, document.querySelector(".cards").firstElementChild.querySelector("p").innerText);
            } else {
                console.log(element.nextElementSibling);
                setMusicCardInPlayBar(element.nextElementSibling.querySelector("img").src.split("/").at(-1));
                setMusicNameInPlayBar(element.nextElementSibling.querySelector("h4").innerText, element.nextElementSibling.querySelector("p").innerText);
            }
        }
        else if (currentSong.innerText.indexOf(element.dataset.musicName) != -1 && btn == "previous-song") {
            if (element.previousElementSibling == null) {
                setMusicCardInPlayBar(document.querySelector(".cards").lastElementChild.querySelector("img").src.split("/").at(-1));
                setMusicNameInPlayBar(document.querySelector(".cards").lastElementChild.querySelector("h4").innerText, document.querySelector(".cards").lastElementChild.querySelector("p").innerText);
            } else {
                setMusicCardInPlayBar(element.previousElementSibling.querySelector("img").src.split("/").at(-1));
                setMusicNameInPlayBar(element.previousElementSibling.querySelector("h4").innerText, element.previousElementSibling.querySelector("p").innerText);
            }
        }
    }
    for (let index = 0; index < musicSeq.length; index++) {
        if (currentSong.innerText == musicSeq[index])
            return index;
    }
}

function setMusicNameInPlayBar(songName, songCreator) {
    let creatorElement = document.querySelector("#music-creator");
    let musicElement = document.querySelector("#music-info > #music-title");
    musicElement.innerText = songName;
    creatorElement.innerText = songCreator;
}

function setMusicCardInPlayBar(src) {
    document.querySelector("#playing-card").setAttribute("src", `/ASSETS/PICTURES/${src}`);
}

function timeDuration(element, time) {
    let mins = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    element.innerText = `${mins.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function playMusic(songName) {
    currentSong.src = `/ASSETS/SONGS/${songName}`;
    currentSong.play();
    if (!currentSong.paused) {
        document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-play", "fa-circle-pause");
    }
    currentSong.innerText = songName;
}


document.querySelector("#volume").addEventListener("change", (event) => {
    currentSong.volume = parseFloat(event.target.value / 100);
});

let sidebar = document.querySelector("#bar");
let xMark = document.querySelector(".fa-xmark");

sidebar.addEventListener("click", sideBar);
xMark.addEventListener("click", sideBar);

function sideBar() {
    let sidebar = document.querySelector(".sidebar");
    if (this.classList.contains("fa-bars")) {
        this.classList.replace("fa-bars", "fa-xmark");
        sidebar.style.left = "1%";
    }
    else {
        this.classList.replace("fa-xmark", "fa-bars");
        sidebar.style.left = "-100%";
    }
}
