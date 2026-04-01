const API = "https://christo.andrews-personal-account.workers.dev";

document.getElementById("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  await fetch(API, {
    method: "POST",
    body: JSON.stringify({ name, message })
  });

  alert("Your message has been submitted for approval ❤️");
});

