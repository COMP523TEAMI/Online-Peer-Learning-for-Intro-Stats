#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

#download/load shiny
if(!require(shiny)) {
    install.packages("shiny")
}
library(shiny)
if(!require(ggplot2)) {
    install.packages("ggplot2")
}
library(dplyr)
if(!require(dplyr)) {
    install.packages("dplyr")
}
library(dplyr)
library(shinyjs)



# Define UI for dataset viewer app ----
ui <- fluidPage(
    tags$head(tags$script(src="https://cdn.jsdelivr.net/npm/rxjs@6.6.2/bundles/rxjs.umd.min.js")),
    tags$head(tags$script(src="https://cdn.jsdelivr.net/npm/@convergence/convergence/convergence.global.min.js")),
    tags$head(tags$script(src="config.js")),
    tags$head(tags$script(src="shinyJSController.js")),
    tags$head(tags$script(src="chatRoomController.js")),
    tags$head(tags$script(src="mouseMovementController.js")),
    
    # App title ----
    titlePanel(h1("Normal Distribution", align = "center")),

    # Sidebar layout with input and output definitions ----
    fluidRow(
        # Sidebar panel for inputs ----
        column(3,
               style = "background-color:#F8F8F8;",
               h4("Select Mean"),
               sliderInput("mean",
                        "Mean",
                        value=0,
                        min=-100,
                        max=100),
               h4("Select Standard Deviation"),
               sliderInput("sd", 
                           "Standard Deviation",
                           value=1,
                           min=0.5,
                           max=50),
               actionButton("plotButton", "Plot")
            ),
        # Main panel for displaying outputs ----
        column(7,
            plotOutput("hist"),
        )
    )
)

# Define server logic to summarize and view selected dataset ----
server <- function(input, output,session) {
    rv <- reactiveValues(i = 0)
    
    
    observeEvent(input$plotButton, {
        y <- rnorm(1000, input$mean, input$sd)
        output$hist <- renderPlot({
            hist(y,
                 xlim=c(-100,100))
            abline(v=input$mean,col="red", lwd=3)
        })

    })
    
    observeEvent(input$mean, {
        updateSliderInput(session, "mean", value = input$mean)
    })
    observeEvent(input$sd, {
        updateSliderInput(session, "sd", value = input$sd)
    })
    
}

# Create Shiny app ----
shinyApp(ui, server)
