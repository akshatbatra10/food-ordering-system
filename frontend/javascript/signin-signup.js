const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector(".sign-up-form");
const signInForm = document.querySelector(".sign-in-form");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document
  .querySelector("#sign-up-button")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const name = signUpForm.username.value;
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;

    try {
      const response = await fetch("http://localhost:3000/users/registeruser", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      // const user = response.json();

      if (response.ok) {
        window.location = "http://localhost:3000/home.html";
      }
    } catch (err) {
      console.log(err);
    }
  });

signInForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = signInForm.email.value;
  const password = signInForm.password.value;

  try {
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const user = await response.json();
    window.localStorage.setItem('accesstoken', user.token);
    window.localStorage.setItem('refreshtoken', user.refreshToken);

    if (response.ok) {
      window.location = "http://localhost:3000/home.html";
    }
  } catch (err) {
    console.log(err);
  }
});
