# Generated by Django 2.2.12 on 2020-04-14 12:03

import api.models
from django.db import migrations, models
import djongo.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('permissions', djongo.models.fields.ListField(verbose_name=models.CharField(max_length=20))),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('subjects', djongo.models.fields.ArrayField(model_container=api.models.Subject)),
            ],
        ),
        migrations.CreateModel(
            name='Exam',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('examID', models.CharField(max_length=50)),
                ('writers', djongo.models.fields.ListField(verbose_name=models.CharField(max_length=30))),
                ('course', djongo.models.fields.EmbeddedField(model_container=api.models.Course, null=True)),
                ('questions', djongo.models.fields.ArrayField(model_container=api.models.Question)),
                ('subjects', djongo.models.fields.ArrayField(model_container=api.models.Subject)),
            ],
        ),
        migrations.CreateModel(
            name='Lecturer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('permissions', djongo.models.fields.ListField(verbose_name=models.CharField(max_length=20))),
                ('coursesTeaching', djongo.models.fields.ArrayField(model_container=api.models.Course)),
            ],
            options={
                'abstract': False,
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
                ('correctAnswer', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('courses', djongo.models.fields.ArrayField(model_container=api.models.Course)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('permissions', djongo.models.fields.ListField(verbose_name=models.CharField(max_length=20))),
                ('relevantCourses', djongo.models.fields.ArrayField(model_container=api.models.Course)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
    ]
