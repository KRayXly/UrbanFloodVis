// 原第一页面中国地图绘制参考
var map = new BMapGL.Map('map', {
    style: {
        styleJson: mapstyle
    }

});
// map.centerAndZoom(new BMapGL.Point(116.404, 39.925), 9);
map.disableScrollWheelZoom(true);
map.disableDragging(true);
map.setTilt(50);

var point = new BMapGL.Point(104.114129, 37.550339); // 设置地图中心点为中国地图的中心点
map.centerAndZoom(point, 5); // 设置地图缩放级别，5表示适中的缩放级别

// 中国34个省份列表
var provinces = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '香港特别行政区', '澳门特别行政区', '台湾省'];

// 用于存储所有省份的3D棱柱
var prismAll = [];

for (var p = 0; p < provinces.length; p++) {
    (function (province) {
        var bd1 = new BMapGL.Boundary();
        bd1.get(province, function (rs) {
            let count = rs.boundaries.length;
            for (let i = 0; i < count; i++) {
                let path = [];
                let str = rs.boundaries[i].replace(' ', '');
                let points = str.split(';');
                for (let j = 0; j < points.length; j++) {
                    let lng = points[j].split(',')[0];
                    let lat = points[j].split(',')[1];
                    path.push(new BMapGL.Point(lng, lat));
                }
                let prism = new BMapGL.Prism(path, 5000, {
                    topFillColor: '#5679ea',
                    topFillOpacity: 0.9,
                    sideFillColor: '#5679ea',
                    sideFillOpacity: 0.9
                });
                prismAll.push(prism); // 添加到prismAll列表中，以便后续操作
                
                // 绑定鼠标点击事件
                prism.addEventListener('click', function (e) {
                    // print(province);
                    // 获取被点击的3D棱柱的省份名称
                    var clickedProvince = province;
                    // 使用百度地图API获取该省份的中心点位置坐标
                    // var bdGeo = new BMapGL.Geocoder();
                    // bdGeo.getPoint(clickedProvince, function(point){
                    //     if (point) {
                    //         // 获取省份边界的矩形区域
                    //         var bounds = bdGeo.getBounds(); // 获取省份边界的矩形区域
                    //         // 获取矩形区域的上下左右最边界
                    //         var sw = bounds.getSouthWest(); // 矩形区域的西南角
                    //         var ne = bounds.getNorthEast(); // 矩形区域的东北角
                    //         // 计算中心点位置
                    //         var centerLng = (sw.lng + ne.lng) / 2; // 中心点经度
                    //         var centerLat = (sw.lat + ne.lat) / 2; // 中心点纬度
                    //         var centerPoint = new BMapGL.Point(centerLng, centerLat);
                    //         // 计算合适的放大级别
                    //         var zoomLevel = map.getViewport([sw, ne]).zoom; // 根据矩形区域自适应调整地图级别

                    //         // 放大地图到对应省份的位置，并确保整个省份区域都能显示在界面内
                    //         map.centerAndZoom(centerPoint, zoomLevel); 
                    //     } else {
                    //         console.log("您选择地址没有解析到结果！");
                    //     }
                    // }, clickedProvince);
                    map.clearOverlays();
                    var bdary = new BMapGL.Boundary();
                    bdary.get(clickedProvince, function (rs) {
                        var bounds = rs.boundaries[0]; // 获取省份的地理边界多边形
                        if (bounds) {
                            var polygon = new BMapGL.Polygon(bounds); // 创建多边形覆盖物
                            map.addOverlay(polygon); // 将多边形添加到地图上
                            map.setViewport(polygon.getPath()); // 根据多边形的路径自适应调整地图视野
                            // 将地图放大一个层级
                            var zoomLevel = map.getZoom() + 2.5; // 获取当前地图缩放级别并加一
                            // 将地图中心点设置为省份地理边界的中心点
                            var bounds = polygon.getBounds(); // 获取省份地理边界的矩形区域
                            var centerPoint = bounds.getCenter(); // 获取矩形区域的中心点坐标

                            map.centerAndZoom(centerPoint, zoomLevel); 
                        }
                        // 绘制行政区
                        for (var i = 0; i < rs.boundaries.length; i++) {
                            var xyArr = rs.boundaries[i].split(';');
                            var ptArr = [];
                            for (var j = 0; j < xyArr.length; j++) {
                                var tmp = xyArr[j].split(',');
                                var pt = new BMapGL.Point(tmp[0], tmp[1]);
                                ptArr.push(pt);
                            }
                            var mapmask = new BMapGL.MapMask(ptArr, {
                                showRegion: 'inside', // 显示区域范围以内部分
                                isBuildingMask: true, // 楼块是否参与掩膜
                                isPoiMask: true, // poi标注是否参与掩膜
                                isMapMask: true, // 底图是否参与掩膜
                            });
                            map.addOverlay(mapmask);
                            // var border = new BMapGL.Polyline(ptArr, {
                            //     strokeColor: '#4ca7a2',
                            //     strokeWeight: 3,
                            //     strokeOpacity: 1
                            // });
                            // map.addOverlay(border);
                        }
                    });
                });

                // 绑定鼠标移入事件
                prism.addEventListener('mouseover', function (e) {
                    e.target.setTopFillColor('#ffffff');
                    e.target.setTopFillOpacity(0);
                });

                // 绑定鼠标移出事件
                prism.addEventListener('mouseout', function (e) {
                    e.target.setTopFillColor('#5679ea');
                    e.target.setTopFillOpacity(0.9);
                });
            }
        });
    })(provinces[p]);
}
function hideNonProvinceAreas() {
    map.clearOverlays();
    drawBoundary();
    for (var i = 0; i < prismAll.length; i++) {
        map.addOverlay(prismAll[i]); // 将保存的3D棱柱重新添加到地图上
    }
}

// 页面加载完成后调用隐藏非省份区域的函数
window.onload = function () {
    // 设置中国地图的南北边界经纬度
    var southWest = new BMapGL.Point(72.004, 0.829);
    var northEast = new BMapGL.Point(137.8347, 55.8271);

    // 调整地图视野，使中国地图的南北边界均出现在网页范围内
    map.setViewport([southWest, northEast]);
    hideNonProvinceAreas();
};
function drawBoundary() {

    /*画遮蔽层的相关方法
    *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
    *      这样就做出了一个经过多次西北角的闭合多边形*/
    //定义中国东南西北端点，作为第一层
    //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
    var pStart = new BMapGL.Point(180,90);
    var pEnd = new BMapGL.Point(0,-90);
    var pArray = [
        new BMapGL.Point(pStart.lng,pStart.lat),
        new BMapGL.Point(pEnd.lng,pStart.lat),
        new BMapGL.Point(pEnd.lng,pEnd.lat),
        new BMapGL.Point(pStart.lng,pEnd.lat)];
    //循环添加各闭合区域
    pArray.push(new BMapGL.Point(135.077218,48.544352));
    pArray.push(new BMapGL.Point(134.92218,48.584352))
    pArray.push(new BMapGL.Point(134.827218,48.534352))
    pArray.push(new BMapGL.Point(134.727669,48.495377));
    pArray.push(new BMapGL.Point(134.304531,48.394091));
    pArray.push(new BMapGL.Point(133.513447,48.177476));
    pArray.push(new BMapGL.Point(132.832747,48.054205));
    pArray.push(new BMapGL.Point(132.519993,47.789172));
    pArray.push(new BMapGL.Point(131.765704,47.813962));
    pArray.push(new BMapGL.Point(131.103402,47.776772));
    pArray.push(new BMapGL.Point(130.919429,48.331824));
    pArray.push(new BMapGL.Point(130.77225,48.868729));
    pArray.push(new BMapGL.Point(129.907577,49.351849));
    pArray.push(new BMapGL.Point(128.73015,49.699156));
    pArray.push(new BMapGL.Point(127.791888,49.85404));
    pArray.push(new BMapGL.Point(127.791888,50.492084));
    pArray.push(new BMapGL.Point(126.927215,51.616759));
    pArray.push(new BMapGL.Point(126.467283,52.579818));
    pArray.push(new BMapGL.Point(125.952158,53.059077));
    pArray.push(new BMapGL.Point(124.701142,53.313247));
    pArray.push(new BMapGL.Point(123.56051,53.664362));
    pArray.push(new BMapGL.Point(121.555204,53.46722));
    pArray.push(new BMapGL.Point(120.340983,53.125528));
    pArray.push(new BMapGL.Point(119.95464,52.579818));
    pArray.push(new BMapGL.Point(120.616942,52.523746));
    pArray.push(new BMapGL.Point(120.506559,52.095236));
    pArray.push(new BMapGL.Point(119.862653,51.616759));
    pArray.push(new BMapGL.Point(119.365926,50.959196));
    pArray.push(new BMapGL.Point(119.089967,50.362806));
    pArray.push(new BMapGL.Point(119.108364,50.05583));
    pArray.push(new BMapGL.Point(118.133307,49.925357));
    pArray.push(new BMapGL.Point(117.471005,49.794528));
    pArray.push(new BMapGL.Point(116.808702,49.889712));
    pArray.push(new BMapGL.Point(116.385564,49.758785));
    pArray.push(new BMapGL.Point(115.962426,48.953617));
    pArray.push(new BMapGL.Point(115.520891,48.147476));
    pArray.push(new BMapGL.Point(115.796851,47.677465));
    pArray.push(new BMapGL.Point(116.27518,47.652609));
    pArray.push(new BMapGL.Point(117.103059,47.652609));
    pArray.push(new BMapGL.Point(118.004526,47.801568));
    pArray.push(new BMapGL.Point(118.887596,47.577968));
    pArray.push(new BMapGL.Point(119.402721,47.127871));
    pArray.push(new BMapGL.Point(119.402721,46.800397));
    pArray.push(new BMapGL.Point(118.464459,46.825659));
    pArray.push(new BMapGL.Point(117.103059,46.648575));
    pArray.push(new BMapGL.Point(115.980824,46.088213));
    pArray.push(new BMapGL.Point(115.226534,45.702829));
    pArray.push(new BMapGL.Point(114.159491,45.275796));
    pArray.push(new BMapGL.Point(112.761297,45.171782));
    pArray.push(new BMapGL.Point(111.639061,45.132727));
    pArray.push(new BMapGL.Point(111.436691,44.55683));
    pArray.push(new BMapGL.Point(111.51028,44.001703));
    pArray.push(new BMapGL.Point(110.682402,43.387647));
    pArray.push(new BMapGL.Point(108.897864,42.658724));
    pArray.push(new BMapGL.Point(106.892559,42.522781));
    pArray.push(new BMapGL.Point(103.82021,42.140555));
    pArray.push(new BMapGL.Point(102.422016,42.536389));
    pArray.push(new BMapGL.Point(101.336575,42.82146));
    pArray.push(new BMapGL.Point(99.478448,42.929712));
    pArray.push(new BMapGL.Point(97.601924,42.997272));
    pArray.push(new BMapGL.Point(96.019756,43.815487));
    pArray.push(new BMapGL.Point(92.72664,45.288784));
    pArray.push(new BMapGL.Point(91.144473,45.599605));
    pArray.push(new BMapGL.Point(91.457227,46.483616));
    pArray.push(new BMapGL.Point(90.794924,47.553064));
    pArray.push(new BMapGL.Point(89.562305,48.221295));
    pArray.push(new BMapGL.Point(88.2377,48.953617));
    pArray.push(new BMapGL.Point(87.722576,49.279683));
    pArray.push(new BMapGL.Point(87.097067,49.255604));
    pArray.push(new BMapGL.Point(86.60034,49.122957));
    pArray.push(new BMapGL.Point(86.177203,48.710696));
    pArray.push(new BMapGL.Point(85.533297,48.344091));
    pArray.push(new BMapGL.Point(85.404516,47.875888));
    pArray.push(new BMapGL.Point(85.349324,47.390897));
    pArray.push(new BMapGL.Point(84.926186,47.215692));
    pArray.push(new BMapGL.Point(83.233635,47.315881));
    pArray.push(new BMapGL.Point(82.865689,47.328391));
    pArray.push(new BMapGL.Point(82.258578,45.844449));
    pArray.push(new BMapGL.Point(82.368962,45.366651));
    pArray.push(new BMapGL.Point(82.093003,45.30177));
    pArray.push(new BMapGL.Point(80.989165,45.275796));
    pArray.push(new BMapGL.Point(79.903724,45.015402));
    pArray.push(new BMapGL.Point(80.326862,44.332772));
    pArray.push(new BMapGL.Point(80.510835,43.642047));
    pArray.push(new BMapGL.Point(80.621219,43.186043));
    pArray.push(new BMapGL.Point(80.27167,43.010775));
    pArray.push(new BMapGL.Point(79.885327,42.304653));
    pArray.push(new BMapGL.Point(79.259819,41.838593));
    pArray.push(new BMapGL.Point(78.487133,41.576647));
    pArray.push(new BMapGL.Point(77.916816,41.341363));
    pArray.push(new BMapGL.Point(77.272911,41.16086));
    pArray.push(new BMapGL.Point(76.739389,41.02167));
    pArray.push(new BMapGL.Point(76.26106,40.546202));
    pArray.push(new BMapGL.Point(75.672346,40.75639));
    pArray.push(new BMapGL.Point(74.881262,40.630357));
    pArray.push(new BMapGL.Point(74.255754,40.293095));
    pArray.push(new BMapGL.Point(73.777425,39.939968));
    pArray.push(new BMapGL.Point(73.74063,39.556517));
    pArray.push(new BMapGL.Point(73.53826,39.34256));
    pArray.push(new BMapGL.Point(73.685438,38.725549));
    pArray.push(new BMapGL.Point(74.034987,38.407771));
    pArray.push(new BMapGL.Point(74.458125,38.335352));
    pArray.push(new BMapGL.Point(74.734084,38.074036));
    pArray.push(new BMapGL.Point(74.844468,37.577865));
    pArray.push(new BMapGL.Point(74.678892,37.21089));
    pArray.push(new BMapGL.Point(74.6237,36.975076));
    pArray.push(new BMapGL.Point(75.414784,36.501232));
    pArray.push(new BMapGL.Point(75.801127,35.934721));
    pArray.push(new BMapGL.Point(76.518622,35.379154));
    pArray.push(new BMapGL.Point(77.309706,35.137703));
    pArray.push(new BMapGL.Point(77.972008,34.758986));
    pArray.push(new BMapGL.Point(78.376749,34.241106));
    pArray.push(new BMapGL.Point(78.523927,33.473647));
    pArray.push(new BMapGL.Point(78.7079,32.978834));
    pArray.push(new BMapGL.Point(78.450338,32.745921));
    pArray.push(new BMapGL.Point(78.30316,32.340745));
    pArray.push(new BMapGL.Point(78.431941,32.04349));
    pArray.push(new BMapGL.Point(78.671106,31.572152));
    pArray.push(new BMapGL.Point(78.855079,31.145879));
    pArray.push(new BMapGL.Point(79.425395,30.797108));
    pArray.push(new BMapGL.Point(80.087697,30.447053));
    pArray.push(new BMapGL.Point(81.301919,29.855455));
    pArray.push(new BMapGL.Point(81.90903,30.0157));
    pArray.push(new BMapGL.Point(82.7921,29.485907));
    pArray.push(new BMapGL.Point(84.539843,28.661613));
    pArray.push(new BMapGL.Point(85.71727,28.124721));
    pArray.push(new BMapGL.Point(86.821108,27.732537));
    pArray.push(new BMapGL.Point(87.998535,27.69979));
    pArray.push(new BMapGL.Point(88.568851,27.716165));
    pArray.push(new BMapGL.Point(88.863208,27.108656));
    pArray.push(new BMapGL.Point(89.580703,27.190949));
    pArray.push(new BMapGL.Point(89.654292,27.765274));
    pArray.push(new BMapGL.Point(90.923705,27.650651));
    pArray.push(new BMapGL.Point(91.751584,27.223849));
    pArray.push(new BMapGL.Point(92.04594,26.778874));
    pArray.push(new BMapGL.Point(92.965805,26.646689));
    pArray.push(new BMapGL.Point(93.830478,26.960375));
    pArray.push(new BMapGL.Point(94.860727,27.453873));
    pArray.push(new BMapGL.Point(96.185332,27.798001));
    pArray.push(new BMapGL.Point(97.123594,27.503101));
    pArray.push(new BMapGL.Point(97.620321,27.896122));
    pArray.push(new BMapGL.Point(97.675513,28.059457));
    pArray.push(new BMapGL.Point(98.080254,27.306056));
    pArray.push(new BMapGL.Point(98.595378,27.009824));
    pArray.push(new BMapGL.Point(98.393008,26.066566));
    pArray.push(new BMapGL.Point(97.804294,25.483523));
    pArray.push(new BMapGL.Point(97.528335,24.847254));
    pArray.push(new BMapGL.Point(97.417951,24.10637));
    pArray.push(new BMapGL.Point(97.804294,23.717348));
    pArray.push(new BMapGL.Point(98.595378,23.886634));
    pArray.push(new BMapGL.Point(98.834543,23.123105));
    pArray.push(new BMapGL.Point(99.239283,22.697005));
    pArray.push(new BMapGL.Point(99.165694,22.303805));
    pArray.push(new BMapGL.Point(99.386462,21.857966));
    pArray.push(new BMapGL.Point(100.251135,21.445169));
    pArray.push(new BMapGL.Point(100.839848,21.290063));
    pArray.push(new BMapGL.Point(101.704521,21.031186));
    pArray.push(new BMapGL.Point(102.05407,21.152053));
    pArray.push(new BMapGL.Point(101.998878,21.582901));
    pArray.push(new BMapGL.Point(101.962083,22.132497));
    pArray.push(new BMapGL.Point(102.587591,22.355156));
    pArray.push(new BMapGL.Point(103.599443,22.338041));
    pArray.push(new BMapGL.Point(104.482513,22.560368));
    pArray.push(new BMapGL.Point(105.383981,22.799392));
    pArray.push(new BMapGL.Point(106.083078,22.59454));
    pArray.push(new BMapGL.Point(106.469421,22.286683));
    pArray.push(new BMapGL.Point(106.874162,21.754879));
    pArray.push(new BMapGL.Point(107.315697,21.514051));
    pArray.push(new BMapGL.Point(107.812424,21.410715));
    pArray.push(new BMapGL.Point(107.775629,21.134792));
    pArray.push(new BMapGL.Point(106.929353,20.269201));
    pArray.push(new BMapGL.Point(106.175064,19.17158));
    pArray.push(new BMapGL.Point(106.377435,18.470789));
    pArray.push(new BMapGL.Point(107.297299,17.23746));
    pArray.push(new BMapGL.Point(109.008248,15.675143));
    pArray.push(new BMapGL.Point(109.688948,13.705222));
    pArray.push(new BMapGL.Point(109.652153,11.664031));
    pArray.push(new BMapGL.Point(108.750686,9.571001));
    pArray.push(new BMapGL.Point(108.198767,6.876803));
    pArray.push(new BMapGL.Point(108.493124,5.090099));
    pArray.push(new BMapGL.Point(109.817729,3.612656));
    pArray.push(new BMapGL.Point(111.10554,3.298351));
    pArray.push(new BMapGL.Point(114.71141,5.514272));
    pArray.push(new BMapGL.Point(116.256783,7.556636));
    pArray.push(new BMapGL.Point(118.758815,10.883133));
    pArray.push(new BMapGL.Point(119.531502,13.669242));
    pArray.push(new BMapGL.Point(119.494707,16.617614));
    pArray.push(new BMapGL.Point(120.414572,18.961654));
    pArray.push(new BMapGL.Point(121.51841,20.633358));
    pArray.push(new BMapGL.Point(122.751029,22.303805));
    pArray.push(new BMapGL.Point(123.247756,23.378111));
    pArray.push(new BMapGL.Point(124.811526,25.68375));
    pArray.push(new BMapGL.Point(126.577667,25.900278));
    pArray.push(new BMapGL.Point(127.479134,26.67975));
    pArray.push(new BMapGL.Point(128.454191,28.189945));
    pArray.push(new BMapGL.Point(128.766945,29.93561));
    pArray.push(new BMapGL.Point(128.73015,31.650877));
    pArray.push(new BMapGL.Point(127.957464,32.153119));
    pArray.push(new BMapGL.Point(127.221572,32.745921));
    pArray.push(new BMapGL.Point(127.019202,33.596907));
    pArray.push(new BMapGL.Point(125.988953,33.827543));
    pArray.push(new BMapGL.Point(125.731391,34.546135));
    pArray.push(new BMapGL.Point(125.878569,35.454458));
    pArray.push(new BMapGL.Point(125.731391,36.634799));
    pArray.push(new BMapGL.Point(125.80498,37.51927));
    pArray.push(new BMapGL.Point(124.425183,37.972159));
    pArray.push(new BMapGL.Point(124.498772,38.58128));
    pArray.push(new BMapGL.Point(125.013896,39.242487));
    pArray.push(new BMapGL.Point(124.590758,39.471014));
    pArray.push(new BMapGL.Point(124.296402,39.840762));
    pArray.push(new BMapGL.Point(124.388388,40.081441));
    pArray.push(new BMapGL.Point(124.940307,40.335346));
    pArray.push(new BMapGL.Point(125.731391,40.630357));
    pArray.push(new BMapGL.Point(126.448885,40.96591));
    pArray.push(new BMapGL.Point(126.798434,41.493704));
    pArray.push(new BMapGL.Point(127.111188,41.410654));
    pArray.push(new BMapGL.Point(127.883875,41.271998));
    pArray.push(new BMapGL.Point(128.490985,41.452192));
    pArray.push(new BMapGL.Point(128.307012,41.879854));
    pArray.push(new BMapGL.Point(128.950918,41.921089));
    pArray.push(new BMapGL.Point(129.484439,42.12686));
    pArray.push(new BMapGL.Point(129.999564,42.549994));
    pArray.push(new BMapGL.Point(130.073153,42.807915));
    pArray.push(new BMapGL.Point(130.404304,42.495557));
    pArray.push(new BMapGL.Point(130.77225,42.359256));
    pArray.push(new BMapGL.Point(130.698661,42.726583));
    pArray.push(new BMapGL.Point(131.195388,42.848541));
    pArray.push(new BMapGL.Point(131.360964,43.494895));
    pArray.push(new BMapGL.Point(131.342566,44.491021));
    pArray.push(new BMapGL.Point(131.820896,45.002351));
    pArray.push(new BMapGL.Point(132.998323,44.976239));
    pArray.push(new BMapGL.Point(133.623831,45.599605));
    pArray.push(new BMapGL.Point(134.102161,46.394582));
    pArray.push(new BMapGL.Point(134.37812,47.228226));
    pArray.push(new BMapGL.Point(134.874847,47.851127));
    pArray.push(new BMapGL.Point(134.985231,48.233588));
    pArray.push(new BMapGL.Point(135.13241,48.454352));
    pArray.push(new BMapGL.Point(135.077218,48.474352));

    // 创建区域掩膜实例
    var mapmask = new BMapGL.MapMask(pArray, {
        showRegion: 'outside', // 显示区域范围以内部分
        isBuildingMask: true, // 楼块是否参与掩膜
        isPoiMask: true, // poi标注是否参与掩膜
        isMapMask: true, // 底图是否参与掩膜
    });
    // 将区域掩膜添加到地图上，实现掩膜效果
    map.addOverlay(mapmask);
    map.addOverlay(mapmask);

    pStart = new BMapGL.Point(180,90);
    pEnd = new BMapGL.Point(0,-90);
    pArray = [
        new BMapGL.Point(135.077218,48.454352),
        new BMapGL.Point(pStart.lng,pStart.lat),
        new BMapGL.Point(pStart.lng,pEnd.lat),
        new BMapGL.Point(135.077218,48.454352)];
    var sanjiaoxing = new BMapGL.MapMask(pArray, {
        showRegion: 'outside', // 显示区域范围以内部分
        isBuildingMask: true, // 楼块是否参与掩膜
        isPoiMask: true, // poi标注是否参与掩膜
        isMapMask: true // 底图是否参与掩膜
    });
    map.addOverlay(sanjiaoxing);
}


// // 绑定鼠标事件到每个棱柱上
// for (var i = 0; i < prismAll.length; i++) {
//     var prism = prismAll[i];
//     var events = ['click', 'mouseover', 'mouseout'];
//     for (var j = 0; j < events.length; j++) {
//         prism.addEventListener(events[j], function(e) {
//             switch (e.type) {
//                 case 'click':
//                     alert("chenggong");
//                     break;
//                 case 'mouseover':
//                     e.target.setTopFillColor('#ffffff');
//                     e.target.setTopFillOpacity(1);
//                     break;
//                 case 'mouseout':
//                     e.target.setTopFillColor('#5679ea');
//                     e.target.setTopFillOpacity(0.5);
//                     break;
//             }
//         });
//     }
// }
