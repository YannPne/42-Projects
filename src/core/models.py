from django.db import models

class HelloTest(models.Model):
    message = models.CharField(max_length=100, default='Hello world')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}: {self.message} (created {self.created_at})"
