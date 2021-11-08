const RealTimeController = function() {
    this.realtimeModel = 0;
    this.success = true;
    this.localData = 0;
    this.initialFlag = true;
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
            id: "PepsiChallenge",
            data: initialData,
            ephemeral: true
          });
        }
      ).then(model => {
        // The first entry point to start the program. Initialize the chart/material here.
        this.realtimeModel = model;
        this.localData = model.root().value()
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
      let data = 0;
      if (this.success) {
        data = this.realtimeModel.root().value();
      } else {
        data = initialData;
        this.localData = data;
      }
      console.log(this.localData);
    // $(document).on('shiny:connected', () => {
    //     console.log(10);
    //     Shiny.setInputValue('acceptable', data.acceptable);
    //     // Shiny.setInputValue('sampsize', data.sampsize);
    //     Shiny.setInputValue('breaks', data.breaks);
    //     Shiny.setInputValue('prob', data.prob);
    // }
    // );
       
    },

    attachHandlerOnRShinyView: function() {
        // @todo what if there are no keys?
        // Reset values when opened a new window
        $(document).on('shiny:inputchanged', (event) => {
            let data = this.realtimeModel.root().value();
            // Somehow RShiny fires two events
            if (event.value == this.localData[event.name]) {
                return ;
            } else {
                console.log(event);
                console.log('[input] ' + event.name + ': ' + event.value);
                if (event.name == 'runonce' || event.name == "run100") {
                    console.log(this.localData);
                    this.localData[event.name] += 1;
                    this.realtimeModel.elementAt('input', event.name).value(this.localData[event.name]);
                }
                else {
                    this.localData[event.name] = event.value;
                    this.realtimeModel.elementAt('input', event.name).value(event.value);
                }
            }
         });
    },

    initialAttachHandlerOnRemoteModel: function() {
        this.attachHandlerOnRemoteModelProperty('input', 'acceptable');
        this.attachHandlerOnRemoteModelProperty('input', 'sampsize');
        this.attachHandlerOnRemoteModelProperty('input', 'prob');
        this.attachHandlerOnRemoteModelProperty('input', 'breaks');
        this.attachHandlerOnRemoteModelProperty('input', 'runonce');
        this.attachHandlerOnRemoteModelProperty('input', 'run100');
    },

    // reactivity: Input/Output
    attachHandlerOnRemoteModelProperty: function(reactivity, key) {
        if (key != "sampsize") {
            this.realtimeModel.elementAt(reactivity, key).on(
                Convergence.RealTimeNumber.Events.VALUE, (e) => {
                    this.localData[key] = e.element.value();
                    Shiny.setInputValue(key, e.element.value());
                }
            )
        } 

        else {
            this.realtimeModel.elementAt(reactivity, key).on(
                Convergence.RealTimeString.Events.VALUE, (e) => {
                    this.localData[key] = e.element.value();
                    Shiny.setInputValue(key, e.element.value());
                }
            )
        }
    }
} 
  // Four inputs from RShiny: acceptable, sampsize, prob, breaks
const initialData = {
    input: {
        acceptable: 30,
        sampsize: '1',
        prob: 40,
        breaks: 70,
        runonce: 0,
        run100: 0
    },
output: {

}
};
  
  
const rtc = new RealTimeController();
rtc.init()
// let data = initialData

//  $(document).on('shiny:inputchanged', function(event) {
    
//  });

//  $(document).on('shiny:inputchanged', function(event) {
//     Shiny.setInputValue('acceptable', data.acceptable);
//     Shiny.setInputValue('sampsize', data.sampsize);
//     Shiny.setInputValue('breaks', data.breaks);
//     Shiny.setInputValue('prob', data.prob);
//  })