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
                    "mouseCursorAcivity",
                    {
                        autoCreate: {
                            ephemeral: true
                        },
                        state: {
                            pointerCoord: {
                                cursorX: 0,
                                cursorY: 0
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
                let participants = this.activity.participants();
                participants.forEach((participant) => {
                    const local = participant.sessionId === this.activity.session().sessionId();
                    this.handleExistingParticipants(participant);
                    // const state = participant.state.get(POINTER_KEY);
                    // if (state) {
                    //   updateMouseLocation(participant.sessionId, state.x, state.y, local);
                    // }
                  });
            }
            )
            .catch(error => {
                console.error(error);
                this.success = false;
            });
            
    },

    initializePointer: function () {
    },

    handleExistingParticipants: function (participant) {
        const sessionId = participant.sessionId;
        const username = participant.user.displayName;
        let cursorDiv;

        if (!participant.local) {
                cursorDiv = document.createElement("div");
                $(cursorDiv).css({"width": "100px", "height": "100px", "border-radius": "50px", "background": "red"});
                $(cursorDiv).attr("id", "aadsfasfasfd");
            }


            // if (participant.state.has(POINTER_KEY)) {
            //     const pointer = participant.state.get(POINTER_KEY);
            //     updateMouseLocation(sessionId, pointer.x, pointer.y, participant.local);
            // }
    }
}



// const mmc = new MouseMovementController();
// mmc.init()