# Generated by Django 2.1.1 on 2018-10-03 00:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('flipbooks', '0021_auto_20180123_0325'),
    ]

    operations = [
        migrations.AddField(
            model_name='strip',
            name='children_index',
            field=models.TextField(blank=True, default='', max_length=500),
        ),
    ]
