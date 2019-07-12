let ul = document.getElementById("demo");
let menu = document.getElementById("dropMenu");
let search = document.getElementById("searchBox");
let modalContainer = document.getElementById("modal-con");
let modalContent = document.getElementById("modal");
let closeBtn = document.getElementById("closeModal");
let genCon = document.getElementById("genres_con");
let genList = document.getElementsByClassName("genre_li");
let pagination = document.getElementById("pagination");

let output = "";
let modal = "";
let pageOutPut = "";
let genre_output = "";

let li = document.getElementsByClassName("list-item");
let loader = document.getElementById("loader");

//Genre object
const Genre = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

//configs
let api_key = "e0a2e02905a8a197ce79913b80c65105";
let baseUrl = "https://api.themoviedb.org/3/";
let baseImageUrl = "https://image.tmdb.org/t/p/original";
let choices = menu.options[menu.selectedIndex].value;

//create genre buttons
Genre.forEach(el => {
  genre_output += `<li class="genre_li" data-id="${el.id}">${el.name}</li>`;
  genCon.innerHTML = genre_output;
});

//Create Movie cards - Movie card template
function createItems(poster, vote, id, title) {
  let imagePoster = `https://image.tmdb.org/t/p/original${poster}`;
  output += `<li class="list-item" data-attribute="${id}">
                <img src="${imagePoster}" alt="${title}" class="poster">
                <p class="vote">${vote}</p>
              </li>`;

  ul.innerHTML = output;
}

//Create Modal - Modal template
function createModal(poster, overview, title, runtime, genre, release, date) {
  let image = `${baseImageUrl}${poster}`;
  if (poster == null) {
    image =
      "https://www.themoviedb.org/assets/1/v4/logos/primary-green-d70eebe18a5eb5b166d5c1ef0796715b8d1a2cbc698f96d311d62f894ae87085.svg";
  }
  modal += `<img src="${image}" alt="${title}" class="modal_poster" />
    <ul class="modal_details">
        <li class="modal_li modal_header">${title}</li>
        <li class="modal_li"><strong>Genre</strong>: ${genre}</li>
        <li class="modal_li"><strong>Runtime</strong>: ${runtime} minutes</li>
        <li class="modal_li"><strong>Summary</strong>: ${overview}</li>
        <li class="modal_li"><strong>Status</strong>: ${release}</li>
        <li class="modal_li"><strong>Release Date</strong>: ${date}</li>
    </ul>`;
  modalContent.innerHTML = modal;
}

//Close modal
closeBtn.addEventListener("click", () => {
  modal = "";
  modalContent.innerHTML = "";
  modalContainer.style.transform = "scale(0)";
});
window.onload = () => {
  let uri = `${baseUrl}movie/${choices}?api_key=${api_key}&language=en-US&page=`;
  loadData(uri);
};
/* -------SEARCH BOX------- */
//search.addEventListener("keyup", searchMovie);
//function searchMovie(e) {
//  let text = e.target.value;
//  let uri;
//  if (text === "") {
//    uri = `${baseUrl}movie/${choices}?api_key=${api_key}&language=en-US&page=1&region=us`;
//    document.getElementById("page").value = 1;
//  } else {
//    uri = `${baseUrl}search/movie?api_key=${api_key}&language=en-US&query=${text}&page=1&include_adult=false`;
//    console.log(uri);
//    document.getElementById("page").value = 1;
//  }
//  output = "";
//  loadData(uri);
//}

//drop down menu
menu.addEventListener("change", e => {
  choices = e.target.value;
  //  document.getElementById("page").value = 1;
  //  search.value = "";
  let link = `${baseUrl}movie/${choices}?api_key=${api_key}&language=en-US&page=`;
  output = "";
  loadData(link);
});

//fetch data from API
let loadData = url => {
  let arr = [];
  let arr1 = new Array();
  for (let x = 1; x < 16; x++) {
    let uri = `${url}${x}`;
    arr.push(fetch(uri).then(res => res.json()));
  }
  Promise.all(arr).then(data => {
    data.forEach(res => {
      arr1.push(res.results);
    });
    let newArray = Array.prototype.concat.apply([], arr1);
    //pagination declaration --START
    let currentIndex = 0;
    let indexPerPage = 24;
    let pageCount = Math.ceil(newArray.length / indexPerPage);
    let newArr = newArray.slice(currentIndex, indexPerPage);
    //--END

    output = "";
    newArr.forEach(movie => {
      createItems(movie.poster_path, movie.vote_average, movie.id, movie.title);
      setTimeout(() => {
        for (let i = 0; i < li.length; i++) {
          li[i].classList.add("animate");
        }
      }, 300);
    });
    iterateListItem(li);

    //create pagination
    pageOutPut = "";
    createPagination(pageCount);

    //pagination event
    pageOnClick(newArray, indexPerPage);

    //add onclick event in genre buttons
    Array.from(genList).forEach(elem => {
      elem.addEventListener("click", e => {
        let x = parseInt(e.currentTarget.getAttribute("data-id"));

        //Filter data by genre
        let dataRes = newArray.filter(val => {
          return val.genre_ids.indexOf(x) !== -1;
        });
        let genreResSliced = dataRes.slice(currentIndex, indexPerPage);
        let pageCounter = Math.ceil(dataRes.length / indexPerPage);
        output = "";
        genreResSliced.forEach(movie => {
          createItems(movie.poster_path, movie.vote_average, movie.id);
          setTimeout(() => {
            for (let i = 0; i < li.length; i++) {
              li[i].classList.add("animate");
            }
          }, 100);
        });
        iterateListItem(li);

        //create pagination
        pageOutPut = "";
        createPagination(pageCounter);
        pageOnClick(dataRes, indexPerPage);
      });
    });
  });
};
//Add click event to each movie card and shows modal details when clicked
let iterateListItem = list => {
  Array.from(list).forEach(elem => {
    elem.addEventListener("click", e => {
      //grab movie id from data-attribute
      let movieID = e.currentTarget.getAttribute("data-attribute");
      //use grabbed movie id to the url
      let detailsUrl = `${baseUrl}movie/${movieID}?api_key=${api_key}&language=en-US`;

      //use url as parameter to call for details
      getDetails(detailsUrl);
      window.scrollTo(0, 0);
      //shows modal
      modalContainer.style.transform = "scale(1)";
    });
  });
};
//create Pagination
let createPagination = totalPage => {
  for (let x = 0; x < totalPage; x++) {
    pageOutPut += `<li class="pageNum" value="${x}">${x + 1}</li>`;
    pagination.innerHTML = pageOutPut;
  }
};
//pagination event
let pageOnClick = (arr, itemsPage) => {
  let page = document.querySelectorAll(".pageNum");
  console.log("qwe");
  //add initial active class to first page
  page[0].classList.add("active");
  page.forEach(elem => {
    elem.addEventListener("click", e => {
      window.scrollTo(0, 0);
      //remove active class to current active page then add active to target page
      let activePage = document.querySelector(".active");
      if (e.currentTarget.className === "pageNum active") {
        return;
      } else {
        activePage.classList.remove("active");
        e.currentTarget.classList.add("active");
      }

      //Pagination
      let current = e.currentTarget.value;
      let first = current * itemsPage;
      let last = first + itemsPage;
      let slicedArray = arr.slice(first, last);

      //create elements using sliced array
      output = "";
      slicedArray.forEach(movie => {
        createItems(movie.poster_path, movie.vote_average, movie.id);
        setTimeout(() => {
          for (let i = 0; i < li.length; i++) {
            li[i].classList.add("animate");
          }
        }, 100);
      });
      iterateListItem(li);
    });
  });
};

//load movie details to display in modal
let getDetails = url => {
  fetch(url)
    .then(res => {
      return res.json();
    })
    .then(data => {
      let genre = data.genres.map(genres => genres.name).join(", ");
      createModal(
        data.backdrop_path,
        data.overview,
        data.title,
        data.runtime,
        genre,
        data.status,
        data.release_date
      );
    });
};
