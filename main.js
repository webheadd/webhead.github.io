window.onload = () => {
  var navMenu = document.querySelector("#nav");

  var navLinks = document.querySelectorAll(".nav__link");

  var sec_head = document.querySelectorAll(".section__header");
  var folio_li = document.querySelectorAll(".folio__li");
  var about_desc = document.querySelectorAll(".about__desc");
  var about_img = document.querySelectorAll(".about__img");
  var contact_form = document.querySelectorAll(".contact__animate");
  var arr = Array.from(navLinks);
  //animate when scrolled
  window.addEventListener("scroll", animate);
  var currentPosition = window.innerHeight / 1.2;

  function animate() {
    header();
    folio();
    aboutDesc();
    aboutImg();
    contact();
  }
  //animate section headers
  function header() {
    for (var i = 0; i < sec_head.length; i++) {
      var targetPosition = [];
      targetPosition[i] = sec_head[i].getBoundingClientRect().top;
      //console.log(targetPosition[0]);
      if (targetPosition[i] < currentPosition) {
        sec_head[i].classList.add("scroll");
      }
    }
  }
  //portfolio
  function folio() {
    for (var i = 0; i < folio_li.length; i++) {
      var targetPosition = [];
      targetPosition[i] = folio_li[i].getBoundingClientRect().top;
      //console.log(targetPosition[0]);
      if (targetPosition[i] < currentPosition) {
        folio_li[i].classList.add("scroll");
      }
    }
  }
  //about paragraphs
  function aboutDesc() {
    for (var i = 0; i < about_desc.length; i++) {
      var targetPosition = [];
      targetPosition[i] = about_desc[i].getBoundingClientRect().top;
      //console.log(targetPosition[0]);
      if (targetPosition[i] < currentPosition) {
        about_desc[i].classList.add("left");
      }
    }
  }
  //about img's
  function aboutImg() {
    for (var i = 0; i < about_img.length; i++) {
      var targetPosition = [];
      targetPosition[i] = about_img[i].getBoundingClientRect().top;
      //console.log(targetPosition[0]);
      if (targetPosition[i] < currentPosition) {
        about_img[i].classList.add("left");
      }
    }
  }
  //contact form
  function contact() {
    for (var i = 0; i < contact_form.length; i++) {
      var targetPosition = [];
      targetPosition[i] = contact_form[i].getBoundingClientRect().top;
      //console.log(targetPosition[0]);
      if (targetPosition[i] < currentPosition) {
        contact_form[i].classList.add("left");
      }
    }
  }
  arr.forEach(element => {
    element.addEventListener("click", e => {
      e.preventDefault();
      //get href value
      let linkValue = e.target.getAttribute("href");

      //grab href values to the dom as ids then scroll to it
      document.querySelector(linkValue).scrollIntoView({
        behavior: "smooth"
      });
      //close navMenu when anchor link is clicked
      if (navMenu.classList.contains("slide"))
        navMenu.classList.remove("slide");
    });
  });

  document.addEventListener("click", slideIn);

  //navigation slide in
  function slideIn(e) {
    if (e.target.id == "burger" || e.target.closest("#burger > span")) {
      navMenu.classList.add("slide");
    } else if (
      e.target.id == "closeBtn" ||
      e.target.closest("#closeBtn > span")
    ) {
      navMenu.classList.remove("slide");
    }
  }
};

console.log(document.getElementById("folio").clientWidth);
