# backend/app/music.py (Yabancı Seçeneği İçin market='US' Eklendi)

from flask import Blueprint, request, jsonify, current_app
from app.extensions import db
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

bp = Blueprint('music', __name__)

def get_spotify_client():
    auth_manager = SpotifyClientCredentials(
        client_id=current_app.config['SPOTIFY_CLIENT_ID'],
        client_secret=current_app.config['SPOTIFY_CLIENT_SECRET']
    )
    sp = spotipy.Spotify(auth_manager=auth_manager)
    return sp

def process_spotify_results(results):
    tracks = []
    # Kontrol: results['tracks'] ve results['tracks']['items'] var mı?
    if results and 'tracks' in results and 'items' in results['tracks']:
        for track in results['tracks']['items']:
            album_art_url = track['album']['images'][0]['url'] if track['album']['images'] else None
            tracks.append({
                'id': track['id'],
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'url': track['external_urls']['spotify'],
                'album_art': album_art_url,
                'preview_url': track['preview_url']
            })
    return tracks


def get_search_query(mood_data, preference_type):
    if not mood_data or all(value == 0 for value in mood_data.values()):
        dominant_emotion = 'pop'
    else:
        dominant_emotion = max(mood_data, key=mood_data.get)

    emotion_map = {
        'happiness': 'mutlu',
        'sadness': 'hüzünlü',
        'anger': 'öfkeli',
        'calmness': 'sakin',
        'energy': 'enerjik',
        'pop': 'pop'
    }
    emotion_term = emotion_map.get(dominant_emotion, 'pop')

    if preference_type == 'local':
        return f"türkçe {emotion_term} şarkılar"
    else: # 'foreign'
        foreign_emotion_map = {
            'mutlu': 'happy',
            'hüzünlü': 'sad',
            'öfkeli': 'angry',
            'sakin': 'calm',
            'enerjik': 'energetic',
            'pop': 'pop'
        }
        foreign_term = foreign_emotion_map.get(emotion_term, 'pop')
        return f"{foreign_term} songs"

@bp.route('/recommendations', methods=['POST'])
@jwt_required()
def get_recommendations():

    current_user_id_str = get_jwt_identity()
    user = User.query.get(int(current_user_id_str))
    if not user:
        return jsonify({"error": "User not found"}), 404

    preference = user.music_preference

    mood_data = request.get_json()
    if not mood_data:
        return jsonify({"error": "Mood data is required"}), 400

    try:
        sp = get_spotify_client()
        all_tracks = []

        if preference == 'local':
            query = get_search_query(mood_data, 'local')
            results = sp.search(q=query, limit=12, type='track', market='TR')
            all_tracks = process_spotify_results(results)

        elif preference == 'foreign':
            query = get_search_query(mood_data, 'foreign')
            # --- DEĞİŞİKLİK BURADA ---
            # market=None yerine market='US' kullanarak sonuçları ABD pazarıyla sınırla
            results = sp.search(q=query, limit=12, type='track', market='US')
            # --- DEĞİŞİKLİK SONU ---
            all_tracks = process_spotify_results(results)

        else: # 'mixed'
            local_query = get_search_query(mood_data, 'local')
            local_results = sp.search(q=local_query, limit=6, type='track', market='TR')
            all_tracks.extend(process_spotify_results(local_results))

            foreign_query = get_search_query(mood_data, 'foreign')
            # Karışık için yabancı ararken de market='US' kullanalım
            foreign_results = sp.search(q=foreign_query, limit=6, type='track', market='US')
            all_tracks.extend(process_spotify_results(foreign_results))

        return jsonify(all_tracks), 200

    except Exception as e:
        print(f"Spotify ARAMA hatası: {e}")
        return jsonify({"error": "Müzik önerileri alınamadı (API Hatası).", "details": str(e)}), 500