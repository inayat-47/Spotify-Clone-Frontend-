console.log("Starting some Java Script");

let currentSong = new Audio();
let songs = [];

async function getSongs() {
    let data = await fetch("http://127.0.0.1:5500/ASSETS/SONGS/");
    let response = await data.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let names = div.getElementsByTagName("a");

    for (let name of names) {
        if (name.href.endsWith('.mp3'))
            songs.push(name);
    }
    return songs;
}

async function songsName() {
    songs = await getSongs();

    playMusic((songs[0].title.slice(0, songs[0].title.length - 4)));
    progressLoad();
    let songElement = addSongInCard();

    songElement.forEach(element => {
        element.addEventListener("click", () => {
            document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-play", "fa-circle-pause");
            playMusic(element.innerText);
            setMusicNameInPlayBar(currentSong);
            setMusicCardInPlayBar(element.innerText);
            progressLoad();
        });
    });

}

let progressLoad = () => {
    currentSong.ontimeupdate = () => {      //YAHA PR EVENT LISTENER BHI LGA SKTE HAI

        document.querySelector("#music-progress").value = currentSong.currentTime;
        timeDuration(document.querySelector("#dt"), currentSong.currentTime);

        if (currentSong.ended) {
            document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-pause", "fa-circle-play");
        }

    };

    currentSong.addEventListener("loadedmetadata", () => {

        timeDuration(document.querySelector("#tot"), currentSong.duration);
        document.querySelector("#music-progress").setAttribute("max", currentSong.duration);

    });
}

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
    let i;
    for (i = 0; i < songs.length; i++) {
        if (songs[i].href == currentSong.src)
            break;
    }
    let nameOfSong = songs[(i + 1) % songs.length].title.replace(".mp3", "");
    playMusic(nameOfSong);
    setMusicCardInPlayBar(nameOfSong);
    setMusicNameInPlayBar(currentSong);
});


document.querySelector("#previous-song").addEventListener("click", (event) => {
    let i;
    for (i = 0; i < songs.length; i++) {
        if (songs[i].href == currentSong.src)
            break;
    }
    let nameOfSong = songs[(i - 1 + songs.length) % songs.length].title.replace(".mp3", "");
    playMusic(nameOfSong);
    setMusicCardInPlayBar(nameOfSong);
    setMusicNameInPlayBar(currentSong);
});

function setMusicNameInPlayBar(song) {
    let nameOfSong = song.src.split("/SONGS/")[1].replaceAll("%20", " ").replaceAll("%E2%80%90", "-");
    nameOfSong = nameOfSong.slice(0, nameOfSong.length - 4);
    document.querySelector("#music-title").innerText = nameOfSong;
    return nameOfSong;
}

function setMusicCardInPlayBar(songName) {
    let songPicture = ["Barbaad (From Saiyaara)/card2.jpeg", "Dhun (From Saiyaara)/card4.jpeg", "Humsafar (From Saiyaara)/card1.jpeg", "Saiyaara (From Saiyaara)/card.jpeg", "Saiyaara Reprise ‐ Female/card3.jpeg", "Tum Ho Toh (From Saiyaara)/card5.jpeg"];
    let index = songPicture.findIndex(item => item.startsWith(songName));
    document.querySelector("#playing-card").setAttribute("src", `/ASSETS/PICTURES/${songPicture[index].split('/')[1]}`);
}

function addSongInCard() {
    for (let song of songs) {
        let songName = document.createElement('p');
        songName.innerText = `${song.title.slice(0, song.title.length - 4)}`;
        songName.setAttribute("class", "second song cursor");
        document.querySelector("#songs").append(songName);
        songName.style.marginBottom = "0.75rem";
    }
    return document.querySelectorAll(".song");
}

function timeDuration(element, time) {
    let mins = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    element.innerText = `${mins.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function playMusic(songName) {
    currentSong.src = `/ASSETS/SONGS/${songName}.mp3`;
    currentSong.play();
    if (!currentSong.paused) {
        document.querySelector(".player-controls > .play-icon").classList.replace("fa-circle-play", "fa-circle-pause");
    }
    currentSong.innerText = songName;
}

songsName();

document.querySelector("#volume").addEventListener("change" , (event) => {
    currentSong.volume = parseFloat(event.target.value/100);
    console.log(parseFloat(event.target.value/100));
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
