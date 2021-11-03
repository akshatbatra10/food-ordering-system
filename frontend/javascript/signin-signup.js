const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector(".sign-up-form");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

console.log(document.querySelector("#sign-up-button"));

document
  .querySelector("#sign-up-button")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const name = signUpForm.username.value;
    const email = signUpForm.email.value;
    const password = signUpForm.password;

    try {
      const response = await fetch("http://localhost:3000/users/registeruser", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log(err);
    }
  });
