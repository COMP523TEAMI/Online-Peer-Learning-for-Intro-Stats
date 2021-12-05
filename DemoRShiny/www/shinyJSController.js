const RealTimeController = function() {
    this.realtimeModel = 0;
    this.success = true;
    this.localData = 0;
    this.chatRoomController;
  };
  
RealTimeController.prototype = {
    init: function() {
      /* 
      * About Autocreate: create if not existing
      * @todo investigate ephemeral
      */
      Convergence.connectAnonymously(DOMAIN_URL).then(domain => {
          return domain.models().openAutoCreate({
            collection: "realTimeMaterial",
            id: "NormalDistribution",
            data: initialData,
            ephemeral: true
          });
        }
      ).then(model => {
        // The first entry point to start the program. Initialize the chart/material here.
        this.realtimeModel = model;
        this.localData = model.root().value();
        this.initializeUI();
        this.initialAttachHandlerOnRemoteModel();
        this.attachHandlerOnRShinyView();
      }).catch(error => 
        {
          alert('Cannot connect to Convergence Backend!');
          this.success=false;
          console.error(error);
        }
        )
    },
  
    initializeUI: function() {
      Shiny.setInputValue('acceptable', this.localData['acceptable']);
      Shiny.setInputValue('sampsize', this.localData['sampsize']);
      Shiny.setInputValue('prob', this.localData['prob']);
      Shiny.setInputValue('breaks', this.localData['breaks']);
      // launch chatServices
      this.chatRoomController = new ChatRoomController();
      this.chatRoomController.init();
    },

    attachHandlerOnRShinyView: function() {
        // @todo what if there are no keys?
        $(document).on('shiny:inputchanged', (event) => {
            let data = this.realtimeModel.root().value();
            // Somehow RShiny fires two events
            if (event.value == this.localData[event.name]) {
                return ;
            } else {
                if (event.name == "plotButton") {
                    this.localData.input[event.name] += 1;
                    this.realtimeModel.elementAt('input', event.name).value(this.localData.input[event.name]);
                }
                else {
                    this.localData[event.name] = event.value;
                    this.realtimeModel.elementAt('input', event.name).value(event.value);
                }
            }
         });
    },

    initialAttachHandlerOnRemoteModel: function() {
        this.attachHandlerOnRemoteModelProperty('input', 'mean');
        this.attachHandlerOnRemoteModelProperty('input', 'sd');
        this.attachHandlerOnRemoteModelProperty('input', 'plotButton')
    },

    // reactivity: Input
    attachHandlerOnRemoteModelProperty: function(reactivity, key) {
        this.realtimeModel.elementAt(reactivity, key).on(
            Convergence.RealTimeString.Events.VALUE, (e) => {
                this.localData[key] = e.element.value();
                Shiny.setInputValue(key, e.element.value());
            }
        )
        
    }
} 
  // Four inputs from RShiny: acceptable, sampsize, prob, breaks
const initialData = {
    input: {
        mean: 0,
        sd: 0,
        plotButton: 1 
    },
};
  
const rtc = new RealTimeController();
rtc.init();