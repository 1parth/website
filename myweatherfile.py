import influxdb_client, time
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime
import pytz
from influxdb_client import WritePrecision


local_tz = pytz.timezone("America/New_York")

# --- InfluxDB config ---
token = "hidden"
org = "ParthOrg"
bucket = "Weather Bucket"
url = "http://localhost:8086"

client = influxdb_client.InfluxDBClient(url=url, token=token, org=org)
write_api = client.write_api(write_options=SYNCHRONOUS)


# --- Weather API ---
import requests
import json

url = "https://api.open-meteo.com/v1/forecast?latitude=43.6834&longitude=-79.7663&hourly=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature,precipitation_probability,rain,snowfall&timezone=America%2FNew_York&past_days=31&forecast_days=16"


response = requests.get(url)

if response.status_code == 200:
    data = response.json()

    times = data['hourly']['time']
    temperatures = data['hourly']['temperature_2m']
    wind_speed = data['hourly']['wind_speed_10m']
    wind_direction = data['hourly']['wind_direction_10m']
    weather_code = data['hourly']['weather_code']
    apparent_temperature = data['hourly']['apparent_temperature']
    precipitation_probability = data['hourly']['precipitation_probability']
    rainfall_mm = data['hourly']['rain']
    snowfall_cm = data['hourly']['snowfall']


    #print(f"\nFirst data point -> Time: {times[0]}, Temperature: {temperatures[0]}°C")

    for i in range(len(times)):
        # Convert Open-Meteo time string (local) -> UTC datetime
        dt_local = local_tz.localize(datetime.strptime(times[i], "%Y-%m-%dT%H:%M"))
        dt_utc = dt_local.astimezone(pytz.utc)

        temperature_point = (
            Point("Temperature")
            .field("Temperature", (temperatures[i]))
            .time(dt_utc, WritePrecision.S)
        )
        write_api.write(bucket=bucket, org=org, record=temperature_point)

        wind_speed_point = (
            Point("Wind Speed")
            .field("Wind Speed", (wind_speed[i]))
            .time(dt_utc, WritePrecision.S)
        )
        write_api.write(bucket=bucket, org=org, record=wind_speed_point)

        wind_dir_point = (
            Point("Wind Direction")
            .field("Wind Direction", (wind_direction[i]))
            .time(dt_utc, WritePrecision.S)
        )
        write_api.write(bucket=bucket, org=org, record=wind_dir_point)

        weather_code_point = (
            Point("Weather Code")
           .field("Weather Code", (weather_code[i]))
           .time(dt_utc, WritePrecision.S)
       )
        write_api.write(bucket=bucket, org=org, record=weather_code_point)

        apparent_temp_point = (
            Point("Apparent Temperature")
           .field("Apparent Temperature", (apparent_temperature[i]))
           .time(dt_utc, WritePrecision.S)
       )
        write_api.write(bucket=bucket, org=org, record=apparent_temp_point)

        precipitation_probability_point = (
            Point("Precipitation Probability")
            .field("Precipitation Probability", (precipitation_probability[i]))
            .time(dt_utc, WritePrecision.S)
        )
        write_api.write(bucket=bucket, org=org, record=precipitation_probability_point)

        rainfall_mm_point = (
            Point("Rainfall")
            .field("Rainfall", (rainfall_mm[i]))
            .time(dt_utc, WritePrecision.S)
        )
        write_api.write(bucket=bucket, org=org, record=rainfall_mm_point)

        snowfall_cm_point = (
            Point("Snowfall")
            .field("Snowfall", (snowfall_cm[i]))
            .time(dt_utc, WritePrecision.S)
        )
        write_api.write(bucket=bucket, org=org, record=snowfall_cm_point)

else:
    print(f"Error: {response.status_code}")


