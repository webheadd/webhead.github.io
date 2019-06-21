var openMenu = document.getElementById("menu-open");

var navPopup = document.getElementById("nav-bar");
var navLinks = document.getElementsByClassName("nav-link");

var navHeight = navPopup.clientHeight;

var isOpen = true;


/* set nav-bar height to 0 as default*/
navPopup.style.height = "0";
isOpen = false;





//event click in anchor tags in nav-bar
for(var i = 0; i < navLinks.length; i ++) {
  navLinks[i].addEventListener('click', function(e){

    //prevent the default function of anchor links
    e.preventDefault();

    //get the href attribute of the clicked anchor link then scroll to it
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
}


window.addEventListener('click', menuClose);
//close menu-bar if clicked outside and if clic
function menuClose(e) {
  //if menu-bar is open, close it
  if(isOpen) {
      navPopup.style.height = "0";
      isOpen = false;
  } else {
    //if closed, open it if clicked ONLY inside burger icon
    if (e.target.id == "menu-open" || e.target.closest("span")) {
      navPopup.style.height = navHeight + "px";
      isOpen = true;
    }
  }
}
