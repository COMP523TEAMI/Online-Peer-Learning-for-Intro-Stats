// const getRandomInt = function (max) {
//     return Math.floor(Math.random() * max);
// };

const MouseMovementController = function (username) {
    this.username = username;
    this.domain;
    this.activity;
    this.success = true;
}

MouseMovementController.prototype = {
    init: function () {
        Convergence.connectAnonymously(DOMAIN_URL, this.username)
            .then(domain => {
                this.domain = domain;
                return this.domain.activities().join(
                    "mouseCursors",
                    "mouseCursorAcivityDemo",
                    {
                        autoCreate: {
                            ephemeral: true
                        },
                        state: {
                            pointerCoord: {
                                cursorX: 10,
                                cursorY: 10
                            }
                        }
                }
                );
            })
            .then(activity => {
                this.activity = activity;
                let permissionManager = activity.permissions();
                if (!activity.participants.length) {
                    permissionManager.setWorldPermissions(["join", "view_state", "set_state", "manage", "lurk", "remove"]);
                }   
            })
            .then(() => {
                this.initializePointer();
                // local mousemove handler
                $(document).mousemove((event) => {
                    let coordinates = {cursorX: event.pageX, cursorY: event.pageY};
                    this.activity.setState('pointerCoord', coordinates);
                });

                // register remote participants mouse move and joining
                this.activity.events().subscribe((event) => {
                    switch (event.name) {
                        case Convergence.Activity.Events.SESSION_JOINED:
                            // console.log(event.participant.sessionId);
                            this.handleJoinedParticipants(event.participant);
                            break;
                        case Convergence.Activity.Events.SESSION_LEFT:
                            this.handleLeftParticipants(event.sessionId);
                            console.log(event);
                            break;
                        case Convergence.Activity.Events.STATE_SET:
                            let pointer = event.value;
                            this.updateRemoteMouseCursorOnScreen(event.sessionId, pointer.cursorX, 
                                pointer.cursorY);
                            break;
                        }
                })
            }
            )
            .catch(error => {
                console.error(error);
                this.success = false;
            });
            
    },

    initializePointer: function () {
        const participants = this.activity.participants();

        participants.forEach((participant) => {
            this.handleJoinedParticipants(participant);

            let state = participant.state.get("pointerCoord");
            if (state) {
                if(!participant.local) {
                    this.updateRemoteMouseCursorOnScreen(participant.sessionId, state.cursorX, state.cursorY);
                }
            }
        });
    },

    handleJoinedParticipants: function (participant) {
        const sessionId = participant.sessionId;
        const username = participant.user.displayName;
        let cursorDiv;

        if (!participant.local) {
                cursorDiv = $("<div></div>");
                $(cursorDiv).css({"width": "10px", "height": "10px", "border-radius": "50px", "background": "red", 
            "position": "absolute", "z-index": "10"});
                $(cursorDiv).attr("id", sessionId);
                $('body').append(cursorDiv);
            }
    },

    // Handleleftparticipants
    handleLeftParticipants: function (sessionId) {
        let cursorDiv = $(`#${sessionId}`);
        $(cursorDiv).remove();
    },

    updateRemoteMouseCursorOnScreen: function(sessionId, x, y) {
        let cursorDiv = $(`#${sessionId}`);
        $(cursorDiv).css({'top': y + "px", 'left': x + "px"}); 
    }
}



const mmc = new MouseMovementController();
mmc.init()