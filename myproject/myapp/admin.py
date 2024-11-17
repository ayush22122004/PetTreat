from django.contrib import admin

# Register your models here.

from .models import Carousel,Category, Footer, Navbar, Order,Reviews,Product_Details,Product,Pettreat_user,List,CartItem
admin.site.register(Pettreat_user)
admin.site.register(Product)
admin.site.register(Category)
admin.site.register(List)
admin.site.register(Order)
admin.site.register(Footer)
admin.site.register(Navbar)
admin.site.register(CartItem)
admin.site.register(Carousel)
admin.site.register(Reviews)
admin.site.register(Product_Details)
