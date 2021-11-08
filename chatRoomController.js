const getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};

const ChatRoomController = function () {
    // @todo: How to handle users
    this.userName = "User" + getRandomInt(40);
    this.chat;
    this.success = true;
}

ChatRoomController.prototype = {
    init: function () {
        Convergence.connectAnonymously(DOMAIN_URL, this.userName)
            .then(domain => {
                this.domain = domain;
                console.log(this.userName);
                return this.domain.chat().create({
                    id: "radarChartChar",
                    type: "room",
                    membership: "public",
                    // @todo:  Might be a problem
                    ignoreExistsError: true
                });
            })
            // Return a Chat object here.
            .then(channelId => {
                return this.domain.chat().join(channelId);
            })
            .then(this.initializeChatRoomUI)
            .catch(error => {
                console.error(error);
                this.success = false;
                let sendButton = document.getElementById('sendButton');
                sendButton.addEventListener('click', () => {
                alert("Cannot connect to the server!");
                })
            });
    },

    initializeChatRoomUI: function (chatroom) {
        this.chat = chatroom;
        let chatBox = document.getElementById("messageHistory");
        this.chat.on(Convergence.ChatMessageEvent.NAME, (event) => {
            let username = event.user.displayName;
            let message = event.message;
            let timestamp = event.timestamp;
            chatBox.value = chatBox.value +
                `${username} at ${timestamp} sent: ${message}\n\n`;
        });

        // Print history in the chatbox
        this.chat.getHistory({
            limit: 10,
            eventFilter: [Convergence.ChatMessageEvent.NAME]
        }).then(history => {
            let chatHistory = history.data.slice().reverse();
            chatHistory.forEach(event => {
                let username = event.user.displayName;
                let message = event.message;
                let timestamp = event.timestamp;
                chatBox.value = chatBox.value +
                    `${username} at ${timestamp} sent: ${message}\n\n`;
            }
            )
        });

        let sendButton = document.getElementById('sendButton');
        sendButton.addEventListener('click', () => {
            console.log(10);
            let typeBox = document.getElementById('typeBox');
            let value = typeBox.value;
            if (value && value.trim()) {
                this.chat.send(value);
            };
            typeBox.value = "";
        });
    },
}

const crc = new ChatRoomController();
crc.init();