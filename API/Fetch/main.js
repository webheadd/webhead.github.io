let ul = document.getElementById("demo");
let menu = document.getElementById("dropMenu");
let search = document.getElementById("searchBox");
let prevBtn = document.getElementById("left");
let nextBtn = document.getElementById("right");
let modalContainer = document.getElementById("modal-con");
let modalContent = document.getElementById("modal");
let closeBtn = document.getElementById("closeModal");

let output = "";
let modal = "";
let choice = menu.options[menu.selectedIndex].value;

let li = document.getElementsByClassName("list-item");

//configs
let api_key = "e0a2e02905a8a197ce79913b80c65105";
let baseUrl = "https://api.themoviedb.org/3/";
let baseImageUrl = "https://image.tmdb.org/t/p/w500";
//Creat movie class
class Movie {
  constructor(poster, vote, id) {
    this.poster = poster;
    this.vote = vote;
    this.id = id;
  }

  createItems() {
    let imagePoster = `https://image.tmdb.org/t/p/original${this.poster}`;
    output += `<li class="list-item" data-attribute="${this.id}">
                <img src="${imagePoster}" alt="image" class="poster">
                <p class="vote">${this.vote}</p>
              </li>`;

    ul.innerHTML = output;
  }
}
//Create modal class
class Modal {
  constructor(poster, overview, title, runtime, genre) {
    this.poster = poster;
    this.overview = overview;
    this.title = title;
    this.runtime = runtime;
    this.genre = genre;
  }

  createModal() {
    let image = `${baseImageUrl}${this.poster}`;

    modal += `<img src=${image} alt="image" class="modal_poster" />
            <ul class="modal_details">
              <li class="modal_li modal_header">${this.title}</li>
              <li class="modal_li"><strong>Genre</strong>: ${this.genre}</li>
              <li class="modal_li"><strong>Runtime</strong>: ${
                this.runtime
              } minutes</li>
              <li class="modal_li"><strong>Summary</strong>: ${
                this.overview
              }</li>
            </ul>`;
    modalContent.innerHTML = modal;
  }
}
//Close modal

closeBtn.addEventListener("click", () => {
  modal = "";
  modalContent.innerHTML = "";
  modalContainer.style.transform = "scale(0)";
});
window.onload = () => {
  let uri = `${baseUrl}movie/${choice}?api_key=${api_key}&language=en-US&page=1`;
  output = "";
  loadData(uri);
};
/* -------SEARCH BOX------- */
search.addEventListener("keyup", searchMovie);
function searchMovie(e) {
  let text = e.target.value;
  let uri;
  if (text === "") {
    uri = `${baseUrl}movie/${choice}?api_key=${api_key}&language=en-US&page=1&region=us`;
    document.getElementById("page").value = 1;
  } else {
    uri = `${baseUrl}search/movie?api_key=${api_key}&language=en-US&query=${text}&page=1&include_adult=false`;
    console.log(uri);
    document.getElementById("page").value = 1;
  }
  output = "";
  loadData(uri);
}
//drop down menu
menu.addEventListener("change", e => {
  choice = e.target.value;
  document.getElementById("page").value = 1;
  search.value = "";
  let uri = `${baseUrl}movie/${choice}?api_key=${api_key}&language=en-US&page=1`;
  output = "";
  loadData(uri);
});

/* -------PAGE NAVIGATION------- */
//next page
nextBtn.addEventListener("click", () => {
  let page = document.getElementById("page").value;
  page++;
  document.getElementById("page").value = page;
  checkIf(page);
});
//previous page
prevBtn.addEventListener("click", () => {
  let page = document.getElementById("page").value;
  page--;

  if (page < 1) page = 1;
  document.getElementById("page").value = page;
  checkIf(page);
});
//check pagination
function checkIf(page) {
  let searched = search.value;
  let uri;
  console.log(choice);
  if (searched === "") {
    uri = `${baseUrl}movie/${choice}?api_key=${api_key}&language=en-US&page=${page}&region=us`;
  } else {
    uri = `${baseUrl}search/movie?api_key=${api_key}&language=en-US&query=${searched}&page=${page}&include_adult=false`;
  }
  output = "";
  loadData(uri);
}
//fetch data from API
function loadData(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      data.results.forEach(movie => {
        const movies = new Movie(
          movie.poster_path,
          movie.vote_average,
          movie.id
        );
        movies.createItems();
        //createItems(movie.poster_path, movie.vote_average, movie.id);
      });

      Array.from(li).forEach(elem => {
        elem.addEventListener("click", e => {
          var movieID = e.currentTarget.getAttribute("data-attribute");
          console.log(movieID);
          let detailsUrl = `${baseUrl}movie/${movieID}?api_key=${api_key}&language=en-US`;
          getDetails(detailsUrl);
          modalContainer.style.transform = "scale(1)";
        });
      });
    })
    .catch(err => console.log(err));
}

//load movie details to display in modal
function getDetails(url) {
  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      let genre = data.genres.map(genres => genres.name).join(", ");
      const mod = new Modal(
        data.poster_path,
        data.overview,
        data.title,
        data.runtime,
        genre
      );
      mod.createModal();
    });
}
