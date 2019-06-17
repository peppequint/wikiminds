// console log to see if the index.js has loaded correctly

console.log("index.js");

const navList = document.querySelector(".m-nav--list");

navList.addEventListener("click", function(event) {
  let navItem = document.querySelectorAll(".m-list--item");
  for (let i = 0; i < navItem.length; i++) {
    if (event.target.dataset.id === navItem[i].dataset.id) {
      if (event.target.className === "m-list--item m-item--inactive") {
        event.target.className = "m-list--item m-item--active";
      } else {
        event.target.className = "m-list--item m-item--inactive";
      }
    } else {
      navItem[i].className = "m-list--item m-item--inactive";
    }
  }
});
