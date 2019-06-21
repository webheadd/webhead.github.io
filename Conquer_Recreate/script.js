var openMenu = document.getElementById("menu-open");
var closeMenu = document.getElementById("menu-close");

var popMenu = document.getElementsByTagName("nav");

var navBtns = document.querySelectorAll('a[href^="#"]');

var upBtn = document.getElementById("up-btn");
/* NAVIGATION */
for(var i = 0; i < navBtns.length; i++){
    navBtns[i].addEventListener('click', function(e) {
        e.preventDefault();
        
        //get href value of clicked button/anchor then add smooth scroll effect
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
}

// show up button
window.onscroll = function(){
    var currentScrollPos = window.pageYOffset;
    if(currentScrollPos  >= 400){
        upBtn.style.display = "block";
    }else {
        upBtn.style.display = "none";
    }
};

/* END OF NAVIGATION */

/* POPUP MENU */
/* click event in document */
document.addEventListener('click', function(e){
    var x = e.target;
    /* add active class when #menu-open is clicked --- Open Menu */
    if(x.id == "menu-open" || x.closest("span")){
    
        popMenu[0].classList.add("active");
     /* remove active class when #menu-close is clicked --- Close Menu*/
    } else if (x.closest("nav > div > ul > li")){
    
        popMenu[0].classList.remove("active");
     /* do nothing if clicked inside the #menu div */
    }else if(x.closest("nav")){
    
        return;
     /* remove active class when clicked anywhere except #menu-open --- Close Menu */
    } else {
    
        popMenu[0].classList.remove("active");
        
    }
});
/* END OF POPUP MENU */
