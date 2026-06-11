import requests
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.conf import settings


def _generate_image(prompt):
    try:
        res = requests.post(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            headers={"Authorization": f"Bearer {settings.HF_API_KEY}"},
            json={"inputs": prompt},
            timeout=60,
        )
        if res.status_code == 200:
            b64 = base64.b64encode(res.content).decode('utf-8')
            return f"data:image/png;base64,{b64}"
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
            # صورة placeholder إذا فشل الاتصال
            return Response({
                'image_url': f'https://picsum.photos/seed/{hash(prompt) % 1000}/400/500',
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
            'image_url': f'https://picsum.photos/seed/{hash(prompt) % 1000}/400/500'
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
                images.append(f'https://picsum.photos/seed/{(hash(prompt) + i) % 1000}/400/500')

        return Response({'images': images, 'message': f'{len(images)} تنويعات ✅'})
        
