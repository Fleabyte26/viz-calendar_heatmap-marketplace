import React from "react";
import ReactDOM from "react-dom";
import CalendarHeatmap from './CalendarHeatmap'
import * as d3 from "d3";
import moment from "moment";
import { timeYears } from "d3";

const colorByOps = {
  SEGMENT: "segment",
  RANGE: "range"
};
const baseOptions = {
  color_picker: {
    type: "array",
    label: "Calendar Color",
    display: "colors",
    default: ["#7FCDAE", "#ffed6f", "#EE7772"],
    section: "Style",
    order: 0
  },
  formatting_override: {
    type: "string",
    label: "Value Formatting Override",
    default: "",
    section: "Style",
    order: 6
  },
  rounded: {
    type: "boolean",
    label: "Rounded Cells?",
    default: "false",
    section: "Style",
    order: 4
  },
  outline: {
    type: "string",
    label: "Outline Type",
    display: "select",
    section: "Style",
    values: [
       {"Month": "month"},
       {"Quarter": "quarter"},
       {"None": "none"}
    ],
    default: "month",
    order: 3
  },
  label_year: {
    type: "boolean",
    label: "Year Labels?",
    default: "true",
    section: "Style",
    order: 1
  },
  label_month: {
    type: "boolean",
    label: "Month Labels?",
    default: "false",
    section: "Style",
    order: 2,
  },
  show_legend: {
    type: "boolean",
    label: "Show Legend?",
    default: "true",
    section: "Style",
    order: 5
  },
  outline_weight: {
    type: "number",
    label: "Outline Weight",
    default: 1,
    section: "‎Advanced",
    display: "range",
    min: 0,
    max: 2,
    step: 0.1,
    order: 1
  },
  cell_color: {
    type: "string",
    label: "Cell Border Color",
    display: "color",
    default: "#CECECE",
    section: "‎Advanced",
    order: 0
  },
  cell_reducer: {
    type: "number",
    label: "Cell Weight",
    default: 1,
    section: "‎Advanced",
    display: "range",
    min: 0,
    max: 1,
    step: 0.05,
    order: 2
  },
  axis_label_color: {
    type: "string",
    label: "Axis Label Color",
    display: "color",
    default: "#282828",
    section: "‎Advanced",
    order: 3
  },

  // HIDDEN OPTIONS
  cal_h: {
    type: "number",
    hidden: true
  },
  cal_w: {
    type: "number",
    hidden: true
  },
};

looker.plugins.visualizations.add({
  id: "heatmap_chart",
  label: "Calendar Heatmap",
  options: baseOptions,
  create: function(element, config) {
    this.chart = ReactDOM.render(<div className="vis"></div>, element);
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors();

    if (queryResponse.fields.measure_like.length == 0) {
      this.addError({
        title: "No Measures",
        message: "This chart requires measures."
      });
      return;
    }
    if (queryResponse.fields.dimension_like.length == 0) {
      this.addError({
        title: "No Dimensions",
        message: "This chart requires dimensions."
      });
      return;
    }
    if (data.length == 0) {
      this.addError({
        title: "No Results",
        message: ""
      });
      return;
    }

    const dim1  = queryResponse.fields.dimension_like[0].name;
    const meas1 = queryResponse.fields.measure_like[0].name;

    let chunks = data.map(d => {
      return {
        dimension: d[dim1], 
        value: d[meas1],
        date: moment(d[dim1].value)._d
      }
    });
    
    if (chunks.length == 0) {
      this.addError({
        title: "Wrong input pattern or insufficient data.",
        message: "Calendar Heatmap requires one non-null date dimension and one measure."
      });
      return;
    }

    this.chart = ReactDOM.render(
      <CalendarHeatmap
         data = {chunks}
         width = {element.getBoundingClientRect().width}
         height = {element.getBoundingClientRect().height}
         color = {config.color_picker}
         overview = {config.overview}
         outline = {config.outline}
         rounded = {config.rounded}
         formatting = {config.formatting_override}
         sizeonday = {config.sizeshape}
         rows = {config.rows}
         label_year = {config.label_year}
         label_month = {config.label_month}
         label_week = {config.label_week}
         legend = {config.show_legend}
         outline_weight = {config.outline_weight}
         cell_color = {config.cell_color}
         cell_reducer = {config.cell_reducer}
         axis_label_color = {config.axis_label_color}
        />,
      element
    );
    done();
  }
});
