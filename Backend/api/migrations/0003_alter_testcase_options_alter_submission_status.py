from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_course_assignment_results"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="testcase",
            options={"ordering": ["order", "id"]},
        ),
        migrations.AlterField(
            model_name="submission",
            name="status",
            field=models.CharField(
                choices=[
                    ("PENDING", "Pending"),
                    ("PASSED", "Passed"),
                    ("FAILED", "Failed"),
                    ("ACCEPTED", "Accepted"),
                    ("WRONG_ANSWER", "Wrong answer"),
                    ("TIME_LIMIT_EXCEEDED", "Time limit exceeded"),
                    ("ERROR", "Error"),
                ],
                max_length=30,
            ),
        ),
    ]
