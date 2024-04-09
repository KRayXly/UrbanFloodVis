from django.db import models

class User(models.Model):
    username = models.CharField(max_length=16)
    password = models.CharField(max_length=16)
    phone = models.CharField(max_length=11)

    class Meta:
        db_table = 'users'


class Province(models.Model):
    name = models.CharField(max_length=100, unique=True)
    short_name = models.CharField(max_length=100)
    class Meta:
        db_table = 'province'

class City(models.Model):
    name = models.CharField(max_length=100)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, db_column='province_id')  # 使用 province 而不是 province_id
    geocode = models.CharField(max_length=20, primary_key=True)
    class Meta:
        db_table = 'city'


class District(models.Model):
    name = models.CharField(max_length=100)
    geocode = models.CharField(max_length=20, primary_key=True)
    longitude = models.FloatField()
    latitude = models.FloatField()
    forecast_longitude = models.FloatField()
    forecast_latitude = models.FloatField()
    actual_longitude = models.FloatField()
    actual_latitude = models.FloatField()
    city_geocode = models.ForeignKey(City, on_delete=models.CASCADE, db_column='city_geocode')
    class Meta:
        db_table = 'district'


class WaterPoint(models.Model):
    longitude = models.FloatField()
    latitude = models.FloatField()
    district_geocode = models.ForeignKey(District, on_delete=models.CASCADE, db_column='district_geocode')
    class Meta:
        db_table = 'waterpoint'

class LandUse(models.Model):
    id = models.AutoField(primary_key=True)
    arable_land = models.DecimalField(max_digits=10, decimal_places=2)
    garden_land = models.DecimalField(max_digits=10, decimal_places=2)
    forest_land = models.DecimalField(max_digits=10, decimal_places=2)
    grassland = models.DecimalField(max_digits=10, decimal_places=2)
    wetland = models.DecimalField(max_digits=10, decimal_places=2)
    transport_land = models.DecimalField(max_digits=10, decimal_places=2)
    urban_and_industrial_land = models.DecimalField(max_digits=10, decimal_places=2)
    water_and_water_facility_land = models.DecimalField(max_digits=10, decimal_places=2)
    city_geocode = models.ForeignKey(City, on_delete=models.CASCADE, db_column='city_geocode')
    class Meta:
        db_table = 'landuse'

class Terrain(models.Model):
    id = models.AutoField(primary_key=True)
    plain = models.DecimalField(max_digits=10, decimal_places=2)
    mountain = models.DecimalField(max_digits=10, decimal_places=2)
    hill = models.DecimalField(max_digits=10, decimal_places=2)
    desert = models.DecimalField(max_digits=10, decimal_places=2)
    water_body = models.DecimalField(max_digits=10, decimal_places=2)
    city_geocode = models.ForeignKey(City, on_delete=models.CASCADE, db_column='city_geocode')
    class Meta:
        db_table = 'terrain'