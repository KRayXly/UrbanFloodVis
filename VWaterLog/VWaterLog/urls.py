"""
URL configuration for VWaterLog project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from Vis01.views import welcome, user_info, loadp, get_city_waterpoints, citymap, get_area_points, get_city_data, get_facility_count, get_facility_countall, get_weather, get_hourly_precipitation, get_weather_warning, get_historical_weather
urlpatterns = [
    # path("admin/", admin.site.urls),
    path("", welcome),
    path("loadp/", loadp),
    path("citymap/", citymap),
    path('user-info/', user_info, name='user_info'), 
    path('get_city_waterpoints/', get_city_waterpoints, name='get_city_waterpoints'),
    path('get_area_points/', get_area_points, name='get_area_points'),
    path('get_city_data/', get_city_data, name='get_city_data'),
    path('get_facility_count/', get_facility_count, name='get_facility_count'),
    path('get_facility_countall/', get_facility_countall, name='get_facility_countall'),
    path('get_weather/', get_weather, name='get_weather'),
    path('get_hourly_precipitation/', get_hourly_precipitation, name='get_hourly_precipitation'),
    path('get_weather_warning/', get_weather_warning, name='get_weather_warning'),
    path('get_historical_weather/', get_historical_weather, name='get_historical_weather'),
    # 其他路由...
    # path('generate_water_points/', generate_water_points, name='ge'), 
    # path('water_view/', water_view , name='water_view')
]
urlpatterns += staticfiles_urlpatterns()