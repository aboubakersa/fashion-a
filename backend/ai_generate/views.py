import requests
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.conf import settings


def _generate_image(prompt):
    try:
        res = requests.post(
            "https://api.together.xyz/v1/images/generations",
            headers={
                "Authorization": "Bearer key_CbyLdDwHzJJaDT4Ajw4qX",
                "Content-Type": "application/json"
            },
            json={
                "model": "black-forest-labs/FLUX.1-schnell-Free",
                "prompt": prompt,
                "width": 512,
                "height": 512,
                "steps": 4,
                "n": 1,
            },
            timeout=60,
        )
        if res.status_code == 200:
            data = res.json()
            return data['data'][0]['url']
        return None
    except Exception:
        return None


class ChatDesignView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('message', '')
        if not prompt:
            return Response({'error': 'اكتب وصف التصميم'}, status=400)

        image_url = _generate_image(prompt)

        if image_url:
            return Response({'image_url': image_url, 'message': 'تم التوليد ✅'})
        else:
            return Response({
                'image_url': f'https://picsum.photos/seed/{abs(hash(prompt)) % 1000}/400/500',
                'message': 'تم التوليد (وضع تجريبي)'
            })


class GenerateDesignView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({'error': 'اكتب وصف التصميم'}, status=400)

        image_url = _generate_image(prompt)
        if image_url:
            return Response({'image_url': image_url})
        return Response({
            'image_url': f'https://picsum.photos/seed/{abs(hash(prompt)) % 1000}/400/500'
        })


class GenerateVariationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt', '')
        variations = int(request.data.get('variations', 3))
        styles = ['elegant', 'modern', 'classic']
        images = []

        for i in range(min(variations, 3)):
            image_url = _generate_image(f"{prompt}, {styles[i]} style")
            if image_url:
                images.append(image_url)
            else:
                images.append(f'https://picsum.photos/seed/{(abs(hash(prompt)) + i) % 1000}/400/500')

        return Response({'images': images, 'message': f'{len(images)} تنويعات ✅'})
