var searchBox = document.querySelector("#search");
var ul = document.querySelector("#demo");
var paginate = document.querySelector(".pagination");
var prevBtn = document.getElementById("left");
var nextBtn = document.getElementById("right");
var modalContainer = document.querySelector(".modal");
var container = document.querySelector(".container");
var closeModal = document.querySelector("#closeModal");

var arrayText = [];
var html = "";
var li = document.getElementsByClassName("list-item");
var listTitle = document.getElementsByClassName("title");
var modal = "";

//configs
var api_key = "e0a2e02905a8a197ce79913b80c65105";

var url = "https://api.themoviedb.org/3/";

document.addEventListener("DOMContentLoaded", () => {
  const uri = `${url}movie/popular?api_key=${api_key}&language=en-US&page=1&region=us`;
  load(uri);
});

//next page
nextBtn.addEventListener("click", function() {
  let page = document.getElementById("page").value;
  page++;
  document.getElementById("page").value = page;
  checkIf(page);
});
//previous page
prevBtn.addEventListener("click", function() {
  let page = document.getElementById("page").value;
  page--;

  if (page < 1) page = 1;
  document.getElementById("page").value = page;
  checkIf(page);
});
//check pagination
function checkIf(page) {
  var searched = searchBox.value;
  var imageUrl;
  if (searched === "") {
    imageUrl = `${url}movie/popular?api_key=${api_key}&language=en-US&page=${page}&region=us`;
  } else {
    imageUrl = `${url}search/movie?api_key=${api_key}&language=en-US&query=${searched}&page=${page}&include_adult=false`;
  }
  html = "";
  load(imageUrl);
  console.log(page);
}
//movie details

//load request
var load = queryUrl => {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var text = JSON.parse(xhr.responseText);
      arrayText.push(text.results);

      text.results.forEach(result => {
        creatItems(result.poster_path, result.vote_average, result.id);
      });
      Array.from(li).forEach(list => {
        list.addEventListener("click", function() {
          container.style.transform = "scale(1)";
          var movieID = this.getAttribute("data-attribute");
          var detailsUrl = `${url}movie/${movieID}?api_key=${api_key}&language=en-US`;

          loadDetails(detailsUrl);
        });
      });
    }
  };
  xhr.open("GET", queryUrl, true);
  xhr.send();
};
//Close Modal
closeModal.addEventListener("click", () => {
  container.style.transform = "scale(0)";
});

//get movie infos
var loadDetails = queryUrl => {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var text = JSON.parse(xhr.responseText);
      console.log(text.genres);

      var movieGenres = text.genres;
      var genreNames = movieGenres
        .map(genre => genre.name)
        .sort()
        .join(", ");
      modal = "";
      createModal(
        text.poster_path,
        text.overview,
        text.title,
        text.runtime,
        genreNames
      );
    }
  };
  xhr.open("GET", queryUrl, true);
  xhr.send();
};
//creater modal details
var createModal = (backdrop, overview, title, runtime, genre) => {
  var backDropImg = `https://image.tmdb.org/t/p/original${backdrop}`;
  modal += `<img src=${backDropImg} alt="image" class="modal_poster" />
            <ul class="modal_details">
              <li class="modal_li modal_header">${title}</li>
              <li class="modal_li"><strong>Genre</strong>: ${genre}</li>
              <li class="modal_li"><strong>Runtime</strong>: ${runtime} minutes</li>
              <li class="modal_li"><strong>Summary</strong>: ${overview}</li>
            </ul>`;

  modalContainer.innerHTML = modal;
};

searchBox.addEventListener("keyup", searchMovie);
//search function
var toUrl;
function searchMovie(e) {
  var text = e.target.value;

  if (text === "") {
    toUrl = `${url}movie/popular?api_key=${api_key}&language=en-US&page=1&region=us`;
    document.getElementById("page").value = 1;
  } else {
    toUrl = `${url}search/movie?api_key=${api_key}&language=en-US&query=${text}&page=1&include_adult=false`;
    console.log(toUrl);
    document.getElementById("page").value = 1;
  }
  html = "";
  arrayText = [];
  load(toUrl);
}

//create HTML items
var creatItems = (poster, voteCount, id) => {
  var imagePoster = `https://image.tmdb.org/t/p/original${poster}`;
  html += `<li class="list-item" data-attribute="${id}">
            <img src="${imagePoster}" alt="image" class="poster">
           <p class="vote">${voteCount}</p>
           </li>`;

  ul.innerHTML = html;
};
