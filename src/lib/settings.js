// -----------------------------------------------------------------------------
// Fig 1 - TTI Summary lineChart
settTtiLine = {
  alt: i18next.t("alt", {ns: "tti-summary"}),
  margin: {
    top: 30,
    right: 70,
    bottom: 80,
    left: 70
  },
  aspectRatio: 16 / 9,
  datatable: false,
  filterData: function(d) {
    console.log("orig d: ", d)
    const root = d[Object.keys(d)[0]];
    const keys = this.z.getKeys(root);
    return keys.map(function(key) {
      return {
        id: key,
        values: root[key].map(function(value, index) {
          if (value) {
            return {
              date: root.keys.values[index],
              value: value
            };
          }
        })
      };
    });
  },
  tableData: function(data) {
    const arr = [].concat.apply([], data.map(function(d) {
      return d.values;
    }));
    console.log("tableData return: ", arr)
    return arr;
  },
  x: {
    label: i18next.t("x_label", {ns: "tti-summary"}),
    getValue: function(d) {
      // d: "2020-03-03-01"
      let s = d.date.split("-"); // [ "2020", "03", "03", "03" ]
      // new Date(2020, 02, 01, 1)
      // if (d) return new Date(d.date + "-01");
      // if (d) return new Date(s[0], s[1], s[2], s[3]);
      if (d) return new Date(s[0], parseInt(s[1]) - 1, s[2], s[3]);
    },
    getText: function(d) {
      if (d) return d.date;
    },
    // ticks: 2,
    translateXY: [0, 40],
    // from extend
    getDomain: function(flatData) {
      console.log("getDomain: ", d3.extent(flatData, this.x.getValue.bind(this)))
      return d3.extent(flatData, this.x.getValue.bind(this));
    },
    getRange: function() {
      return [0, this.innerWidth];
    },
    getTickText: function(val, i) {
      const yr = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(val);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(val);
      const dy = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(val);
      const hr = new Intl.DateTimeFormat('en', { hour: 'numeric' }).format(val);
      console.log("val: ", i, val)
      return `${dy}-${mo} ${hr}`;
      // return val;
    }
  },
  y: {
    label: i18next.t("y_label", {ns: "tti-summary"}), // "Average trips/day"
    getValue: function(d) {
      if (d) return d.value;
    },
    getText: function(d) {
      return d3.format("(,.0f")(d.value);
    },
    translateXY: [-65, 248],
    ticks: 5,
    // from extend
    getDomain: function(flatData) {
      var min = d3.min(flatData, this.y.getValue.bind(this));
      return [
        min > 0 ? 0 : min,
        d3.max(flatData, this.y.getValue.bind(this))
      ];
    }
  },
  z: {
    label: i18next.t("z_label", {ns: "tti-summary"}),
    getId: function(d) {
      return d.id;
    },
    getKeys: function(d) {
      const keys = Object.keys(d);
      keys.splice(keys.indexOf("keys"), 1);
      return keys;
    },
    getTableKeys: function(d) {
      const th = Object.keys(d[0].values[0]);
      return [i18next.t(th[0], {ns: "tti"}), i18next.t(th[1], {ns: "tti-summary"})];
    },
    getLegendKeys: function(d) {
      const root = Object.keys(d)[0];
      const keys = Object.keys(d[root]).splice(1);
      return [i18next.t(keys[0], {ns: "tti"}), i18next.t(keys[1], {ns: "tti-summary"})];
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getDataPoints: function(d) {
      return d.values;
    },
    getNotNullDataPoints: function(d) { // for overlay
      return d.values.filter((x) => {
        if (x) return x;
      });
    },
    getText: function(d) {
      // return i18next.t(d.id, {ns: "districts"});
      return d.id;
    },
    getPair: function(data) {
      const arr = [].concat.apply([], data.map(function(d) {
        return d.values;
      }));

      let flatout = [];
      const studyDate =  new Date("2019", "02"); // Jan is 0      
      arr.map(function(d) {
        if (d) {
          let th = (new Date(Object.values(d)[0]) > studyDate) ?
            `${Object.values(d)[0]} (post-study period)` : Object.values(d)[0];
          let td = d3.format("(,")(Object.values(d)[1]);
          flatout.push([th, td]);
        }
      })
      return flatout;
    }
  },
  showLabels: false,
  width: 850,
  tooltip: {
    pageX: 400,
    pageY: 450,
    units: "trips/day",
    width: 135,
    height: 30,
    shiftX: 12,
    shiftY: 35,
    textdy: 5
  },
  legend: {
    x: [530, 568],
    y: 350,
    dy: 20,
    textdelta: [10, 3]
  },
  datatable: true,
  summaryId: "tti-dt-tbl",
  attachedToSvg: true,
  pair: {
    getValues: function(d) { // used for data table ONLY
      // d = { date: "2016-09", value: 62242 }
      const studyDate =  new Date("2019", "02"); // Jan is 0
      let th = (new Date(Object.values(d)[0]) > studyDate) ?
        `${Object.values(d)[0]} (post-study period)` : Object.values(d)[0];
      let td = d3.format("(,")(Object.values(d)[1]);
      return [th, td];
    }
  }
};
