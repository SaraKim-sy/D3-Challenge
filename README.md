# Data Journalism and D3 - Interactive Dashboard

![Newsroom](https://media.giphy.com/media/v2xIous7mnEYg/giphy.gif)

## Background

This repository is created to analyze the current trends shaping people's lives, as well as create charts, graphs, and interactive elements to help readers understand the findings about the health risks facing particular demographics.

The data set included with the project is based on 2014 ACS 1-year estimates from the [US Census Bureau](https://data.census.gov/cedsci/). The data set includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

- - -

### Interactive Static Grapic Using the D3

A static graphic was created using the D3 techniques to enable users to interact with the data. A scatter plot that represents each state with circle elements was created. This graphic was coded in the `app.js` file of this repository directory—the data was pulled from `data.csv` by using the `d3.csv` function. The interactive scatter plot ultimately appears like the image below.


![7-animated-scatter](Images/7-animated-scatter.gif)

* Included state abbreviations in the circles.

* Created and situated the axes and labels to the left and bottom of the chart.

#### 1. More Data, More Dynamics

More demographics and more risk factors were included. Additional labels were added in the scatter plot and click events were given to them so that the users can decide which data to display. The transitions for the circles' locations as well as the range of the axes were animated. Three risk factors for each axis were created.

#### 2. Incorporate d3-tip

While the ticks on the axes allow us to infer approximate values for each circle, it's impossible to determine the true value without adding another layer of data. Enter tooltips: developers can implement these in their D3 graphics to reveal a specific element's data when the user hovers their cursor over the element. Tooltips were added to the circles and each tooltip with the data that the user has selected will be displayed. The `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged) was used—it's included in this repository directory.

![8-tooltip](Images/8-tooltip.gif)

* Note: You'll need to use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.

- - -
### Technologies
This project was created with:
* JavaScript
* HTML/CSS
* D3.js



