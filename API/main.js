let ul = document.getElementById("demo");
let typeBtn = document.querySelectorAll(".typeBtn");
let search = document.getElementById("searchBox");
let searchBtn = document.getElementById("searchBtn");
let modalContainer = document.getElementById("modal-con");
let modalContent = document.getElementById("modal");
let closeBtn = document.getElementById("closeModal");
let pagination = document.getElementById("pagination");
let carouselCon = document.getElementById("carousel__con");
let carouselItem = document.getElementsByClassName("carousel__item");
let navBar = document.getElementById("navbar");
let renderTitle = document.getElementById("renderTitle");
let genCon = document.getElementById("genres_con");

let output = "";
let modal = "";
let pageOutPut = "";
let genre_output = "";
let carousel = "";
let slideIndex = 0;
let myTimer = 5000;
let loading = true;

let li = document.getElementsByClassName("list-item");

//Genre object
const Genre = [
  { id: 0, name: "Show All" },
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
let choices = document.querySelector(".actv").getAttribute("data-attribute");

//Movie choices - Popular, Top Rated or Now Showing
typeBtn.forEach(el => {
  el.addEventListener("click", e => {
    //if not equals to true execute then make it true then wait to finish and make it false again
    //prevents to fire 2 times. This waits until the loading is done before firing another
    if (!loading) {
      loading = true;
      let activeType = document.querySelector(".actv");
      //remove and add active class to - Movie choice (Popular, top rated, now showing)
      activeType.classList.remove("actv");
      e.target.classList.add("actv");

      switch (e.target.innerHTML) {
        case "Popular":
          renderTitle.innerHTML = "Popular Movies";
          choices = "popular";
          break;
        case "Top Rated":
          renderTitle.innerHTML = "Top Rated";
          choices = "top_rated";
          break;
        case "Now Showing":
          renderTitle.innerHTML = "Now Showing";
          choices = "now_playing";
          break;
      }
      search.value = "";
      let link = `${baseUrl}movie/${choices}?api_key=${api_key}&language=en-US&page=`;
      output = "";
      //   ul.innerHTML = "";
      loadData(link);
      genCon.selectedIndex = "0";
    }
  });
});

//navbar
let navHeight = navBar.clientHeight;
let prevSet = 0;
window.onscroll = () => {
  let currentOffset = document.body.getBoundingClientRect().top;
  currentOffset < prevSet
    ? navBar.classList.add("navActive")
    : navBar.classList.remove("navActive");
  prevSet = currentOffset;
};

//create genre buttons
Genre.forEach(el => {
  genre_output += `<option value="${el.id}">${el.name}</option>`;
  genCon.innerHTML = genre_output;
});

//Create Movie cards - Movie card template
const createItems = (poster, vote, id, title) => {
  let imagePoster = `https://image.tmdb.org/t/p/w300${poster}`;
  if (poster == null) {
    imagePoster =
      "https://www.themoviedb.org/assets/1/v4/logos/primary-green-d70eebe18a5eb5b166d5c1ef0796715b8d1a2cbc698f96d311d62f894ae87085.svg";
  }
  output += `<li class="list-item" data-attribute="${id}" style="background: linear-gradient(
                rgba(0, 0, 0, 0) 4%,
                rgba(0, 0, 0, 0) 50%,
                rgba(0, 0, 0, 1) 100%
              ), url(${imagePoster})">
                <p class="vote">${vote}</p>
                <p class="movie__title">${title}</p>
              </li>`;

  ul.innerHTML = output;
};

//Create Modal - Modal template
const createModal = (
  poster,
  overview,
  title,
  runtime,
  genre,
  release,
  date
) => {
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
};

//Close modal
closeBtn.addEventListener("click", () => {
  modal = "";
  modalContent.innerHTML = "";
  modalContainer.style.display = "none";
});
window.onload = () => {
  let uri = `${baseUrl}movie/${choices}?api_key=${api_key}&language=en-US&page=`;
  loadData(uri);
  loadCarousel();
};
/* -------SEARCH FUNCTION------- */
const searchMovie = () => {
  let text = search.value;
  let uri = `${baseUrl}search/movie?api_key=${api_key}&language=en-US&query=${text}&page=`;
  if (text === "") return;
  output = "";
  loadData(uri);
  search.value = "";
  genCon.selectedIndex = "0";
};

searchBtn.addEventListener("click", searchMovie);

//trigger search if hit enter
search.addEventListener("keydown", e => {
  if (e.keyCode === 13) searchBtn.click();
});

//fetch data from API
const loadData = url => {
  pagination.innerHTML = "";
  ul.innerHTML = `<li id="loader"></li>`;
  let arr = [];
  let arr1 = new Array();
  for (let x = 1; x < 11; x++) {
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
    let indexPerPage = 20;
    let pageCount = Math.ceil(newArray.length / indexPerPage);
    let newArr = newArray.slice(currentIndex, indexPerPage);
    //--END

    //HTML OUTPUT
    setTimeout(() => {
      ul.innerHTML = "";
      newArr.forEach(movie => {
        createItems(
          movie.poster_path,
          movie.vote_average,
          movie.id,
          movie.title
        );
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
      loading = false;
    }, 1000);

    //add onclick event in genre buttons
    genCon.addEventListener("change", e => {
      let x = parseInt(e.target.value);
      if (x === 0) {
        output = "";
        newArr.forEach(movie => {
          createItems(
            movie.poster_path,
            movie.vote_average,
            movie.id,
            movie.title
          );
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
      }
      //Filter data by genre
      let dataRes = newArray.filter(val => {
        return val.genre_ids.indexOf(x) !== -1;
      });
      let genreResSliced = dataRes.slice(currentIndex, indexPerPage);
      let pageCounter = Math.ceil(dataRes.length / indexPerPage);
      output = "";
      genreResSliced.forEach(movie => {
        createItems(
          movie.poster_path,
          movie.vote_average,
          movie.id,
          movie.title
        );
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

      //close Genre list
    });
  });
};
//load Carousel images
const loadCarousel = () => {
  const url = `${baseUrl}movie/popular?api_key=${api_key}&language=en-US&page=1`;
  fetch(url)
    .then(data => {
      return data.json();
    })
    .then(result => {
      //get backdrop path
      const carouselImages = result.results.map(el => {
        return el.backdrop_path;
      });
      //get title
      const carouselTitle = result.results.map(el => {
        return el.title;
      });

      //creater carousel
      getCarouselImg(carouselImages, carouselTitle);

      //position carousel items on side of each other
      for (let i = 0; i < carouselItem.length; i++) {
        carouselItem[i].style.left = i * 100 + "%";
      }

      //animate carousel slides
      carouselSlide();
    });
  // CAROUSEL
};

//Create Carousel

const getCarouselImg = (backdrop, title) => {
  for (let i = 0; i < 5; i++) {
    // let randomizer = Math.floor(Math.random() * backdrop.length);
    let image = `${baseImageUrl}${backdrop[i]}`;
    if (backdrop[i] === null) image = `/images/moviedb.jpg`;
    carousel += `<li class="carousel__item" style="background: linear-gradient(
                  rgba(0, 0, 0, 0) 4%,
                  rgba(0, 0, 0, 0) 30%,
                  rgba(0, 0, 0, 0.9) 100%
                ), url('${image}');">
                      <p class='carousel__header'>${title[i]}</p>
                  </li>`;

    carouselCon.innerHTML = carousel;
  }
};

//auto slide carousel
const carouselSlide = () => {
  // let width = carouselItem[0].clientWidth;
  setInterval(() => {
    slideIndex++;
    if (slideIndex > carouselItem.length - 1) slideIndex = 0;
    let total = slideIndex * 100;
    carouselCon.style.transform = `translateX(-${total}%)`;
  }, myTimer);
};

//Add click event to each movie card and shows modal details when clicked
const iterateListItem = list => {
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
      modalContainer.style.display = "block";
    });
  });
};
//create Pagination
const createPagination = totalPage => {
  for (let x = 0; x < totalPage; x++) {
    pageOutPut += `<li class="pageNum" value="${x}">${x + 1}</li>`;
    pagination.innerHTML = pageOutPut;
  }
};
//pagination event
const pageOnClick = (arr, itemsPage) => {
  let page = document.querySelectorAll(".pageNum");
  //add initial active class to first page
  page[0].classList.add("active");
  page.forEach(elem => {
    elem.addEventListener("click", e => {
      window.scrollTo(0, document.getElementById("renderTitle").offsetTop * 3);
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
        createItems(
          movie.poster_path,
          movie.vote_average,
          movie.id,
          movie.title
        );
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
const getDetails = url => {
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
