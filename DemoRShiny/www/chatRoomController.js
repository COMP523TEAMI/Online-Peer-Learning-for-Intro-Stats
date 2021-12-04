const getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
};

const ChatRoomController = function () {
    this.username = "User " + getRandomInt(100);
    this.chat;
    this.success = true;
}

ChatRoomController.prototype = {
    init: function () {
        // console.log(username);
        Convergence.connectAnonymously(DOMAIN_URL, this.username)
            .then(domain => {
                this.domain = domain;
                return this.domain.chat().create({
                    id: "chatroomNormal",
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
        // Link Bulma here
        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css'));
        let bottomOfDom = $('body').last();
        $(`<div style="position: absolute; bottom: 0; right: 0; background-color: rgba(236, 236, 236, 0.5);">
        <h4 id=chatEntry class="title is-4"> Chat </h4>
        <div id = chatDiv>
        <div><textarea id="messageHistory" disabled="disabled"></textarea></div>
        <div><input type="text" id="typeBox"></div>
        <div><button type="button" id="sendButton" class="button is-primary">Send</button></div>
        </div>
        </div>`).insertAfter(bottomOfDom);

        let chatBox = $("#messageHistory");
        this.chat.on(Convergence.ChatMessageEvent.NAME, (event) => {
            let username = event.user.displayName;
            let message = event.message;
            let timestamp = event.timestamp;
            chatBox.val(chatBox.val() +
                `${username} at ${timestamp} sent: ${message}\n\n`);
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


        $('#sendButton').on('click', () => {
            let typeBox = document.getElementById('typeBox');
            let value = typeBox.value;
            if (value && value.trim()) {
                this.chat.send(value);
            };
            typeBox.value = "";
        });

        $("#chatEntry").on('click', () => {
            $("#chatDiv").fadeToggle("fast");
        })
    },
}
