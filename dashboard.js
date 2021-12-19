var xPrjNames = [
    "Dashbord",
    "Game",
    "IOT",
    "Bug Tracker",
    "Blog",
    "Financial Portal",
    "Inventory Control",
    "Work Order System",
];
var yPrjProgress = [100, 70, 50, 30, 20, 60, 15, 30]; //,20,10,0];
//var prjBarColors = ["red", "green","blue","orange","brown", "purple", "cyan", "magenta"];
var prjBarColors = [
    "red",
    "orange",
    "cyan",
    "green",
    "brown",
    "blue",
    "navy",
    "purple",
];

let dashbdChart = new Chart("dashboardChart", {
    type: "bar",
    data: {
        labels: xPrjNames,
        datasets: [
            {
                backgroundColor: prjBarColors,
                data: yPrjProgress,
            },
        ],
    },
    options: {
        legend: { display: false },
        title: {
            display: true,
            text: "Each Project Status (%)",
        },
    },
});

function chgPrjColor() {
    let i = 0;
    tmp = prjBarColors[prjBarColors.length - 1];
    for (i = prjBarColors.length - 1; i > 0; i--) {
        prjBarColors[i] = prjBarColors[i - 1];
    }

    prjBarColors[i] = tmp;
    dashbdChart.update();
}

function chgProgress() {
    let i = 0;
    tmp = yPrjProgress[yPrjProgress.length - 1];
    for (i = yPrjProgress.length - 1; i > 0; i--) {
        yPrjProgress[i] = yPrjProgress[i - 1];
    }

    yPrjProgress[i] = tmp;
    dashbdChart.update();
}




var xWorkTypeNames = ["Design", "Development", "Test & Debug", "Change Request", "Customer Service"];
var yWorkTypeHours = [55, 49, 44, 24, 15];
var wTypebarColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];

let wTypeChart = new Chart("workTypeChart", {
  type: "doughnut",
  data: {
    labels: xWorkTypeNames,
    datasets: [{
      backgroundColor: wTypebarColors,
      data: yWorkTypeHours
    }]
  },
  options: {
    title: {
      display: true,
      text: "Work Types and Hours"
    }
  }
});



function chgWorkTypeHour() {
    
    tmp = yWorkTypeHours[0];
    for( i = 0; i < yWorkTypeHours.length - 1; i++) {
         yWorkTypeHours[i] = yWorkTypeHours[i+1];
    }
    
    yWorkTypeHours[i] = tmp;
    
    //wTypeChart.config.data.labels[0] = 'Korea';
    wTypeChart.update();
    //wTypeChart.chart.width = 900;
    //wTypeChart.chart.height = 900;
}