function buildMetadata(sample) {
  //alert(sample);
   
  var url = `/metadata/${sample}`; 
  d3.json(url).then((data) =>{
    //console.log(data);
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(data).forEach(([key,value]) =>{
      PANEL.append("h6").text(`${key}: ${value}`);
    })
    
  });
}
    

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`; 
  d3.json(url).then((data) =>{
    // @TODO: Build a Bubble Chart using the sample data
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;

    // Use otu_ids for the x values
    // Use sample_values for the y values
    // Use sample_values for the marker size
    // Use otu_ids for the marker colors
    // Use otu_labels for the text values

    var bubbleLayout = {
      margin: {t: 0},
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.plot("bubble", bubbleData, bubbleLayout);
    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and otu_labels (10 each).

    var piedata = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      type: 'pie' 
    }];
    
    var pielayout = {
      margin: {t:0,1:0}
    };
    
    Plotly.plot('pie', piedata, pielayout);
  });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sample_values) => {
    sample_values.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sample_values[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
