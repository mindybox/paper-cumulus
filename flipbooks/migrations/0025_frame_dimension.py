# Generated by Django 2.1.1 on 2018-10-13 01:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flipbooks', '0024_strip_dimension'),
    ]

    operations = [
        migrations.AddField(
            model_name='frame',
            name='dimension',
            field=models.CharField(blank=True, default='', max_length=9),
        ),
    ]
