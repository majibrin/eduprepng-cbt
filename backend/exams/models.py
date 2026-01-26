from django.db import models

class Exam(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=60)

    def __str__(self):
        return self.name
