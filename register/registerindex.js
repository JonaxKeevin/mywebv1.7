document.addEventListener("DOMContentLoaded", function() {
    const KeyAuthApp = new KeyAuth(
        "ProjectsByCachorroMx", // Application Name
        "zAkYjehudN", // Owner ID
        "589d60597ec5e1165177569eb8d1f806c1f277b45fb7d31ec949d824a363bcd4", // Application Secret
        "1.0" // Application Version
    );

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Authenticate the user
        KeyAuthApp.login(username, password, function(response) {
            if (response.success) {
                // Redirect to the main page if authentication is successful
                window.location.href = 'main.html'; // Change 'main.html' to the URL of your main page
            } else {
                // Display an error message if authentication fails
                loginError.textContent = response.message;
            }
        });
    });
});
