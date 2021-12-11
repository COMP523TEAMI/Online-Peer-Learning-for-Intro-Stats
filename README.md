# Online-Peer-Learning-for-Intro-Stats
We developed an online collaborative learning platform for intro-stat learning materials. The current web link to our project is [here](https://teami-staging.herokuapp.com/). Here is a demo of the collaborative features:

[![Watch the video](https://img.youtube.com/vi/nA0G0yPhDTk/maxresdefault.jpg)](https://youtu.be/nA0G0yPhDTk)

Our project has 3 main pieces deployed at different places:

The frontend and the backend of our project are deployed through Heroku. The frontend provides a full web experience, developed with React. The backend hosts a database for user information, using MongoDB technology. The repo for the frontend and the backend is [here](https://github.com/qiaosenlin/staging-demo-i). 

The Convergence Docker server, which enables a Google Doc-like online collaboration between students playing the intro-stat learning materials, is deployed through an AWS EC2 instance.

The R-shiny apps that constitute the learning materials are deployed through a third-party cloud R server, [shinyapps.io](https://www.shinyapps.io/). Users can deploy the R-shiny apps by clicking the “Publish” button in their R Studio.

## About the online collaboration
### Overview
Currently, our collaboration features include sharing input data across clients, a chat function, and sharing mouse cursors across clients. Three JS files enable these features respectively: [shinyJSController.js](/DemoRShiny/www/shinyJSController.js), [chatRoomController.js](/DemoRShiny/www/chatRoomController.js), and [mouseMovementController.js](/DemoRShiny/www/mouseMovementController.js). To make sure collaboration features work as intended, these files need to be put in a folder named “www” in the same directory as the R-shiny app, and get uploaded to shinyapps.io together with it. Then we will add the link to the R-shiny app to our frontend dashboard. This process needs to be streamlined, and we have yet to find a way to do so.

If you want to experience the collaboration features locally on your machine, you can use either the files in the PepsiChallenge folder (courtesy to Dr. Peter Halpin for providing the basic R-Shiny app) or the files in the DemoRShiny folder. You need to download Docker from its [official site](https://www.docker.com/get-started). Then run this command in your console:
````
docker run -p "8000:80" --name convergence convergencelabs/convergence-omnibus
````
You also need to change the URL in config.js to 
````
"http://localhost:8000/api/realtime/convergence/default"
````

### Connect R-Shiny and Convergence
If you want to create a new R-Shiny app that has the collaboration features, for now please follow the file [NormalDistribution.R](/DemoRShiny/NormalDistribution.R) in the DemoRShiny folder. Note:
you have to include
````r
fluidPage(
  tags$head(tags$script(src="https://cdn.jsdelivr.net/npm/rxjs@6.6.2/bundles/rxjs.umd.min.js")),
  tags$head(tags$script(src="https://cdn.jsdelivr.net/npm/@convergence/convergence/convergence.global.min.js")),
  tags$head(tags$script(src="config.js")),
  tags$head(tags$script(src="shinyJSController.js")),
  tags$head(tags$script(src="chatRoomController.js")),
  tags$head(tags$script(src="mouseMovementController.js")), ...)
````
in the ui fluidPage() method of the R-Shiny app. This is not very ideal, and a more efficient solution would be not linking the R-shiny file to the [chatRoomController.js](/DemoRShiny/www/chatRoomController.js) and [mouseMovementController.js](/DemoRShiny/www/mouseMovementController.js), but letting the web frontend and the backend run those files. We have yet to developed this solution.

To make all the inputs shared across different clients: 

on the R-Shiny side, all the input events need to be listened, and a handler has to be attached to each input event. 

For example, in [NormalDistrution.R](/DemoRShiny/NormalDistribution.R): 
````r
observeEvent(input$mean, {updateSliderInput(session, "mean", value = input$mean)})
````
The event “mean” is being listened, and the corresponding slider will be updated when the input “mean” is changed. 

On the JS side, in the file shinyJSController.js, the data model (a JSON object) needs to have one key for each event on the R-Shiny side with the same name. A local handler and a remote handler need to be attached with respect to each property the model . See shinyJSController.js for details. This process needs to be streamlined. 

Some online resources about how to connect R-Shiny and JS:
- https://shiny.rstudio.com/articles/communicating-with-js.html
- https://stackoverflow.com/questions/23599268/include-a-javascript-file-in-shiny-app
- https://shiny.rstudio.com/articles/js-events.html
- https://unleash-shiny.rinterface.com/shiny-intro.html
- https://engineering-shiny.org/golem.html
- https://engineering-shiny.org/using-javascript.html#from-javascript-to-r
- http://connect.thinkr.fr/js4shinyfieldnotes/js-in-shiny.html#the-javascript-shiny-object
