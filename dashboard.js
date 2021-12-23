let xPrjNames = [];
let yPrjProgress = [];
let prjChartColors = [];
let yPrjHours = [];

let xWorkTypeNames = ["Design", "Development", "Test & Debug", "Change Request", "Customer Service"];
let yWorkTypeHours = [];
let wTypebarColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9",
  "#1e7145"
];


for( let i = 0; i < projects.length; i++ ) {
    xPrjNames[i] = projects[i].name;
    prjChartColors[i] = projects[i].color;
    yPrjProgress[i] = projects[i].progress;
    //yPrjHours[i] = projects[i].hours;
    yPrjHours[i] = getProjectWorkHours(i);
}

populateWorkTypeHours(xPrjNames[0]);

let dashbdChart = new Chart("dashboardChart", {
    type: "bar",
    data: {
        labels: xPrjNames,
        datasets: [
            {
                backgroundColor: prjChartColors,
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

let prjHourChart = new Chart("projectHourChart", {
    type: "doughnut",
    data: {
      labels: xPrjNames,
      datasets: [{
        backgroundColor: prjChartColors,
        data: yPrjHours
      }]
    },
    options: {
      title: {
        display: true,
        text: "Each Project's Work Hours"
      }
    }
  });

  let wTypeChart = new Chart("workTypeChart", {
    type: "pie",
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
        text: "Hours of Dashboard Project's Work Type"
      }
    }
  });

function getProjectWorkHours(prjIx) {
    let sum = 0;
    
    for( let i = 0; i < xWorkTypeNames.length; i++) {
        sum += projects[prjIx][xWorkTypeNames[i]];
    }

    return sum;
}

function populateWorkTypeHours(prj) {
    let ix, sum = 0;
    projects.forEach(function (item, index) {
        if(item.name == prj) ix = index;
    });


    for( let i = 0; i < xWorkTypeNames.length; i++) {
        yWorkTypeHours[i] = projects[ix][xWorkTypeNames[i]];
        sum += yWorkTypeHours[i];
    }
    document.getElementById('workHours').children[0].textContent = sum;
}


  function updateProgress() {
    let sel = document.getElementById('selPrj');
    let newVal = document.getElementById('newProgress');
    let ix = sel.selectedIndex - 1;
    if( ix < xPrjNames.length ) {
        yPrjProgress[ix] =  parseInt(newVal.value.trim());

        dashbdChart.update();
    } else {
        alert("invalid number!")
    }
}

function chgPrjColor() {
    let i = 0;
    tmp = prjChartColors[prjChartColors.length - 1];
    for (i = prjChartColors.length - 1; i > 0; i--) {
        prjChartColors[i] = prjChartColors[i - 1];
    }

    prjChartColors[i] = tmp;
    dashbdChart.update();
}

function shiftProjectStatus(chartIdName) {
    let i = xPrjNames.length - 1;
    tmpPrj = xPrjNames[i];
    tmpY = yPrjProgress[i];
    tmpC = prjChartColors[i];
    tmpH = yPrjHours[i];

    for (i = yPrjProgress.length - 1; i > 0; i--) {
        xPrjNames[i] = xPrjNames[i - 1];
        yPrjProgress[i] = yPrjProgress[i - 1];
        prjChartColors[i] = prjChartColors[i - 1];
        yPrjHours[i] = yPrjHours[i - 1];
    }

    xPrjNames[i] = tmpPrj;
    yPrjProgress[i] = tmpY;
    prjChartColors[i] = tmpC;
    yPrjHours[i] = tmpH;
    if( chartIdName == 'dashboardChart' ) {
        dashbdChart.update();
    } else {
        prjHourChart.update();
    }
}

function updatePrjHour() {
    let sel = document.getElementById('selPrj4Hour');
    let newVal = document.getElementById('newHour');
    let ix = sel.selectedIndex - 1;
    if( ix < xPrjNames.length ) {
        yPrjHours[ix] =  parseInt(newVal.value.trim());

        prjHourChart.update();
    } else {
        alert("invalid number!")
    }
}


// function shiftPrjHour() {
//     let i = xPrjNames.length - 1;
//     tmpPrj = xPrjNames[i];
//     tmpH = yPrjHours[i];

//     for (; i > 0; i--) {
//         xPrjNames[i] = xPrjNames[i - 1];
//         yPrjHours[i] = yPrjHours[i - 1];
//         yPrjProgress[i] = yPrjProgress[i - 1];
//     }

//     xPrjNames[i] = tmpPrj;
//     yPrjHours[i] = tmpH;
//     yPrjProgress[i] = tmpY;
//     prjHourChart.update();
// }


function showSelectedPrjWorkType(me) {
    let ix = me.selectedIndex;
    
    populateWorkTypeHours(projects[ix].name);
    wTypeChart.config.options.title.text = "Hours of '" + projects[ix].name + "' Project's Work Type";
    wTypeChart.update();
}

function updateWTypeHour() {
    let prj = document.getElementById('selPrj4WT');
    let sel = document.getElementById('selWType');
    let newVal = document.getElementById('newWTHour');
    let ix = sel.selectedIndex - 1;
    let prjIx, sum = 0;

    projects.forEach(function(item,index) {
        if (item.name == prj.value) prjIx = index;
    });

    if( ix < yWorkTypeHours.length ) {
        yWorkTypeHours[ix] =  parseInt(newVal.value.trim());
        projects[prjIx][sel.value] = yWorkTypeHours[ix];

        
        for( let i = 0; i < yWorkTypeHours.length; i++) {
            sum += yWorkTypeHours[i];
        }

        yPrjHours[prjIx] = sum;
        //populateWorkTypeHours(projects[prjIx].name);
        document.getElementById('workHours').children[0].textContent = sum;
        wTypeChart.update();
        prjHourChart.update();
    } else {
        alert("invalid number!")
    }
}

function shiftWorkTypeHour() {
    let i = xWorkTypeNames.length - 1;
    tmpType = xWorkTypeNames[i];
    tmpColor = wTypebarColors[i];
    tmpY = yWorkTypeHours[i];

    for (i = xWorkTypeNames.length - 1; i > 0; i--) {
        xWorkTypeNames[i] = xWorkTypeNames[i - 1];
        wTypebarColors[i] = wTypebarColors[i - 1];
        yWorkTypeHours[i] = yWorkTypeHours[i - 1];
    }

    xWorkTypeNames[i] = tmpType;
    wTypebarColors[i] = tmpColor;
    yWorkTypeHours[i] = tmpY;
    
    //wTypeChart.config.data.labels[0] = 'Meeting';
    wTypeChart.update();
    //wTypeChart.chart.width = 900;
    //wTypeChart.chart.height = 900;
}