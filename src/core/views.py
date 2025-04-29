from django.shortcuts import render
from .models import HelloTest

def hello_view(request):
    # Crée un nouvel enregistrement à chaque appel
    new_hello = HelloTest.objects.create(message='Hello from DB!')

    # On le passe au template sous la clé "hello"
    return render(request, 'hello.html', {"hello": new_hello})
