async function loadMessages() {
  const password = document.getElementById("password").value;
  
  if (!password) {
    alert("Please enter a password");
    return;
  }

  // TODO: Implement password verification and message loading
  // This should call your worker with the password
  // and display unapproved messages for moderation
  
  alert("Admin functionality not yet implemented");
}
