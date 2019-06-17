// console log to see if the index.js has loaded correctly

console.log("index.js");

const navList = document.querySelector(".m-nav--list");
let navItem = document.querySelectorAll(".m-list--item");

for (let i = 0; i < navItem.length; i++) {
  navItem[i].addEventListener("click", function() {
    let current = document.getElementsByClassName(
      "m-list--item m-item--active"
    );
    current[0].className = current[0].className.replace(
      "m-list--item m-item--active",
      "m-list--item m-item--inactive"
    );
    this.className += "m-list--item m-item--active";
  });
}
