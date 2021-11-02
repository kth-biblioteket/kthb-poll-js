/*
var csslink=document.createElement("link")
csslink.setAttribute("rel", "stylesheet")
csslink.setAttribute("type", "text/css")
if (window.location.search.search(/[?&]pp=true(?:$|&)/) !== -1) {
    csslink.setAttribute("href", "css/stylepp.css?time=" + Date.now())
} else {
    csslink.setAttribute("href", "css/style.css?time=" + Date.now())
}
*/

if (typeof csslink != "undefined")
    document.getElementsByTagName("head")[0].appendChild(csslink)

var getTotal = function (myChart) {
    var sum = myChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
    return sum;
}

var doughnutcentertext = "Promises"
var header = "Promises"
if (getcurrentlang() == 'sv') {
    doughnutcentertext = "Löften"
    $('#header').text('Klimatlöften')
}

const ctx = document.getElementById('myChart');
Chart.register(ChartDataLabels);
Chart.register(DoughnutLabel);
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        //labels: ['Clothing', 'Food', 'Education', 'Things', 'Plants'],
        datasets: [{
            label: '# of Votes',
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ]
        }]
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
                        // center, end, start, top*
                        align: 'end',
                        anchor: 'end',
                        color: '#ffffff' //function (ctx) {return ctx.dataset.backgroundColor;}
                        ,
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
                            size: 96,
                            family: 'Arial, Helvetica, sans-serif',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: 'rgba(255, 255, 255, 1)',
                    },
                    {
                        text: doughnutcentertext,
                        font: {
                            size: 48,
                            family: 'Arial, Helvetica, sans-serif',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: 'rgba(255, 255, 255, 1)',
                    },
                ],
            }
        },
        cutout: "65%",
        radius: "60%"
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

function getcurrentlang() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const language = urlParams.get('lang')
    return language
}

function GETInitialVotes(first) {
    return fetch(api_url + '/vote/api/v1/vote/' + eventid, {
        method: 'GET',
        headers: new Headers({
            'X-Api-Key': 'kg897n987n98n)!dskjlksjfd?435mnckjsbsekef-_klknbhjhsef'
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
        for (let i in currentNewVotes) {
            if (getcurrentlang() == 'sv') {
                chartlabelarray.push(currentNewVotes[i].description_sv)
            } else {
                chartlabelarray.push(currentNewVotes[i].description_en)
            }
            chartdataarray.push(currentNewVotes[i].votes)
        }
        myChart.data.datasets[0].data = chartdataarray;
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

