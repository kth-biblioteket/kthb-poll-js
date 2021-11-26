function getcurrentlang () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const language = urlParams.get('lang')
    return language
}

function getDisplay () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const display = urlParams.get('display')
    return display
}

var getTotal = function (myChart) {
    var sum = myChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
    return sum;
}

var getDoughnutcentertext = function () {
    if (getcurrentlang() == 'sv') {
        return doughnutcentertext_sv
    } else {
        return doughnutcentertext
    }
}

if (getcurrentlang() == 'sv') {
    if (getDisplay() == 'libtv') {
        $('#header').html(header_sv_lib_tv)
        $('#charttext').html(charttext_sv)
    } else {
        $('#header').text(header_sv)
        $('#charttext').html(charttext_sv)
    }
} else {
    if (getDisplay() == 'libtv') {
        $('#header').html(header_lib_tv)
        $('#charttext').html(charttext)
    } else {
        $('#header').text(header)
        $('#charttext').html(charttext_sv)
    }
}

const ctx = document.getElementById('myChart');
Chart.register(ChartDataLabels);
Chart.register(DoughnutLabel);
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
         datasets: [{}]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        borderWidth: 0,
        plugins: {
            title: {
                display: false, 
                position: "top", 
                fullsize: false,
                align: "start",
                text: "These are the kg  jhg kjhg jkhg kj ",
                padding: {
                    top: 200,
                    bottom: 30
                },
                color: 'rgba(255, 255, 255, 0.8)',
                font: function (context) {
                    var avgSize = Math.round((context.chart.height + context.chart.width) / 2);
                    var size = Math.round(avgSize / 32);
                    return {
                        size: size + 3,
                        weight: 'bold'
                    };
                },
            },
            legend: {
                display: false
            },
            datalabels: {
                labels: {
                    name: {
                        align: 'end',
                        anchor: 'end',
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: function (context) {
                            var avgSize = Math.round((context.chart.height + context.chart.width) / 2);
                            var size = Math.round(avgSize / 32);
                            return {
                                size: size + 3,
                                weight: 'bold'
                            };
                        },
                        formatter: function (value, ctx) {
                            return ctx.active
                                ? ctx.dataset.data[ctx.dataIndex] + ''
                                : ctx.chart.data.labels[ctx.dataIndex];
                        },
                        offset: 8,
                        opacity: function (ctx) {
                            return ctx.active ? 1 : 1;
                        }
                    }
                }
            },
            doughnutlabel: {
                paddingPercentage: 5,
                labels: [
                    {
                        text: getTotal,
                        font: {
                            size: doughnutcentertotalfontsize,
                            family: 'Arial, Helvetica, sans-serif',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: 'rgba(255, 255, 255, 0.8)',
                    },
                    {
                        text: getDoughnutcentertext,
                        font: {
                            size: doughnuttexttotalfontsize,
                            family: 'Arial, Helvetica, sans-serif',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: 'rgba(255, 255, 255, 0.8)',
                    },
                ],
            }
        },
        cutout: cutout,
        radius: radius
    }
});

if (usesocket == true) {
    var socket = io.connect(api_url);

    socket.on("FromAPI", function (data) {
        document.getElementById("globe").classList.toggle('animated')
        GETInitialVotes(false);
    });

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });

    socket.on('error', console.error.bind(console));

}

function GETInitialVotes(first) {
    return fetch(api_url + '/vote/api/v1/vote/' + eventid, {
        method: 'GET',
        headers: new Headers({
            'X-Api-Key': XApiKey
        }),
        mode: 'cors'
    }).then(function (res) {
        if (res.ok) {
            return res.json();
        } else {
            throw new TypeError('GETVotes error');
        }
    }).then(function (resJSON) {
        var currentNewVotes = resJSON.currentNewVotes
        var chartdataarray = [];
        var chartlabelarray = [];
        var chartbackgroundcolorarray = [];
        for (let i in currentNewVotes) {
            if (getcurrentlang() == 'sv') {
                chartlabelarray.push(currentNewVotes[i].description_sv)
            } else {
                chartlabelarray.push(currentNewVotes[i].description_en)
            }
            chartdataarray.push(currentNewVotes[i].votes)
            chartbackgroundcolorarray.push(currentNewVotes[i].rgbacolor)
        }
        myChart.data.datasets[0].data = chartdataarray;
        myChart.data.datasets[0].backgroundColor = chartbackgroundcolorarray;
        myChart.data.labels = chartlabelarray;
        if (first === true) {
        }
        myChart.update();
    }).catch(function (err) {
        console.log(err);
    });
}

GETInitialVotes(true)

move.onclick = () => {
    document.getElementById("globe").classList.toggle('animated')
    GETInitialVotes(false);
}
const animated = document.getElementById('globe');
animated.addEventListener('animationend', () => {
    document.getElementById("globe").classList.toggle('animated')
});

