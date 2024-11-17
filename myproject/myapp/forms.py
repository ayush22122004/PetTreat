from django import forms
from .models import MyFormData

class AddressForm(forms.ModelForm):
    class Meta:
        model = MyFormData
        fields = ['email', 'country', 'address','city', 'state', 'pin_code', 'phone']
