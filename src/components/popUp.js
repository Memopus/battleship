export default function PopUp(message = "Couldn't place Ship", time) {
  const root = document.querySelector("#root");
  const popup = document.createElement("div");
  const h2 = document.createElement("h2");
  const icon = document.createElement("i");

  icon.classList.add("fa-solid");
  icon.classList.add("fa-circle-xmark");
  popup.classList.add("popup");
  popup.classList.add("popup-animation");
  h2.textContent = message;

  popup.appendChild(icon);
  popup.appendChild(h2);

  root.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("show");
  }, 10);

  setTimeout(() => {
    popup.classList.add("hide");
  }, time);

  setTimeout(() => {
    popup.remove();
  }, time + 100);
}
