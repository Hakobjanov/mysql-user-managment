import Toaster from "../Toaster/Toaster.js";

const name = "Name is required.";
const login = "Login is required.";

//Toaster
const toaster1 = new Toaster({
  side: "bottom-left",
  // from: 'bottom',
  // to: 'right',
  life: 5,
  limit: 10,
  width: 100,
  gap: 4,
  // push: false,
});

const timer1 = setInterval(() => toaster1.log(name), 700);

setTimeout(clearInterval, 5000, timer1);

window.Toaster = Toaster;
