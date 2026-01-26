from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    exams = models.ManyToManyField(
        'exams.Exam',
        related_name='subjects'
    )

    def __str__(self):
        return self.name
