"""
API URLs
"""
from django.conf.urls import url
from django.urls import path, re_path

from . import views

urlpatterns = [
    #note: "/" = "{base url}/api/"
    
    re_path(r'^$', views.FlipbookAPIListView.as_view(), name="list"), 
    
    # Books 
    #url(r'^api/book/(?P<pk>\d+)/', include('flipbooks.api.urls', namespace='api-get-book'))
    path('book/all/', views.FlipbookAPIListView.as_view(), name="list-book"),
    path('book/<int:pk>/', views.FlipbookAPIDetailView.as_view(), name="detail-book"),
    

    # Chapter
    path('chapter/<int:pk>/', views.ChapterAPIDetailView.as_view(), name="detail-chapter"), # simple list
    re_path(r'^chapter/id64/(?P<id64>\w+)/$', views.Chapter64_APIDetailView.as_view(), name="detail-chapter64"), # simple list
    path('chapter/<int:pk>/scene/all/', views.SceneAPIListView.as_view(), name="list-scene-playback"), # full list
    path('chapter/<int:pk>/scene/playback/all/', views.SceneAPIPlaybackListView.as_view(), name="list-scene"), # full list for PLAYBACK

    # Scene 
    path('chapter/<int:pk>/scene/create/', views.SceneCreateAPIView.as_view(), name="create-scene-under-chapter"),
    path('scene/<int:pk>/', views.SceneAPIDetailView.as_view(), name="detail-scene"),
    path('scene/<int:pk>/playback', views.SceneAPIPlaybackDetailView.as_view(), name="detail-scene-playback"), # PLAYBACK
    path('scene/<int:pk>/update/', views.SceneUpdateAPIView.as_view(), name="update-scene"), # currently only used for movie update

    # Strip
    re_path(r'^scene/(?P<pk>\d+)/strip/create/$', views.StripCreateAPIView.as_view(), name="create-strip-under-scene"),
    path('strip/<int:pk>/', views.StripDeleteAPIview.as_view(), name="delete-strip"),
    path('strip/<int:pk>/update/', views.StripUpdateAPIView.as_view(), name="update-strip"),
    
    # Frames
    re_path(r'^strip/(?P<pk>\d+)/frame/create/$', views.FrameCreateAPIView.as_view(), name="create-frame-under-strip"),
    path('frame/<int:pk>/', views.FrameDeleteAPIview.as_view(), name="delete-frame"),
    path('frame/<int:pk>/', views.FrameDetailAPIView.as_view(), name="detail-frame"),
    re_path(r'^frame/(?P<pk>\d+)/update/$', views.FrameUpdateAPIView.as_view(), name="update-frame")
]
