
from django.urls import path,include
from .views import  FooterView, NavbarView, ReviewsViewSet, cancel_order, create_order, get_products,submit_form, login_view, category_list_view,carousel,review_view,ProductDetailsView,get_username,update_address, user_orders
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
#The DefaultRouter from Django REST framework is used to automatically generate the URLs for viewsets (which handle CRUD operations).
router.register(r'categories',category_list_view,basename="")
router.register(r'carousel_images',carousel,basename='carousel')
router.register(r'review_images',review_view,basename='review')
router.register(r'card_images', get_products, basename='card')
router.register(r'product_detail', ProductDetailsView, basename='product-detail')
router.register(r'reviews', ReviewsViewSet,basename='review_form')
urlpatterns = [
    path('',include(router.urls)),
    path('submit-form/', submit_form, name='submit-form'),
    path('loginpage/', login_view, name='loginpage'),
    path('get-username/', get_username, name='get-username'),
    path('update-address/', update_address, name='update-address'),
    path('create-order/', create_order, name='create-order'),
    path('orders/', user_orders, name='user-orders'),
    path('footer/', FooterView.as_view(), name='footer'),
    path('navbar/', NavbarView.as_view(), name='navbar'),
    path('cancel-order/', cancel_order, name='cancel_order'),
]
