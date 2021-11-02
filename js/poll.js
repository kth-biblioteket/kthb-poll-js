function getQuerystringparam (querystringparam) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const value = urlParams.get(querystringparam)
    return value
}

var getTotal = function (myChart) {
    var sum = myChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
    return sum;
}

var getDoughnutcentertext = function () {
    if (getQuerystringparam('lang') == 'sv') {
        return doughnutcentertext_sv
    } else {
        return doughnutcentertext
    }
}

if (getQuerystringparam('display') == 'libtv') {
    $('body').css('overflow', 'hidden');
}

if (getQuerystringparam('lang') == 'sv') {
    if (getQuerystringparam('display') == 'libtv') {
        $('#header').text(header_sv_lib_tv)
    } else {
        $('#header').text(header_sv)
    }
} else {
    if (getQuerystringparam('display') == 'libtv') {
        $('#header').text(header_lib_tv)
    } else {
        $('#header').text(header)
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
            legend: {
                display: false
            },
            datalabels: {
                labels: {
                    name: {
                        align: 'end',
                        anchor: 'end',
                        color: textcolor,
                        font: function (context) {
                            var avgSize = Math.round((context.chart.height + context.chart.width) / 2);
                            var size = Math.round(avgSize / 32);
                            return {
                                size: size + 10,
                                weight: 'bold'
                            };
                        },
                        formatter: function (value, ctx) {
                            return ctx.active
                                ? ctx.dataset.data[ctx.dataIndex] + ''
                                : ctx.chart.data.labels[ctx.dataIndex];
                        },
                        offset: 5,
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
                            family: '"Open Sans",Arial,"Helvetica Neue",helvetica,sans-ServiceUIFrameContext',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: textcolor,
                    },
                    {
                        text: getDoughnutcentertext,
                        font: {
                            size: doughnutcentertextfontsize,
                            family: '"Open Sans",Arial,"Helvetica Neue",helvetica,sans-ServiceUIFrameContext',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: textcolor,
                    },
                ],
            }
        },
        cutout: cutout,
        radius: radius,
        layout: {
            padding: {
                left: 70,
                right: 70,
                top: 70,
                bottom: 70
            }
        }
    }
});

if (getQuerystringparam('ws') == 'true') {
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
            if (getQuerystringparam('lang') == 'sv') {
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

