from rest_framework import serializers
from .models import Footer, Navbar, Order, Pettreat_user, Reviews,Product
from .models import  Category,Carousel,Product_Details
class PettreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pettreat_user
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'mrp', 'discount', 'image']
class Product_DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product_Details
        fields = ['id', 'description','rating','price', 'mrp', 'size_options','category']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class CarouselSerializer(serializers.ModelSerializer):
    class Meta:
        model=Carousel
        fields = '__all__'
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reviews
        fields = ['id', 'description', 'image', 'rating']
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'username', 'product_description', 'product_weight', 'product_price' ,'order_date','is_delivered']
class FooterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Footer
        fields = '__all__'
class NavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Navbar
        fields = '__all__'