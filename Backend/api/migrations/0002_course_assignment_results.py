from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Course",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("code", models.CharField(max_length=20, unique=True)),
                ("name", models.CharField(max_length=150)),
                ("description", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("teacher", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="courses_taught", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="CourseMembership",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("joined_at", models.DateTimeField(auto_now_add=True)),
                ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="memberships", to="api.course")),
                ("student", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="course_memberships", to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name="Assignment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("starts_at", models.DateTimeField(blank=True, null=True)),
                ("due_at", models.DateTimeField(blank=True, null=True)),
                ("time_limit_minutes", models.PositiveIntegerField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignments", to="api.course")),
                ("exercise", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="assignments", to="api.exercise")),
            ],
        ),
        migrations.CreateModel(
            name="SubmissionTestResult",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("passed", models.BooleanField(default=False)),
                ("status", models.CharField(max_length=30)),
                ("actual_output", models.TextField(blank=True)),
                ("execution_time", models.FloatField(blank=True, null=True)),
                ("error_message", models.TextField(blank=True)),
                ("submission", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="test_results", to="api.submission")),
                ("test_case", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="submission_results", to="api.testcase")),
            ],
        ),
        migrations.AddField(
            model_name="testcase",
            name="order",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="submission",
            name="error_message",
            field=models.TextField(blank=True),
        ),
        migrations.AddConstraint(
            model_name="coursemembership",
            constraint=models.UniqueConstraint(fields=("course", "student"), name="unique_course_student"),
        ),
        migrations.AddConstraint(
            model_name="assignment",
            constraint=models.UniqueConstraint(fields=("course", "exercise"), name="unique_course_exercise_assignment"),
        ),
    ]
