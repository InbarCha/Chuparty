# Generated by Django 2.2.12 on 2020-04-10 13:02

import api.models
import django.core.validators
from django.db import migrations, models
import djongo.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='String',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('_s', models.CharField(max_length=200)),
            ],
            options={
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', djongo.models.fields.EmbeddedField(model_container=api.models.Subject, null=True)),
                ('course', djongo.models.fields.EmbeddedField(model_container=api.models.Course, null=True)),
                ('body', models.CharField(max_length=100)),
                ('answers', djongo.models.fields.ListField(max_length=5, verbose_name=models.CharField(max_length=50))),
                ('correctAnswer', models.IntegerField(validators=[django.core.validators.MinValueValidator(limit_value=0), django.core.validators.MaxValueValidator(limit_value=4)])),
            ],
        ),
    ]
