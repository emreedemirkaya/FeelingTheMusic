# Feeling the Music

![Feeling the Music Logo](./frontend/public/logo.png)

**Müziği Hisset, Ruhunu Keşfet.**

**Feeling the Music**, kullanıcıların o anki duygusal durumlarını analiz eden ve bu analize göre kişiselleştirilmiş müzik önerileri sunan bir web uygulamasıdır. Duygu testini çözün, ruh halinizin yüzdesel dökümünü görün ve o anki modunuza en uygun yerli veya yabancı şarkıları keşfedin.

---

## Ekran Görüntüleri
<img width="1470" height="956" alt="1" src="https://github.com/user-attachments/assets/dca6dfc8-c42f-4ad1-a1fb-506f71b40b55" />
<img width="1470" height="956" alt="2" src="https://github.com/user-attachments/assets/63438650-be1d-4130-85e8-e09f62a1dbe9" />
<img width="1470" height="956" alt="3" src="https://github.com/user-attachments/assets/335acf15-f4fe-403a-8d34-2a294cc1f4dd" />
<img width="1470" height="956" alt="4" src="https://github.com/user-attachments/assets/82be1bc1-b687-49ec-b39d-04eab9b7fbe7" />
<img width="1470" height="956" alt="5" src="https://github.com/user-attachments/assets/6b70ff1d-5b13-4417-b936-51f8d750535a" />
<img width="1470" height="956" alt="6" src="https://github.com/user-attachments/assets/d6a6ad61-21ec-4fed-8a4a-075ceedb520e" />
<img width="1470" height="956" alt="7" src="https://github.com/user-attachments/assets/43c24070-dbc3-4cb5-8a61-e0b4fdd5b8f1" />
<img width="1470" height="956" alt="8" src="https://github.com/user-attachments/assets/17ca2a2b-578e-4762-afe4-52fe4ce524ab" />
<img width="1470" height="956" alt="9" src="https://github.com/user-attachments/assets/9dc3e1d4-b4f1-4ce6-84b0-1ee63084c90c" />
<img width="1470" height="956" alt="10" src="https://github.com/user-attachments/assets/55b71e4d-6d0b-409d-ad91-3a93bc7c5804" />
<img width="1470" height="956" alt="11" src="https://github.com/user-attachments/assets/2d0441be-53f6-47ce-9b1e-55947a012c0a" />
<img width="1470" height="956" alt="12" src="https://github.com/user-attachments/assets/908f3f56-156b-4426-a8a4-8ed306762cc7" />
<img width="1470" height="956" alt="13" src="https://github.com/user-attachments/assets/b02ba040-bf46-471d-b21c-a57c506520d1" />
<img width="1470" height="956" alt="14" src="https://github.com/user-attachments/assets/7e04371c-356b-4622-ac9f-1c683a50d3b8" />
<img width="1470" height="956" alt="15" src="https://github.com/user-attachments/assets/58d215b6-be5c-4d37-a5ce-f1ebae1c42ea" />
<img width="1470" height="956" alt="16" src="https://github.com/user-attachments/assets/7ea97d44-9b11-40dc-9ba2-552bd13b6276" />
<img width="1470" height="956" alt="16" src="https://github.com/user-attachments/assets/9220b5a3-7680-4a9b-b023-bd3898512081" />


---

## 🚀 Ana Özellikler

Bu proje, bir kullanıcının kimlik doğrulamasından duygu analizine ve üçüncü parti bir API (Spotify) entegrasyonuna kadar tam kapsamlı bir web uygulamasının tüm adımlarını içermektedir.

### 1. Kapsamlı Kimlik Doğrulama (Authentication)
* **Google ile Giriş:** Herhangi bir Google hesabı ile tek tıkla (OAuth 2.0) güvenli giriş yapabilme.
* **Yerel Kayıt (Email/Password):** Kullanıcıların e-posta, kullanıcı adı ve şifre ile sisteme kayıt olabilmesi.
* **Yerel Giriş (Email/Password):** Kayıtlı kullanıcıların e-posta ve şifre ile giriş yapabilmesi.
* **Güvenli Şifreleme:** Kullanıcı şifreleri, `scrypt` (veya uyumluluk için `pbkdf2:sha256`) metoduyla **hash**'lenerek veritabanında saklanır.
* **JWT Oturum Yönetimi:** Başarılı giriş (Google veya yerel) sonrası, backend bir JWT (JSON Web Token) oluşturur ve frontend bu token'ı oturumu sürdürmek için kullanır.
* **Hata Yönetimi:** Kullanıcı adı/e-posta çakışmaları (hem yerel kayıtta hem de Google ile girişte) backend tarafından akıllıca yönetilir.

### 2. Duygu Analiz Testi (Quiz)
* **Etkileşimli Anket:** Kullanıcının 5 ana duygusunu (Mutluluk, Hüzün, Enerji, Sakinlik, Öfke) ölçmek için tasarlanmış 10 soruluk bir test.
* **Puanlama Algoritması:** Test sonuçlarına göre, her bir duygunun 100 üzerinden yüzdesel dağılımını hesaplayan bir sistem.
* **Veri Kaydı:** Test sonucu (JSON formatında) tamamlandığı anda kullanıcının profiline ve veritabanına kaydedilir.

### 3. Duygu Geçmişi ve Görselleştirme
* **Geçmiş Takibi:** Kayıtlı kullanıcılar, daha önce çözdükleri tüm testlerin sonuçlarını görebilir.
* **Dinamik Grafikler:** Her test sonucu, `Recharts` kütüphanesi kullanılarak interaktif bir **Pasta Grafik (Pie Chart)** ile görselleştirilir.
* **Zaman Damgası:** Tüm test sonuçları, kullanıcının yerel saat dilimine (TRT - UTC+3) göre düzeltilmiş bir zaman damgasıyla listelenir.

### 4. Akıllı Müzik Önerileri (Spotify API)
* **Kullanıcı Tercihi:** Kullanıcılar, "Yerli", "Yabancı" veya "Karışık" olmak üzere üç farklı müzik öneri tercihinden birini seçebilir. Bu tercih profillerine kaydedilir.
* **Spotify Entegrasyonu:** `Spotipy` kütüphanesi kullanılarak Spotify API'si ile entegrasyon sağlanmıştır.
* **Dinamik Arama:** `recommendations` API'sinin 404 hatalarına karşı, daha esnek olan `search` (arama) API'si kullanılır.
* **Akıllı Sorgu:** Sistem, kullanıcının en baskın duygusunu (örn: "Enerji") ve tercihini (örn: "Yerli") birleştirerek Spotify'da arama yapar (Örn: `"türkçe enerjik şarkılar"`).
* **"Karışık" Listesi:** Karışık tercihi seçildiğinde, uygulama Spotify'a 6 yerli ve 6 yabancı şarkı için iki ayrı API isteği atar ve sonuçları birleştirir.
* **Pazar (Market) Filtresi:** "Yabancı" seçeneğinde `market='US'`, "Yerli" seçeneğinde `market='TR'` kullanılarak sonuçların doğruluğu artırılır.
* **Sonuç Gösterimi:** Önerilen şarkılar; albüm kapağı, şarkı adı, sanatçı, 30 saniyelik önizleme (`<audio>`) ve doğrudan Spotify'da açma linki ile birlikte listelenir.

---

## 🛠️ Kullanılan Teknolojiler

### Backend (Python)
* **Framework:** Flask
* **Veritabanı:** SQLite (Geliştirme)
* **ORM:** Flask-SQLAlchemy
* **Veritabanı Taşıma:** Flask-Migrate
* **API & Güvenlik:** Flask-RESTful (Blueprint yapısı), Flask-CORS
* **Kimlik Doğrulama:** Flask-JWT-Extended, Werkzeug (hashleme)
* **Harici API'ler:** Spotipy (Spotify API), Google OAuth (google-auth)
* **Yapılandırma:** python-dotenv

### Frontend (React)
* **Kütüphane:** React (Create React App)
* **Yönlendirme (Routing):** React Router (`react-router-dom`)
* **State Yönetimi:** React Context API (AuthContext için)
* **API İstekleri:** Axios
* **Kimlik Doğrulama:** `@react-oauth/google` (Google Login)
* **Görselleştirme:** Recharts (Grafikler için)
* **Stil:** CSS (Modern CSS, Flexbox, Grid, CSS Animasyonları)

---

## 🔧 Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Backend (Flask) Kurulumu

1.  Projeyi klonlayın ve `backend` dizinine gidin:
    ```bash
    git clone [https://github.com/emreedemirkaya/FeelingTheMusic.git](https://github.com/emreedemirkaya/FeelingTheMusic.git)
    cd FeelingTheMusic/backend
    ```
2.  Python sanal ortamını (virtual environment) oluşturun ve aktif edin:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Gerekli kütüphaneleri yükleyin:
    ```bash
    pip install -r requirements.txt 
    # (Eğer requirements.txt yoksa: pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-CORS Flask-JWT-Extended spotipy python-dotenv google-auth werkzeug)
    ```
4.  `.env` dosyasını oluşturun:
    `backend` dizininde `.env` adında bir dosya oluşturun ve içine Spotify ile Google'dan aldığınız anahtarları girin:
    ```env
    # .env
    SECRET_KEY=gizli-bir-anahtar-girmelisiniz
    JWT_SECRET_KEY=baska-gizli-bir-anahtar
    
    # Google Developer Console'dan alınacak
    GOOGLE_CLIENT_ID=SENIN_GOOGLE_CLIENT_ID_BURAYA
    
    # Spotify Developer Dashboard'dan alınacak
    SPOTIFY_CLIENT_ID=SENIN_SPOTIFY_CLIENT_ID_BURAYA
    SPOTIFY_CLIENT_SECRET=SENIN_SPOTIFY_CLIENT_SECRET_BURAYA
    ```
5.  Veritabanını oluşturun:
    ```bash
    flask db upgrade
    ```
6.  Backend sunucusunu başlatın:
    ```bash
    flask run
    ```
    *(Sunucu `http://12vel -0.0.1:5000` adresinde çalışacaktır.)*

### 2. Frontend (React) Kurulumu

1.  Yeni bir terminal açın ve `frontend` dizinine gidin:
    ```bash
    cd FeelingTheMusic/frontend
    ```
2.  Gerekli paketleri yükleyin:
    ```bash
    npm install
    ```
3.  `.env` dosyasını oluşturun:
    `frontend` dizininde `.env` adında bir dosya oluşturun ve içine Google Client ID'nizi girin (Bu, React tarafından okunabilmesi için `REACT_APP_` önekiyle başlamalıdır):
    ```env
    # frontend/.env
    REACT_APP_GOOGLE_CLIENT_ID=SENIN_GOOGLE_CLIENT_ID_BURAYA
    ```
4.  Frontend sunucusunu başlatın:
    ```bash
    npm start
    ```
    *(Uygulama `http://localhost:3000` adresinde açılacaktır.)*
