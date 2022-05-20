function init(){
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) =>{
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
        // FIlter the data for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // Use d3 to select the panel with the id of '#sample-metadata'
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

        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
     

        // Create a variable that filters the metadata array for the object with the desired sample number.
        var ggArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
        console.log(ggArray);
        var ggResult = ggArray[0];
    
        // Create a variable that holds the first sample in the metadata array.
        var wfreqs = ggResult.wfreq;
        console.log(wfreqs);

        // ## BAR CHART ##
        var yticks = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        console.log(yticks);

        // Create the trace for the bar chart
        var barData = [{
            x: values.slice(0,10).reverse(),
            y: yticks,
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation:"h",
            marker: {
                color: '#00adad',
                line: {
                    width: 1.0
                }
                }
            }];
    
        // Create layout for bar chart
        var barLayout = {
            title: "<b>Top 10 Bacteria Cultures Found</b>",
            width: 447,
            height: 390
        };

        // Use Plotly to plot the data with the layout
        Plotly.newPlot("bar",barData,barLayout);

        // ## BUBBLE CHART ## //
        // Create the trace for the bubble chart.
        var bubbleData = [{
            x: ids, 
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                size: values,
                color: ids,
                colorscale: "Electric",
                line: {
                    color: "black",
                    width: 1.0
                }
            }
        }];
        
        // Create the layout for the bubble chart.
        var bubbleLayout ={
            title: "<b>Bacteria Cultures Per Sample</b>",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}

        };
        //Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Create the trace for the gauge chart
        var gaugeData =[{
            value: wfreqs,
            title: {text: "<b>Belly Button Washing Frequency</b><br></br>Scrubs Per Week"},
            type: "indicator",
            mode: "gauge+number",
            delta: {reference: 2},
            gauge:{
                axis: {range: [null, 10]},
                bar:{color:"black"},
                steps: [
                    {range: [0,2], color: "#ff5252"},
                    {range: [2,4], color: "#ffb224"},
                    {range: [4,6], color: "#ffde24"},
                    {range: [6,8], color: "#52ff52"},
                    {range: [8,10], color: "#00a800"}
                ]
            }
        }];

         // Create the layout for the gauge chart.
        var gaugeLayout ={
             width: 485,
             height: 390
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}