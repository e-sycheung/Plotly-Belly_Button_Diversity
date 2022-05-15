function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var smplArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(smplArray);
    //  5. Create a variable that holds the first sample in the array.
    var smplResult = smplArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = smplResult.otu_ids;
    var labels = smplResult.otu_labels;
    var values = smplResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 


    // 14. Create a variable that filters the metadata array for the object with the desired sample number.
    var ggArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(ggArray);
    var ggResult = ggArray[0]; 
    // 15. Create a variable that holds the first sample in the metadata array.
    var wfreqs = ggResult.wfreq;
    console.log(wfreqs);
    
    // ## BAR CHART ## //
    var yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks);


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values.slice(0,10).reverse(),
      y: yticks,
      text: labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
      }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
      // margin: { l:30, r:20, t:20, b:20}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

     // ## BUBBLE CHART ## //
    // 11. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        size: values,
        color: ids,
        colorscale: "Earth"

      }
    }];

  // 12. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"}
    
    };

  // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  // ## GAUGE CHART ##//


  // 17. Create the trace for the gauge chart.
    var gaugeData = [{
        value: wfreqs,
        title: { text: "<b> Belly Button Washing Frequency </b><br></br> Scrubs Per Week"},
        type: "indicator",
        mode: "gauge+number",
        delta: { reference: 2 },
        gauge: {
          axis: { range: [null, 10] },
          bar: {color:"black"},
          bordercolor: "black",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "gold" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
          // threshold: {
          //   line: { color: "red", width: 4 },
          //   thickness: 0.75,
          
        }
      }];
  
  
  // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        width: 500, 
        height: 400, 
        margin: { t: 0, b: 0 }
    };

  // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}


