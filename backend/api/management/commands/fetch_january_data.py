import requests
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime
from api.models import WindEnergy

class Command(BaseCommand):
    help = 'Fetches actual and forecast wind data for January 2026 and populates SQLite.'

    def handle(self, *args, **kwargs):
        # 1. Wipe the corrupted zig-zag rows
        self.stdout.write("Clearing old corrupted database records...")
        WindEnergy.objects.all().delete()

        # 2. Fetch Actuals (FUELHH)
        self.stdout.write("Fetching actual generation (FUELHH)...")
        actuals_url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream?settlementDateFrom=2026-01-01&settlementDateTo=2026-01-31&fuelType=WIND"
        actuals_res = requests.get(actuals_url).json()

        for item in actuals_res:
            start_time_str = item.get("startTime")
            generation = item.get("generation")
            
            if start_time_str and generation is not None:
                # STRICTLY PARSE DATETIME HERE TO MATCH SQLITE FORMATTING
                start_time = parse_datetime(start_time_str)
                WindEnergy.objects.update_or_create(
                    start_time=start_time,
                    defaults={'actual_generation': generation}
                )

        # 3. Fetch Forecasts (WINDFOR)
        self.stdout.write("Fetching forecasted generation (WINDFOR)...")
        forecast_url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream?publishDateTimeFrom=2026-01-01T00:00:00Z&publishDateTimeTo=2026-01-31T23:59:59Z"
        forecast_res = requests.get(forecast_url).json()

        for item in forecast_res:
            start_time_str = item.get("startTime")
            generation = item.get("generation")
            
            if start_time_str and generation is not None:
            
                start_time = parse_datetime(start_time_str)
            
                WindEnergy.objects.update_or_create(
                    start_time=start_time,
                    defaults={'estimated_generation': generation}
                )
            
                WindEnergy.objects.update_or_create(
                    start_time=start_time + timedelta(minutes=30),
                    defaults={'estimated_generation': generation}
                )

        self.stdout.write(self.style.SUCCESS("Successfully populated January 2026 data!"))