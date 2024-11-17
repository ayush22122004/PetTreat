from django.db import models
class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)

    def __str__(self):
        return self.name

class Carousel(models.Model):
    CAROUSEL_CHOICES = [
        ('home', 'Home Page Carousel'),
        ('buy_pets', 'Buy Pets Carousel'),
    ]

    image = models.ImageField(upload_to='carousel_images/')
    carousel_type = models.CharField(max_length=20, choices=CAROUSEL_CHOICES,default='home')

    def __str__(self):
        return f"{self.carousel_type} - {self.id}"
class Reviews(models.Model):
    description = models.CharField(max_length=1000)
    image = models.ImageField(upload_to='review_images/', blank=True, null=True)
    rating = models.IntegerField() 
    def __str__(self):
        return self.description
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, default=0) 
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    image = models.ImageField(upload_to='card_images/')
    
    def __str__(self):
        return self.name

class Product_Details(models.Model):
    description = models.TextField()
    rating = models.FloatField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    size_options = models.JSONField(default=list)  
    category = models.CharField(max_length=100)
    
    def __str__(self):
        return self.description
class Pettreat_user(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    email = models.EmailField(default='Unknown')
    country = models.CharField(max_length=100,default='Unknown')
    address = models.TextField(default='')
    city = models.CharField(max_length=100,default='Unknown')
    state = models.CharField(max_length=100,default='Unknown')
    pin_code = models.CharField(max_length=20,default='123456')
    phone = models.CharField(max_length=10,default='0000000000')
    def __str__(self):
        return self.username

class Order(models.Model):
    username = models.CharField(max_length=255)
    product_description = models.CharField(max_length=255)
    product_weight = models.CharField(max_length=50)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    order_date = models.DateTimeField(auto_now_add=True)
    is_delivered = models.BooleanField(default=False)
    is_canceled = models.BooleanField(default=False)
    def __str__(self):
        return f"Order by {self.username} on {self.order_date}"

class CartItem(models.Model):
    user = models.ForeignKey(Pettreat_user, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
class List(models.Model):
    user = models.OneToOneField(Pettreat_user, on_delete=models.CASCADE)
    items = models.ManyToManyField(CartItem)
class Footer(models.Model):
    logo = models.ImageField(upload_to='footer_logos/')
    description = models.TextField()
    address = models.CharField(max_length=255)
    email = models.EmailField()
    links = models.JSONField()  
    social_links = models.JSONField()

    def __str__(self):
        return "Footer Content"
class Navbar(models.Model):
    logo = models.ImageField(upload_to='navbar/')
    links = models.JSONField() 
    profile_logo=models.ImageField(upload_to='navbar/')
    cart_logo=models.ImageField(upload_to='navbar/')
    def __str__(self):
        return "Footer Content"