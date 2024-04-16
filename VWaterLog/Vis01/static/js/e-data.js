//绘制图表
function drawHorizontalBarChart(myChart, mydata) {
    // 显示 Loading 动画
    myChart.showLoading();

    // 对数据进行排序，数据最大的在最上面
    mydata.sort(function(a, b) {
        return a.value - b.value;
    });

    // 提取颜色列表
    var colorList = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'];

    // 根据数据长度确定图表高度
    var chartHeight = mydata.length * 40;

    // 设置柱状图配置项和数据
    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '45%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            splitLine: {  // 设置不显示y轴网格线
                show: false
            },
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            splitLine: {  // 设置不显示y轴网格线
                show: false
            },
            data: mydata.map(function(item) {
                return item.name;
            }),
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#eeeeee',
                    fontFamily: 'HarmonyOS',
                    fontWeight: 100
                }
            },
        },
        dataZoom: [
            {
                type: 'slider', // 设置为滑动条型缩放
                yAxisIndex: 0, // 设置为第一个y轴
                start: 50, // 缩放范围的起始百分比
                end: 100,
                left: '40%',
                
            }
        ],
        series: [
            {
                type: 'bar',
                data: mydata.map(function(item, index) {
                    return {
                        value: item.value,
                        itemStyle: {
                            color: colorList[index % colorList.length]
                        }
                    };
                }),
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}',
                    textStyle: {
                        fontFamily: 'HarmonyOS' ,
                        fontWeight: 100,
                        color: '#eeeeee',
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
    // 隐藏 Loading 动画
    myChart.hideLoading();
}

function drawBar01(barChart, barData, xAxisData) {
    var colorList = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42'];
    // 柱状图配置项
    // 显示 Loading 动画
    barChart.showLoading();
    var barOption = {
        tooltip: {
            // trigger: 'axis',
            // axisPointer: {
            //     type: 'shadow'
            // }
            show: false
        },
        grid: { // 设置图表的边距为 0
            left: 40,
            right: 0,
            top: 0,
            bottom: 0
        },
        xAxis: {
            type: 'value',
            show: false, 
            boundaryGap: [0, 0.01],
        },
        yAxis: {
            axisLine: { // 设置不显示 y 轴轴线
                show: false
            },
            axisLabel: { // 设置不显示 y 轴标签
                textStyle: {
                    fontFamily: 'HarmonyOS' ,
                    fontWeight: 100
                }
            },
            type: 'category',
            splitLine: {  // 设置不显示y轴网格线
                show: false
            },
            data: xAxisData
        },
        series: [
            {
                type: 'bar',
                data: barData,
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}',
                    textStyle: {
                        fontFamily: 'HarmonyOS' ,
                        fontWeight: 100
                    }
                },
                // 为每个柱子设置不同的颜色
                itemStyle: {
                    color: function(params) {
                        return colorList[params.dataIndex];
                    }
                }
            }
        ]
    };

    // 使用配置项和数据显示柱状图
    barChart.setOption(barOption);
    // 隐藏 Loading 动画
    barChart.hideLoading();
}
function drawTerrain(myChart, terrain, cityname){
    // 显示 Loading 动画
    myChart.showLoading();
    var terrainData = [
        { value: Number(terrain.plain).toFixed(2), name: '平原' },
        { value: Number(terrain.mountain).toFixed(2), name: '山地' },
        { value: Number(terrain.hill).toFixed(2), name: '丘陵' },
        { value: Number(terrain.desert).toFixed(2), name: '沙漠' },
        { value: Number(terrain.water_body).toFixed(2), name: '水体' }
    ];
    // 绘制圆角环形图
    myChart.setOption({
        title: {
            text: cityname +'地形地貌分类',
            left: 'left',
            top: '5%', 
            textStyle: {
                fontSize: 20,
                fontFamily: 'HarmonyOS' ,
                fontWeight: 700
            }
        },
        legend: {
            top: '25%',
            left: 'center',
            textStyle: {
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100,
            },
            itemWidth: 17, 
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            textStyle: {
                color: '#303030',
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100,
            },
            borderWidth: 0, // 设置边框宽度为 2
        },
        series: [
            {
                name: '地形地貌数据',
                type: 'pie',
                radius: ['40%', '90%'],
                center: ['50%', '92%'],
                startAngle: 180,
                endAngle: 360,
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: 'rgba(51,51,51,1)',
                    borderWidth: 1
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: terrainData
            }
        ]
    });
    // 隐藏 Loading 动画
    myChart.hideLoading();
}
function drawLandUse(myChart, landUse, cityname){
    var landUseData = [
        { value: Number(landUse.arable_land).toFixed(2), name: '耕地' },
        { value: Number(landUse.garden_land).toFixed(2), name: '园地' },
        { value: Number(landUse.forest_land).toFixed(2), name: '林地' },
        { value: Number(landUse.grassland).toFixed(2), name: '草地' },
        { value: Number(landUse.wetland).toFixed(2), name: '湿地' },
        { value: Number(landUse.transport_land).toFixed(2), name: '交通运输用地' },
        { value: Number(landUse.urban_and_industrial_land).toFixed(2), name: '城镇村及工矿用地' },
        { value: Number(landUse.water_and_water_facility_land).toFixed(2), name: '水域及水利设施用地' }
    ];
    myChart.setOption({
        title: {
            text: cityname+'一级土地利用分类',
            left: 'left',
            top: 'top', 
            textStyle: {
                fontSize: 20,
                fontFamily: 'HarmonyOS' ,
                fontWeight: 700
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b} <br/>{c} ({d}%)',
            textStyle: {
                color: '#333333',
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100,
            },
            borderWidth: 0,
            position: function (pos, params, dom, rect, size) {
                // 获取饼图容器的高度
                var chartHeight = size.viewSize[1];
                // 判断鼠标位置是在饼图的上半部还是下半部
                if (pos[1] < chartHeight / 2) {
                    // 鼠标在上半部，Tooltip显示在鼠标上方
                    return [pos[0] - 100, pos[1] - 65];
                } else if (pos[1] > chartHeight * 2 / 3) {
                    // 鼠标在上半部，Tooltip显示在鼠标上方
                    return [pos[0] - 100, pos[1] - 65];
                } else {
                    // 鼠标在下半部，Tooltip显示在鼠标下方
                    return [pos[0] - 100, pos[1] + 20];
                }
            }
        },
        series: [
            {
                name: '一级土地利用数据',
                type: 'pie',
                radius: ['0%', '80%'],
                center: ['50%', '57%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: 'rgba(51,51,51,1)',
                    borderWidth: 1
                },
                label: {
                    show: false,
                    position: 'center',
                },
                emphasis: {
                    label: {
                        show: true,
                        textStyle: {
                            fontSize: 18,
                            fontFamily: 'HarmonyOS' ,
                            fontWeight: 900,
                            color: '#eeeeee',
                            textBorderColor: '#333333',
                            textBorderWidth: 2,
                            textBorderType: 'solid'
                        }
                    }
                },
                labelLine: {
                    show: false
                },
                data: landUseData
            }
        ]
    });
    // 隐藏 Loading 动画
    myChart.hideLoading();
}
var intervalId = null;
var currentIndex = 0; // 从第一个数据点开始
function drawHourlyLine(myChart, simulationResults){
    // 清除旧动画
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
    // 重置currentIndex
    currentIndex = 0;
    myChart.clear();
    // 显示 Loading 动画
    myChart.showLoading();

    var option = {
        title: {
            text: '未来24小时积水变化趋势',
            textStyle: {
            fontSize: 19,
            fontFamily: 'HarmonyOS' ,
            fontWeight: 700
        }
        },
        tooltip: {
            trigger: 'axis',
            textStyle: {
                fontSize: 13,
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100
            }
        },
        legend: {
            data: ['降水量', '积水深度'],
            bottom: '0%',
            left: 'center',
            itemWidth: 20, 
        },
        xAxis: {
            type: 'category',
            data: [],
            splitLine: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    color: '#a1a1a1', // 灰色
                }
            },
            axisLabel: {
                color: '#a1a1a1',
                fontSize: 13,
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: true, // 显示分割线
                lineStyle: {
                    color: '#505050', // 设置分割线颜色为灰色
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#a1a1a1', // 灰色
                }
            },
            axisLabel: {
                color: '#a1a1a1',
                fontSize: 13,
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100
            }
        },
        grid: {
            left: '3%', // 距离容器左侧的距离
            right: '8%', // 距离容器右侧的距离
            top: '21%', // 距离容器顶部的距离
            bottom: '13%', // 距离容器底部的距离
            containLabel: true // 包含标签的大小在内
        },
        series: [{
            name: '降水量',
            type: 'line',
            areaStyle: {},
            data: [],
            emphasis: {
                focus: 'series'
            },
            // areaStyle: {
            //     color: 'rgba(117, 154, 160, 0.5)'
            // },
            // lineStyle: {
            //     color: '#759aa0'
            // },
            // itemStyle: {
            //     color: '#759aa0'
            // },
            smooth: true
        }, {
            name: '积水深度',
            type: 'line',
            areaStyle: {},
            data: [],
            emphasis: {
                focus: 'series'
            },
            // areaStyle: {
            //     color: 'rgba(114, 137, 171, 0.5)'
            // },
            // lineStyle: {
            //     color: '#7289ab'
            // },
            // itemStyle: {
            //     color: '#7289ab'
            // },
            smooth: true
        }],
        // // 添加数据窗口控件
        // dataZoom: [{
        //     type: 'slider',
        //     start: 0,
        //     end: 100,
        //     height: 5, // 设置时间条的高度
        // }]
    };
    // 隐藏 Loading 动画
    myChart.hideLoading();

    // 动画开始函数
    function startAnimation(simulationResults) {
        intervalId = setInterval(function () {
            if (currentIndex < simulationResults.length) {
                var newAxisData = simulationResults[currentIndex][0];
                var newSeriesData1 = simulationResults[currentIndex][1];
                var newSeriesData2 = simulationResults[currentIndex][2];

                // 仅显示最后6个小时的数据，而不是逐渐累积数据
                if (option.xAxis.data.length >= 6) {
                    option.xAxis.data.shift();
                    option.series[0].data.shift();
                    option.series[1].data.shift();
                }

                option.xAxis.data.push(newAxisData);
                option.series[0].data.push(newSeriesData1);
                option.series[1].data.push(newSeriesData2);

                // 更新图表数据
                myChart.setOption(option);

                currentIndex++;
            } else {
                clearInterval(intervalId); // 停止当前动画

                // 动画完成后2秒显示24小时全部数据
                setTimeout(function() {
                    option.xAxis.data = simulationResults.map(item => item[0]);
                    option.series[0].data = simulationResults.map(item => item[1]);
                    option.series[1].data = simulationResults.map(item => item[2]);

                    // 更新图表以显示全部数据
                    myChart.setOption(option);
                }, 2000);
            }
        }, 1000);
    }
    // 调用startAnimation函数来开始动画
    // 请确保在这里或startAnimation函数外部提供simulationResults数据
    startAnimation(simulationResults);
}
function drawChart04(myChart4, simulateData4){
    myChart4.resize({
        height: 165
        });
    // 指定图表的配置项和数据
    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            // formatter: function(params) {
            //     return params.map(function (param) {
            //         // 根据系列名称添加单位
            //         let unit = '';
            //         switch (param.seriesName) {
            //             case '降水量':
            //                 unit = ' mm';
            //                 break;
            //             case '温度':
            //                 unit = ' °C';
            //                 break;
            //             case '相对湿度':
            //                 unit = ' %';
            //                 break;
            //             case '积水深度':
            //                 unit = ' mm';
            //                 break;
            //         }
            //         return param.seriesName + ': ' + param.value + unit;
            //     }).join('<br/>');
            // }
        },
    grid: {
        left: '15%',
        right: '15%',
        top: '19%', 
        bottom: '17%'
    },
    legend: {
        data: ['降水量', '温度', '相对湿度','积水深度'],
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: simulateData4.map(item => item.time),
        splitLine: {
            show: true,
        },
        axisLabel: {
            fontSize: 13,
            fontFamily: 'HarmonyOS' ,
            fontWeight: 100
        }
    },
    yAxis: [{
        type: 'value',
        name: '温度',
        position: 'left',
        axisLabel: {
            formatter: '{value} °C',
            fontSize: 13,
            fontFamily: 'HarmonyOS',
            fontWeight: 100
        },
        splitLine: { show: false }
    }, {
        type: 'value',
        name: '降水量 & 积水深度',
        position: 'right',
        axisLabel: {
            formatter: '{value} mm',
            fontSize: 13,
            fontFamily: 'HarmonyOS',
            fontWeight: 100
        },
        splitLine: { show: false }
    }, {
        type: 'value',
        position: 'right',
        offset: 80,
        show: false,
    }],
    series: [{
        name: '降水量',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: simulateData4.map(item => item.precip)
    }, {
        name: '温度',
        type: 'line',
        smooth: true,
        data: simulateData4.map(item => item.temp)
    }, {
        name: '相对湿度',
        type: 'line',
        yAxisIndex: 2,
        smooth: true,
        data: simulateData4.map(item => item.humidity)
    }, {
        name: '积水深度',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: simulateData4.map(item => item.waterDepth)
    }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart4.setOption(option);
}
// function drawLandUseRadius(myChart, landUse, cityname){
//     var landUseData = [
//         { value: landUse.arable_land, name: '耕地' },
//         { value: landUse.garden_land, name: '园地' },
//         { value: landUse.forest_land, name: '林地' },
//         { value: landUse.grassland, name: '草地' },
//         { value: landUse.wetland, name: '湿地' },
//         { value: landUse.transport_land, name: '交通运输用地' },
//         { value: landUse.urban_and_industrial_land, name: '城镇村及工矿用地' },
//         { value: landUse.water_and_water_facility_land, name: '水域及水利设施用地' }
//     ];
//     myChart.setOption({
//         title: {
//             text: cityname+'一级土地利用分类',
//             left: 'center',
//             top: 'bottom',
//             textStyle: {
//                 fontSize: 14,
//                 fontFamily: 'HarmonyOS' ,
//                 fontWeight: 500
//             }
//         },
//         tooltip: {
//             trigger: 'item',
//             formatter: '{a} <br/>{b}: {c} ({d}%)'
//         },
//         series: [
//             {
//                 name: '一级土地利用数据',
//                 type: 'pie',
//                 radius: [10, 70],
//                 roseType: 'radius', // 南丁格尔玫瑰图
//                 center: ['50%', '45%'],
//                 itemStyle: {
//                     borderRadius: 4,
//                     borderColor: 'rgba(51,51,51,1)',
//                     borderWidth: 1
//                 },
//                 label: {
//                     show: false
                    
//                 },
//                 emphasis: {
//                     label: {
//                         show: false
//                     }
//                 },
//                 data: landUseData
//             }
//         ]
//     });
// }