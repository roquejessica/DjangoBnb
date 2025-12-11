from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Conversation, ConversationMessage
from .serializers import ConversationListSerializer, ConversationDetailSerializer

from useraccount.models import User
 


@api_view(['GET'])
def conversations_list(request):
    serializer = ConversationListSerializer(request.user.conversations.all(), many=True)

    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def conversations_detail(request, pk):
        conversation = request.user.conversations.get(pk=pk)
        conversation_serializer = ConversationDetailSerializer(conversation, many=False)

        return JsonResponse({
            'conversation': conversation_serializer.data,
            'messages': []
        }, safe=False)