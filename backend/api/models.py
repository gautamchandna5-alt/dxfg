from django.db import models

class WindEnergy(models.Model):
    start_time = models.DateTimeField(unique=True, db_index=True)
    actual_generation = models.FloatField(null=True, blank=True)
    estimated_generation = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['start_time']
        
    def __str__(self):
        return f"{self.start_time} - Actual: {self.actual_generation}, Est: {self.estimated_generation}"