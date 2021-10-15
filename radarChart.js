// const { Chart } = require("chart.js");

const RealTimeController = function() {
  this.realtimeModel = 0;
  this.chart = 0;
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
          id: "BasicChart",
          data: initialData,
          ephemeral: true
        });
      }
    ).then(model => {
      // The first entry point to start the program. Initialize the chart/material here.
      this.realtimeModel = model;
      this.initializeUI();
      this.attachHandlerOnRemoteModel();
    })
  },

  initializeUI: function() {
    let data = this.realtimeModel.root().value();
    config.data = data;
    this.chart = new Chart(document.getElementById('myChart'), config);

    let labels = data.labels;
    for(let i = 0; i < labels.length; i ++) {
      let inputField = document.getElementById(labels[i]).querySelectorAll('input[type=text]')[0]
      inputField.value = data.datasets[0].data[i]
    };

    this.attachOnClickHandler(data.labels);
  },

  attachOnClickHandler: function (labels) {
    labels.forEach((label, index) => {
      let button = document.getElementById(label).getElementsByTagName('button')[0];
      button.addEventListener('click', () => {
        // Update the remote value, and associated handlers will be fired
        let newValue = this.realtimeModel.elementAt('datasets', 0, 'data', index).value() + 1;
        this.realtimeModel.elementAt('datasets', 0, 'data', index).value(newValue)

        let label = this.chart.data.labels[index];
        this.updateUI(label, newValue);
      });
    });
  },

  attachHandlerOnRemoteModel: function() {
    let labels = this.chart.data.labels;
    labels.forEach((label, index) => {
      this.realtimeModel.elementAt('datasets', 0, 'data', index).on(
        Convergence.RealTimeNumber.Events.VALUE, (e) => {
          // Fire away some handlers like changing the charts and text inputs
          this.updateUI(labels[index], e.element.value());
        });  
      });
  },

  updateUI: function(label, value) {
    let inputField = document.getElementById(label).querySelectorAll('input[type=text]')[0];
    inputField.value = value;

    let index = this.chart.data.labels.findIndex(e => e == label);
    this.chart.data.datasets[0].data[index] = value;
    this.chart.update();
  }
};

const initialData = {
  labels: ['A', 'B', 'C', 'D', 'E'],
  datasets: [{
    label: 'Testing Radar Chart',
    data: [26, 27, 33, 30, 32],
    backgroundColor: 'rgba(123, 175, 212, 0.5)'
  }]
};

let config = {
  type: 'radar',
  data: initialData,
  options: {
      elements: {
          point: {
              pointStyle: 'rectRounded'
          }
      },
      scale: {
        ticks: {
          beginAtZero: true
        }
      }
  },
};

const rtc = new RealTimeController();
rtc.init();