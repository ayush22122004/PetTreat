# Generated by Django 5.1 on 2024-09-27 06:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0009_order_is_delivered_delete_cart_new'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='is_canceled',
            field=models.BooleanField(default=False),
        ),
        # migrations.DeleteModel(
        #     name='Cart_new',
        # ),
    ]
