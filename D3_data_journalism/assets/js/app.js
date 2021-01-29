var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append on SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty"
var chosenYAxis = "healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

  function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderX(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

function renderY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, xScale, chosenXAxis, yScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => xScale(d[chosenXAxis]))
      .attr("cy", d => yScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

function renderAbbr(abbrGroup, xScale, chosenXAxis, yScale, chosenYAxis) {

    abbrGroup.transition()
        .duration(1000)
        .attr("x", d => xScale(d[chosenXAxis]))
        .attr("y", d => yScale(d[chosenYAxis]));

    return abbrGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var label;
    var labelY;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty:"
        if (chosenYAxis === "obesity") {
            labelY = "Obesity:"
        }
        else if (chosenYAxis === "smokes") {
            labelY = "Smokes:"
        }
        else if (chosenYAxis === "healthcare") {
            labelY = "Healthcare:"
        }
    }
    else if (chosenXAxis === "age") {
        label = "Age:"
            if (chosenYAxis === "obesity") {
                labelY = "Obesity:"
            }
            else if (chosenYAxis === "smokes") {
                labelY = "Smokes:"
            }
            else if (chosenYAxis === "healthcare") {
                labelY = "Healthcare:"
            }
    }
    else if (chosenXAxis ==="income") {
      label = "Income:"
        if (chosenYAxis === "obesity") {
            labelY = "Obesity:"
        }
        else if (chosenYAxis === "smokes") {
            labelY = "Smokes:"
        }
        else if (chosenYAxis === "healthcare") {
            labelY = "Healthcare:"
        }
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
    
    // on mouseover event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // on mouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

    // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.age = +data.age;
      data.income = +data.income;
    });

    // Create scale functions
    // ==============================
    var xLinearScale = xScale(censusData, chosenXAxis);

    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create initial axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // Append initial Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", "17")
        .attr("class", "stateCircle")
    
    // Append initial ABBR
    var abbrGroup = chartGroup.selectAll("text.stateText")
            .data(censusData)
            .enter()
            .append("text")
            .attr("class", "stateText")
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .attr("dy", 4);

    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)")

    // Create group for three y-axis labels
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var healthcareLabel = labelsGroupY.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 60 - margin.left)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = labelsGroupY.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 40 - margin.left)
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokes (%)");

    var obesityLabel = labelsGroupY.append("text")
        .attr("x", 0 - (height/2))
        .attr("y", 20 - margin.left)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");


    
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup)

    labelsGroupY.selectAll("text").on("click", function() {
        var yValue = d3.select(this).attr("value");
        if (yValue != chosenYAxis) {
            chosenYAxis = yValue;

            yLinearScale = yScale(censusData, chosenYAxis);
            yAxis = renderY(yLinearScale, yAxis);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        if (chosenYAxis == "obesity") {
            obesityLabel.classed("active", true).classed("inactive", false)
            healthcareLabel.classed("active", false).classed("inactive", true)
            smokesLabel.classed("active", false).classed("inactive", true)
        }
        if (chosenYAxis == "healthcare") {
            healthcareLabel.classed("active", true).classed("inactive", false)
            obesityLabel.classed("active", false).classed("inactive", true)
            smokesLabel.classed("active", false).classed("inactive", true)
        }
        if (chosenYAxis == "smokes") {
            smokesLabel.classed("active", true).classed("inactive", false)
            obesityLabel.classed("active", false).classed("inactive", true)
            healthcareLabel.classed("active", false).classed("inactive", true)
        }
        }
    })

    labelsGroup.selectAll("text").on("click", function() {
        var xValue = d3.select(this).attr("value")
        if (xValue != chosenXAxis) {
            chosenXAxis = xValue;

            xLinearScale = xScale(censusData, chosenXAxis);
            xAxis = renderX(xLinearScale, xAxis);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            abbrGroup = renderAbbr(abbrGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            if (chosenXAxis == "poverty") {
                povertyLabel.classed("active", true).classed("inactive", false)
                ageLabel.classed("active", false).classed("inactive", true)
                incomeLabel.classed("active", false).classed("inactive", true)
            }
            else if (chosenXAxis == "age") {
                ageLabel.classed("active", true).classed("inactive", false)
                povertyLabel.classed("active", false).classed("inactive", true)
                incomeLabel.classed("active", false).classed("inactive", true)
            }
            else if (chosenXAxis == "income") {
                incomeLabel.classed("active", true).classed("inactive", false)
                ageLabel.classed("active", false).classed("inactive", true)
                povertyLabel.classed("active", false).classed("inactive", true)
            }
        }
    })

    }).catch(function(error) {
    console.log(error);
})
