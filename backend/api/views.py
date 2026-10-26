from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from datetime import datetime
from .models import WindEnergy

class DailyWindEnergyView(APIView):
    def get(self, request):
        date_str = request.query_params.get('date', '2026-01-01')
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)

        # Retrieve the half-hour blocks for the requested day
        qs = WindEnergy.objects.filter(start_time__date=target_date)
        
        # Calculate daily aggregates
        totals = qs.aggregate(
            total_actual=Sum('actual_generation'),
            total_estimated=Sum('estimated_generation')
        )
        
        total_actual = totals['total_actual'] or 0
        total_estimated = totals['total_estimated'] or 0
        
        # Calculate extra energy and error margin
        extra_to_buy = max(0, total_estimated - total_actual)
        error_percentage = 0
        if total_estimated > 0:
            error_percentage = round((abs(total_estimated - total_actual) / total_estimated) * 100, 2)

        # Format time and convert values to MW (assuming original was kW or MW, adjust math if needed)
        chart_data = [
            {
                "time": entry.start_time.strftime("%H:%M"),
                "estimated": entry.estimated_generation or 0,
                "actual": entry.actual_generation or 0
            }
            for entry in qs
        ]

        return Response({
            "chartData": chart_data,
            "summaryMetrics": {
                "totalEstimated": round(total_estimated, 2),
                "totalActual": round(total_actual, 2),
                "extraToBuy": round(extra_to_buy, 2),
                "errorPercentage": error_percentage
            }
        })