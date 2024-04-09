//中国地图绘制
function drawChinaMap(myChart, mydata) {
    // 显示 Loading 动画
    myChart.showLoading();
    // 设置地图配置项和数据
    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                // params 中包含了鼠标悬停的数据项信息，可以根据需要进行定制
                return params.name + '<br/>' + '易积水点数量 :  ' + params.value;
            },
            textStyle: {
                color: '#333333',
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100,
            },
        },
        visualMap: {
            show: true, // 显示visualMap组件
            min: 0,
            max: 2600,
            left: '25%', // 控制visualMap组件的水平位置
            bottom: '3%', // 控制visualMap组件的垂直位置
            text: ['High', 'Low'], // 映射的文本，分别对应高值和低值
            calculable: true, // 是否显示拖拽手柄，允许用户选择值的范围

            textStyle: {
                color: '#fff' // 文本颜色
            }
        },
        series: [
            {
                type: 'map',
                map: 'china',
                top: '10%' ,
                left: '36%' ,
                aspectScale: 0.85, //长宽比
                zoom: 1.16, //放大缩小
                roam: false, //鼠标缩放关闭
                itemStyle: {
                    borderColor: '#eeeeee',
                    borderWidth: 2,   
                },
                emphasis: {
                    label: {
                        show: true,
                        textStyle: {
                            color: '#333333',
                            fontFamily: 'HarmonyOS' ,
                            fontWeight: 300,
                            fontSize: 18
                        }
                    },
                    itemStyle: {
                        areaColor: '#eeeeee', // 高亮颜色
                        borderColor: '#eeeeee',
                        borderWidth: 2,       
                    }
                },
                label: {
                    show: false
                },
                selectedMode:"single",
                select:{//点击后样式
                    label: {
                        show: true,
                        color: '#303030',
                        fontFamily: 'HarmonyOS',
                        fontWeight: 700,
                        fontSize: 14,
                    },
                    itemStyle: {
                        areaColor: "rgba(240, 255, 255, .9)",
                    },
                },
                data: mydata
            }
        ],
        geo: [
            {
                type: 'map',
                map: 'china',
                top: '11%' ,
                left: '37%' ,
                aspectScale: 0.85, //长宽比
                zoom: 1.2, 
                roam: false, //鼠标缩放关闭
                z: -5,
                regions: [
                    { // 隐藏南海诸岛
                        name: '南海诸岛',
                        itemStyle: {
                            normal: {
                                opacity: 0 //不绘制该图形
                            }
                        },
                        label: {
                            show: false
                        }
                    }
                ],
                itemStyle: {
                    areaColor: '#101010',
                    borderColor: '#101010',
                    emphasis: {
                        areaColor: '#101010',
                        borderColor: '#101010',
                    },
                },
                label: {
                    emphasis: {
                        show: false,
                    },
                },
                tooltip: {
                    show: false
                },
            },
        ]
    };

    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(option);
    // 隐藏 Loading 动画
    myChart.hideLoading();
}
function drawCityMap(myChart, fullname){
    // 显示 Loading 动画
    myChart.showLoading();
    myChart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                // params 中包含了鼠标悬停的数据项信息，可以根据需要进行定制
                return params.name;
            },
            textStyle: {
                color: '#333333',
                fontFamily: 'HarmonyOS' ,
                fontWeight: 100,
            },
            borderWidth: 0, // 设置边框宽度为 2
            position: function (pos, params, dom, rect, size) {
                // 使 Tooltip 框始终出现在鼠标右下方
                var obj = { top: pos[1] + 10, left: pos[0] + 10 };
                return obj;
            }
        },
        series: [{
            type: 'map',
            map: fullname,
            aspectScale: 0.85, //长宽比
            layoutCenter: ['50%', '50%'], // 设置地图在容器中的位置为中心
            layoutSize: '99%', // 设置地图的大小为容器的 100%
            itemStyle: {
                borderColor: '#eeeeee',
                borderWidth: 2,
                areaColor: '#759aa0'
            },
            label: {
                show: false, // 控制是否显示城市名称

            },
            emphasis: { // 鼠标经过样式
                label: {
                    show: false, // 鼠标经过时显示城市名称
                },
                itemStyle: {
                    borderColor: '#eeeeee',
                    borderWidth: 1,
                    areaColor: '#eeeeee' // 鼠标经过时的区域颜色
                }
            },
            selectedMode:"single",
            select:{//点击后样式
                label: {
                    show: true,
                    color: '#303030',
                    fontFamily: 'HarmonyOS',
                    fontWeight: 700,
                    fontSize: 14,
                    textBorderColor: '#eeeeee',
                    textBorderWidth: 2,
                    textBorderType: 'solid'
                },
                itemStyle: {
                    areaColor: "rgba(240, 255, 255, .9)",
                },
            },
        }],
        geo: [{
            type: 'map',
            map: fullname,
            roam: false,
            aspectScale: 0.85, //长宽比
            layoutCenter: ['52%', '52%'], // 设置地图在容器中的位置为中心
            layoutSize: '101%', // 设置地图的大小为容器的 100%
            z: -5,

            regions: [{ // 隐藏南海诸岛
                name: '南海诸岛',
                itemStyle: {
                    normal: {
                        opacity: 0 //不绘制该图形
                    }
                },
                label: {
                    show: false
                }
            }],
            itemStyle: {
                areaColor: '#101010',
                borderColor: '#101010',
                emphasis: {
                    areaColor: '#101010',
                    borderColor: '#101010',
                },
            },
            label: {
                emphasis: {
                    show: false,
                },
            },
            tooltip: {
                show: false
            },
        }]
    });
    // 隐藏 Loading 动画
    myChart.hideLoading();
}