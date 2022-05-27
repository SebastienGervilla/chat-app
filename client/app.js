function AppSetup() {
    const app = document.querySelector(".app");
    const socket = io('http://localhost:3000');

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", () => {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove('active');
        app.querySelector(".chat-screen").classList.add('active');
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", () => {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return
        }

        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-button").addEventListener("click", () => {
        socket.emit("exituser", uname)
        window.location.href = window.location.href;
    });

    socket.on("update", (update) => {
        renderMessage("update", update);
    });
    socket.on("chat", (message) => {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <img src="assets/icons/profile.png" alt="Profile icon">
                <div class="message-info">
                    <h3>You</h3>
                    <p>${message.text}</p>
                </div>
            `;
            messageContainer.append(el);
        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <img src="assets/icons/profile.png" alt="Profile icon">
                <div class="message-info">
                    <h3>${message.username}</h3>
                    <p>${message.text}</p>
                </div>
            `;
            messageContainer.append(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerHTML = `<p>${message}</p>`;
            messageContainer.append(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
};

AppSetup();