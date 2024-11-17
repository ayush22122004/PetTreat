from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import  OrderSerializer, PettreatSerializer, CategorySerializer,CarouselSerializer, ReviewSerializer,Product_DetailsSerializer,ProductSerializer
from .models import  Footer, Navbar, Order, Pettreat_user, Category,Carousel, Reviews,Product_Details,Product,List,CartItem
from rest_framework import viewsets
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_protect
@csrf_protect
@api_view(['POST'])
def submit_form(request):
    if request.method == 'POST':
        serializer = PettreatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = Pettreat_user.objects.all()
    
    for rec in user:
        if rec.username == username and rec.password == password:
            request.session['username'] = rec.username
        
            user_data = {
                'username': rec.username,
                'email': rec.email,
                'country': rec.country,
                'address': rec.address,
                'city': rec.city,
                'state': rec.state,
                'pincode': rec.pin_code,
                'phone': rec.phone
            }
            return Response({'status': 'success', 'user': user_data}, status=status.HTTP_200_OK)

    # If authentication fails
    return Response({'status': 'error', 'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
class category_list_view(viewsets.ModelViewSet):
    #ModelViewSet provides crud operation   
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
class carousel(viewsets.ModelViewSet):
    serializer_class= CarouselSerializer
    def get_queryset(self):
        carousel_type = self.request.query_params.get('carousel_type')
        if carousel_type:
            return Carousel.objects.filter(carousel_type=carousel_type)
        return Carousel.objects.none()
class review_view(viewsets.ModelViewSet):
    queryset = Reviews.objects.all()
    serializer_class = ReviewSerializer
class get_products(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
class ProductDetailsView(viewsets.ModelViewSet):
    queryset = Product_Details.objects.all()
    serializer_class = Product_DetailsSerializer
@api_view(['GET'])
def get_username(request):
    username = request.session.get('username')
    if username:
        return Response({'username': username})
    else:
        return Response({'error': 'User not logged in'}, status=401)
@api_view(['POST'])
def update_address(request):
    username = request.data.get('username')
    address = request.data.get('address')
    city = request.data.get('city')
    state = request.data.get('state')
    pincode = request.data.get('pincode')
    country = request.data.get('country')
    phone=request.data.get('phone')
    email=request.data.get('email')
    try:
        user = Pettreat_user.objects.get(username=username)
        user.address = address
        user.city = city
        user.state = state
        user.pin_code = pincode
        user.country = country
        user.phone = phone
        user.email = email
        user.save()

        return Response({'status': 'success', 'message': 'Address updated successfully.'}, status=status.HTTP_200_OK)
    except Pettreat_user.DoesNotExist:
        return Response({'status': 'error', 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Order placed successfully"}, status=201)
    return Response(serializer.errors, status=400)
@api_view(['GET'])
def user_orders(request):
    username = request.GET.get('username')  
    if username:
        orders = Order.objects.filter(username=username) 
        if orders.exists():
            serializer = OrderSerializer(orders, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No orders found'}, status=status.HTTP_404_NOT_FOUND)
    return Response({'error': 'Username not provided'}, status=status.HTTP_400_BAD_REQUEST)

class FooterView(APIView):
    def get(self, request):
        footer = Footer.objects.first()
        data = {
            'logo': request.build_absolute_uri(footer.logo.url), 
            'description': footer.description,
            'address': footer.address,
            'email': footer.email,
            'links': footer.links,  
            'social_links': footer.social_links  
        }
        return Response(data)
class NavbarView(APIView):
    def get(self, request):
        nav = Navbar.objects.first()
        data = {
            'logo': request.build_absolute_uri(nav.logo.url),  
            'links': nav.links,
            'profile_logo':request.build_absolute_uri(nav.profile_logo.url),
            'cart_logo':request.build_absolute_uri(nav.cart_logo.url)
        }
        return Response(data)
class ReviewsViewSet(viewsets.ModelViewSet):
    queryset = Reviews.objects.all()
    serializer_class = ReviewSerializer
@api_view(['POST'])
def cancel_order(request):
    order_id = request.data.get('order_id')
    try:
        order = Order.objects.get(id=order_id)
        if not order.is_delivered and not order.is_canceled:
            order.is_canceled = True
            order.save()
            return Response({'message': 'Order canceled successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Order cannot be canceled.'}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({'message': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)