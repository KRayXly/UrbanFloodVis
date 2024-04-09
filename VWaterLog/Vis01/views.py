from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from pyecharts.render import make_snapshot
from snapshot_selenium import snapshot as driver
from pyecharts import options as opts
from pyecharts.charts import Map

from pyecharts.charts import BMap
from pyecharts.faker import Faker

from .models import User  # 导入User模型
from .models import Province, City, District, WaterPoint, LandUse, Terrain
from django.db.models import Count
import requests


import base64
from django.views.decorators.csrf import csrf_exempt
# # Create your views here.
# def loadp(request):
#     return render(request,"loadp.html")


def loadp(request):
    # 查询每个省份的易积水点总数量，并将结果传递给模板
    provinces_data = []

    # 使用 annotate() 函数进行多级关联查询并计数
    provinces = Province.objects.annotate(
        num_waterpoints=Count('city__district__waterpoint')
    )

    for province in provinces:
        provinces_data.append({
            'province_shortname': province.short_name,
            'province_name': province.name,
            'num_waterpoints': province.num_waterpoints
        })

    # 对省份数据按照易积水点数量进行降序排序
    sorted_provinces = sorted(provinces_data, key=lambda x: x['num_waterpoints'], reverse=True)

    # 获取易积水点数量最高的五个省份
    top_five_provinces = sorted_provinces[:5]

    total_waterpoints = 0
    for province in provinces_data:
        total_waterpoints += province['num_waterpoints']

    # 将查询结果传递给模板
    return render(request, 'loadp.html', {'provinces_data': provinces_data, 'top_five_provinces': top_five_provinces, 'total_waterpoints': total_waterpoints})

def citymap(request):
    return render(request, 'citymap.html')

def welcome(request):
    return render(request, 'welcome.html')

def get_city_waterpoints(request):
    fullname = request.GET.get('fullname')  # 获取前端传递的省份全称参数

    # 查询对应省份下的城市名称和每个城市易积水点数量之和
    city_waterpoints = City.objects.filter(province__name=fullname).annotate(
        total_waterpoints=Count('district__waterpoint')
    ).values('name', 'total_waterpoints')

    # 将查询结果转换为字典列表并返回
    results = list(city_waterpoints)
    return JsonResponse(results, safe=False)

def get_area_points(request):
    if request.method == 'GET':
        city_name = request.GET.get('cityname')

        # 查询杭州市对应的所有区域名称
        districts = District.objects.filter(city_geocode__name=city_name).values_list('name', flat=True)

        # 查询杭州市对应的所有易积水点位的经度和纬度
        water_points = WaterPoint.objects.filter(district_geocode__city_geocode__name=city_name).values('longitude', 'latitude')

        # 将结果转换为列表形式
        district_names = list(districts)
        water_points_list = list(water_points)

        # 构造响应数据
        response_data = {
            'district_names': district_names,
            'water_points': water_points_list
        }

        # 返回 JSON 响应
        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'})

def get_city_data(request):
    if request.method == 'GET':
        city_name = request.GET.get('cityname')
        if city_name:
            try:
                # 查询城市对应的 LandUse 和 Terrain 数据
                city_data = City.objects.get(name=city_name)
                land_use_data = LandUse.objects.get(city_geocode=city_data.geocode)
                terrain_data = Terrain.objects.get(city_geocode=city_data.geocode)
                
                # 构建返回数据
                response_data = {
                    'city_name': city_name,
                    'land_use': {
                        'arable_land': land_use_data.arable_land,
                        'garden_land': land_use_data.garden_land,
                        'forest_land': land_use_data.forest_land,
                        'grassland': land_use_data.grassland,
                        'wetland': land_use_data.wetland,
                        'transport_land': land_use_data.transport_land,
                        'urban_and_industrial_land': land_use_data.urban_and_industrial_land,
                        'water_and_water_facility_land': land_use_data.water_and_water_facility_land
                    },
                    'terrain': {
                        'plain': terrain_data.plain,
                        'mountain': terrain_data.mountain,
                        'hill': terrain_data.hill,
                        'desert': terrain_data.desert,
                        'water_body': terrain_data.water_body
                    }
                }
                
                return JsonResponse(response_data)
            except City.DoesNotExist:
                return JsonResponse({'error': f'City "{city_name}" not found'}, status=404)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'City name parameter is required'}, status=400)
    else:
        return JsonResponse({'error': 'Only GET method is allowed'}, status=405)

def user_info(request):
    if request.method == 'POST':
        username = request.POST.get('username', '')
        print("Received username:", username)  # 输出用户名
        try:
            user = User.objects.get(username=username)
            password = user.password
            phone = user.phone
            print("Password:", password)  # 输出密码
            print("Phone:", phone)  # 输出手机号
            return render(request, 'loadp.html', {'username': username, 'password': password, 'phone': phone})
        except User.DoesNotExist:
            return render(request, 'loadp.html', {'error_message': 'User does not exist'})
    return render(request, 'loadp.html')

def get_hos_count(city_name):
    # 百度地图API的AK（Access Key），需要替换为您自己的AK
    ak = "8siofvmlpTcCQFOEPJ0w023GXWig7J3k"
    # 地点检索API的URL
    url = "http://api.map.baidu.com/place/v2/search"
    # 查询参数
    params = {
        "query": "医疗",
        "region": city_name,
        "output": "json",
        "page_size": 20,
        "page_num": 0,
        "ak": ak
    }
    try:
        # 发送请求
        response = requests.get(url=url, params=params)
        # 解析响应数据
        data = response.json()
        # print(data);
        # 提取大学数量
        university_count = data.get('total', 10000)
        return university_count
    except Exception as e:
        print("Error:", e)
        return 0
def get_school_count(city_name):
    # 百度地图API的AK（Access Key），需要替换为您自己的AK
    ak = "8siofvmlpTcCQFOEPJ0w023GXWig7J3k"
    # 地点检索API的URL
    url = "http://api.map.baidu.com/place/v2/search"
    # 查询参数
    params = {
        "query": "教育培训",
        "region": city_name,
        "output": "json",
        "page_size": 20,
        "page_num": 0,
        "ak": ak
    }
    try:
        # 发送请求
        response = requests.get(url=url, params=params)
        # 解析响应数据
        data = response.json()
        # print(data);
        # 提取大学数量
        university_count = data.get('total', 10000)
        return university_count
    except Exception as e:
        print("Error:", e)
        return 0
def get_house_count(city_name):
    # 百度地图API的AK（Access Key），需要替换为您自己的AK
    ak = "8siofvmlpTcCQFOEPJ0w023GXWig7J3k"
    # 地点检索API的URL
    url = "http://api.map.baidu.com/place/v2/search"
    # 查询参数
    params = {
        "query": "住宅区",
        "region": city_name,
        "output": "json",
        "page_size": 20,
        "page_num": 0,
        "ak": ak
    }
    try:
        # 发送请求
        response = requests.get(url=url, params=params)
        # 解析响应数据
        data = response.json()
        # 提取大学数量
        university_count = data.get('total', 10000)
        return university_count
    except Exception as e:
        print("Error:", e)
        return 0
def get_facility_count(request):
    if request.method == 'GET':
        city_name = request.GET.get('cityname')
        if city_name:
            school_count = get_school_count(city_name)
            hospital_count = get_hos_count(city_name)
            house_count = get_house_count(city_name)
            return JsonResponse({'school_count': school_count, 'hospital_count': hospital_count, 'house_count': house_count })
        else:
            return JsonResponse({'error': 'City name parameter is required'}, status=400)
    else:
        return JsonResponse({'error': 'Only GET method is allowed'}, status=405)

def get_facility_countall(request):
    if request.method == 'GET':
        city_name_list = request.GET.getlist('citynamelist[]')
        if city_name_list:
            house_count = 0
            school_count = 0
            hospital_count = 0
            for city_name in city_name_list:
                # 在这里执行您的逻辑来获取每个城市的住宅区、医院和学校数量
                house_count += get_house_count(city_name)
                school_count += get_school_count(city_name)
                hospital_count += get_hos_count(city_name)
            # 返回一个包含所有城市的总数的 JsonResponse 对象
            return JsonResponse({
                'house_count_total': house_count,
                'school_count_total': school_count,
                'hospital_count_total': hospital_count
            })
        else:
            return JsonResponse({'error': 'City name list parameter is required'}, status=400)
    else:
        return JsonResponse({'error': 'Only GET method is allowed'}, status=405)

def get_weather(request):
    if request.method == 'GET':
        location = request.GET.get('location')
        api_key = '8d77c32f60374816bd6f32c0ffe6c2a4'
        url = f'https://api.qweather.com/v7/weather/now?location={location}&key={api_key}'
        response = requests.get(url)
        data = response.json()
        weather_info = {
            'temperature': data['now']['temp'],
            'condition_icon': data['now']['icon'],
            'condition_text': data['now']['text'],
            'wind_direction': data['now']['windDir'],
            'wind_scale': data['now']['windScale'],
            'wind_speed': data['now']['windSpeed'],
            'humidity': data['now']['humidity'],
            'precipitation': data['now']['precip']
        }
        return JsonResponse(weather_info)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'})

def get_hourly_precipitation(request):
    if request.method == 'GET':
        location = request.GET.get('location')
        api_key = '8d77c32f60374816bd6f32c0ffe6c2a4'
        url = f'https://api.qweather.com/v7/weather/24h?location={location}&key={api_key}'
        
        response = requests.get(url)
        data = response.json()

        # Initialize an empty list to hold our forecast data
        precipitation_forecast = []

        # Loop through each hourly forecast
        for hourly_data in data['hourly']:
            # Extract the forecast time and format it
            fx_time_str = hourly_data['fxTime']
            # The format of fx_time_str is "2021-02-16T21:00+08:00", we need to extract "21:00" from this
            forecast_time = fx_time_str[11:16]

            # Extract the hourly precipitation amount
            precip = hourly_data['precip']

            # Append the forecast time and precipitation to our list
            precipitation_forecast.append((forecast_time, precip))

        return JsonResponse({'forecast': precipitation_forecast})
    else:
        return JsonResponse({'error': 'Invalid HTTP method'})

# https://api.qweather.com/v7/warning/now?location=116.41,39.92&lang=zh&key=8d77c32f60374816bd6f32c0ffe6c2a4
def get_weather_warning(request):
    location = request.GET.get('location')
    api_key = '8d77c32f60374816bd6f32c0ffe6c2a4'
    lang = 'zh'
    url = f'https://api.qweather.com/v7/warning/now?location={location}&lang={lang}&key={api_key}'

    try:
        response = requests.get(url)
        data = response.json()

        if data['code'] == "200" and data['warning']:
            warning = data['warning'][0]  # Assuming we take the first warning if multiple are returned
            formatted_pubTime = warning['pubTime'].replace('T', ' ')[:16]  # Adjusting the format

            warning_info = {
                'sender': warning['sender'],
                'pubTime': formatted_pubTime,
                'title': warning['title'],
                'status': warning['status'],
                'severityColor': warning['severityColor'],
                'typeId': warning['type'],
                'description': warning['text'],
                'hasWarning': True
            }
        else:
            warning_info = {'hasWarning': False}
        
        return JsonResponse(warning_info)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_historical_ID(location):
    api_key = '8d77c32f60374816bd6f32c0ffe6c2a4'
    url = f'https://geoapi.qweather.com/v2/city/lookup?location={location}&key={api_key}'
    print(url)
    
    try:
        response = requests.get(url)
        data = response.json()

        if data['code'] == "200" and data['location']:
            # 确保location列表中至少有一个元素
            first_location = data['location'][0]  # 获取列表中的第一个元素
            location_id = first_location['id']  # 然后从这个元素中获取id
            print(location_id)
            return location_id
        else:
            # 如果API响应不是200或location列表为空，则打印错误信息
            print("API error or no location found.")
            return None

    except Exception as e:
        print("Error:", e)
        return 0

def get_historical_weather(request):
    if request.method == 'GET':
        location = request.GET.get('location')
        date = request.GET.get('date') 
        api_key = '8d77c32f60374816bd6f32c0ffe6c2a4'
        location_id = get_historical_ID(location)
        print(location_id)
        url = f'https://api.qweather.com/v7/historical/weather?location={location_id}&date={date}&key={api_key}'
        print(url)
        try:
            response = requests.get(url)
            data = response.json()

            if data['code'] == "200":
                # 从API响应中提取所需数据
                weather_info = {
                    'max_temp': data['weatherDaily']['tempMax'],  # 最高温度
                    'min_temp': data['weatherDaily']['tempMin'],  # 最低温度
                    'total_precip': data['weatherDaily']['precip'],  # 总降水量
                    'hourly_weather': [
                        {'time': hour['time'].split('T')[1][:5], 'temp': hour['temp'], 'precip': hour['precip'], 'humidity':hour['humidity']}
                        for hour in data['weatherHourly']
                    ]  # 小时天气列表
                }
                # print(weather_info)
                return JsonResponse(weather_info)
            else:
                # API响应码不是200，返回错误信息
                return JsonResponse({'error': 'API error', 'code': data['code']})
        except Exception as e:
            return JsonResponse({'error': str(e)})

    else:
        return JsonResponse({'error': 'Invalid HTTP method'})

# import csv
# import random
# import logging
# from django.db import transaction
# from .models import Province, City, District, WaterPoint

# # 配置日志记录
# logging.basicConfig(filename='generate_water_points.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# def generate_water_points():
#     try:
#         with open('C:\\Users\\12297\\Desktop\\weather_district_id.csv', 'r', encoding='utf-8') as file:
#             reader = csv.DictReader(file)
#             for row in reader:
#                 province_name = row['province'] #省份名称
#                 city_name = row['city'] #城市名称
#                 district_name = row['district'] #区域名称
#                 city_geocode = row['city_geocode'] #城市地理编码
#                 print(f"City name: {city_name}, City geocode: {city_geocode}")  # 打印城市名称和地理编码
#                 district_geocode = row['district_geocode'] #区域地理编码
#                 province = Province.objects.get(name=province_name)
#                 city, _ = City.objects.get_or_create(name=city_name, province_id=province.id, geocode=city_geocode)
#                 city_instance = City.objects.get(geocode=city_geocode)
#                 print(f"City instance: {city_instance}")  # 打印获取的城市实例
#                 # 检查是否已经存在具有相同 district_geocode 的记录
#                 existing_district = District.objects.filter(geocode=district_geocode).first()

#                 # 如果已经存在，直接使用现有记录
#                 if existing_district:
#                     district = existing_district
#                 else:
#                     # 否则，创建新的记录
#                     district, _ = District.objects.get_or_create(
#                         name=district_name,
#                         geocode=district_geocode,
#                         city_geocode=city_instance,
#                         longitude=float(row['lon']), # 经度
#                         latitude=float(row['lat']), # 纬度
#                         forecast_longitude=float(row['fc_lon']), # 预报经度
#                         forecast_latitude=float(row['fc_lat']),
#                         actual_longitude=float(row['rt_lon']), # 实况经度
#                         actual_latitude=float(row['rt_lat'])
#                     )

#                 # # 更新城市信息
#                 # if city.longitude is None or city.latitude is None:
#                 #     city.longitude = district.longitude
#                 #     city.latitude = district.latitude
#                 #     city.save()
#                 # # 更新省份信息
#                 # if province.longitude is None or province.latitude is None:
#                 #     province.longitude = district.longitude
#                 #     province.latitude = district.latitude
#                 #     province.save()

#                 # 生成5-15个易积水点
#                 num_water_points = random.randint(5, 15)
#                 for _ in range(num_water_points):
#                     # 随机生成经度和纬度
#                     longitude = random.uniform(district.longitude - 0.1, district.longitude + 0.1)
#                     latitude = random.uniform(district.latitude - 0.1, district.latitude + 0.1)

#                     WaterPoint.objects.create(longitude=longitude, latitude=latitude, district_geocode=district)
#         logging.info('Successfully generated water points.')
#     except Exception as e:
#         logging.error(f'Error generating water points: {str(e)}')

# # 使用事务保证数据的完整性
# with transaction.atomic():
#     generate_water_points()


# import random
# from django.http import JsonResponse
# import logging
# from django.db import transaction
# from .models import City, LandUse, Terrain

# # 配置日志记录
# logging.basicConfig(filename='generate_water_points.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # 定义城市列表及对应的地形地貌数据
# special_cities = {
#     '鄂尔多斯市': {'plain': 28, 'mountain': 27.50, 'hill': 18.33, 'desert': 29.17, 'water_body': 6.67},
#     '巴彦淖尔市': {'plain': 23.81, 'mountain': 15.24, 'hill': 9.52, 'desert': 33.33, 'water_body': 18.10},
#     '阿拉善盟市': {'plain': 10.64, 'mountain': 36.17, 'hill': 19.15, 'desert': 21.28, 'water_body': 12.77},
#     '敦煌市': {'plain': 12.62, 'mountain': 33.01, 'hill': 12.62, 'desert': 36.89, 'water_body': 4.85},
#     '酒泉市': {'plain': 16.67, 'mountain': 28.21, 'hill': 17.95, 'desert': 29.49, 'water_body': 7.69},
#     '张掖市': {'plain': 15.32, 'mountain': 9.91, 'hill': 22.52, 'desert': 39.64, 'water_body': 12.61},
#     '乌鲁木齐市': {'plain': 13.38, 'mountain': 33.80, 'hill': 16.90, 'desert': 26.06, 'water_body': 9.86},
#     '哈密市': {'plain': 20.28, 'mountain': 34.27, 'hill': 14.69, 'desert': 27.27, 'water_body': 3.50},
#     '吐鲁番市': {'plain': 18.79, 'mountain': 22.15, 'hill': 16.11, 'desert': 32.89, 'water_body': 10.07},
#     '银川市': {'plain': 13.21, 'mountain': 32.08, 'hill': 9.43, 'desert': 36.79, 'water_body': 8.49}
# }

# def generate_water_points():
#     try:
#         # 获取所有城市
#         cities = City.objects.all()

# # 遍历每个城市，生成地形地貌数据
#         for city in cities:
#             if city.name in special_cities:
#                 terrain_data = special_cities[city.name]
#             else:
#                 # 基准数据
#                 terrain_data = {
#                     'plain': random.uniform(20, 40),  # 平原数据范围
#                     'mountain': random.uniform(30, 80),  # 山地数据范围
#                     'hill': random.uniform(5, 30),  # 丘陵数据范围
#                     'desert': 0,  # 沙漠数据固定为0
#                     'water_body': random.uniform(3, 20)  # 水体数据范围
#                 }

#             city_instance = City.objects.get(geocode=city.geocode)

#             # 创建 Terrain 对象并保存到数据库
#             Terrain.objects.create(
#                 plain=terrain_data['plain'],
#                 mountain=terrain_data['mountain'],
#                 hill=terrain_data['hill'],
#                 desert=terrain_data['desert'],
#                 water_body=terrain_data['water_body'],
#                 city_geocode=city_instance
#             )


#         # 遍历每个城市，生成一级土地利用分类数据
#         for city in cities:
#             arable_land = random.uniform(120, 140)
#             garden_land = random.uniform(60, 81)
#             forest_land = random.uniform(597, 617)
#             grassland = random.uniform(5, 26)
#             wetland = random.uniform(10, 31)
#             urban_and_industrial_land = random.uniform(106, 127)
#             transport_land = random.uniform(18, 38)
#             water_and_water_facility_land = random.uniform(59, 80)

#             city_instance = City.objects.get(geocode=city.geocode)
#             # 创建 LandUse 对象并保存到数据库
#             LandUse.objects.create(
#                 arable_land=arable_land,
#                 garden_land=garden_land,
#                 forest_land=forest_land,
#                 grassland=grassland,
#                 wetland=wetland,
#                 urban_and_industrial_land=urban_and_industrial_land,
#                 transport_land=transport_land,
#                 water_and_water_facility_land=water_and_water_facility_land,
#                 city_geocode=city_instance 
#             )
                
#         logging.info('Successfully generated water points.')
#     except Exception as e:
#         logging.error(f'Error generating water points: {str(e)}')

# # 使用事务保证数据的完整性
# with transaction.atomic():
#     generate_water_points()