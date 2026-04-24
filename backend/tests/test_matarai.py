"""Backend API tests for Matar.AI - auth, blog, contact endpoints"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_EMAIL = "admin@matarai.com"
ADMIN_PASSWORD = "MataRAI2024!"

# Shared session with cookie support
@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s

@pytest.fixture(scope="module")
def auth_session(session):
    """Authenticated session via cookie"""
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Auth failed: {r.status_code} {r.text}")
    return session

# --- Auth Tests ---

def test_root_api(session):
    """GET /api/ health check"""
    r = session.get(f"{BASE_URL}/api/")
    assert r.status_code == 200

def test_login_success(session):
    """POST /api/auth/login with correct credentials"""
    r = session.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    data = r.json()
    assert "email" in data
    assert data["email"] == ADMIN_EMAIL
    assert "id" in data

def test_login_invalid(session):
    """POST /api/auth/login with wrong password returns 401"""
    s2 = requests.Session()
    r = s2.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"})
    assert r.status_code == 401

def test_auth_me(auth_session):
    """GET /api/auth/me returns current user"""
    r = auth_session.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 200
    data = r.json()
    assert data["email"] == ADMIN_EMAIL

def test_auth_me_unauthenticated():
    """GET /api/auth/me without cookie returns 401"""
    s = requests.Session()
    r = s.get(f"{BASE_URL}/api/auth/me")
    assert r.status_code == 401

# --- Blog Public Tests ---

def test_blog_get_published(session):
    """GET /api/blog returns published posts"""
    r = session.get(f"{BASE_URL}/api/blog")
    assert r.status_code == 200
    data = r.json()
    assert "posts" in data
    assert "total" in data
    assert isinstance(data["posts"], list)
    # Should have seeded posts
    assert data["total"] >= 1

def test_blog_get_with_category(session):
    """GET /api/blog?category=AI+per+Aziende filters correctly"""
    r = session.get(f"{BASE_URL}/api/blog?category=AI+per+Aziende")
    assert r.status_code == 200
    data = r.json()
    for post in data["posts"]:
        assert post["category"] == "AI per Aziende"

def test_blog_get_slug(session):
    """GET /api/blog/:slug returns a post"""
    r = session.get(f"{BASE_URL}/api/blog/ai-trasforma-customer-service")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == "ai-trasforma-customer-service"
    assert "content" in data

def test_blog_get_slug_404(session):
    """GET /api/blog/nonexistent returns 404"""
    r = session.get(f"{BASE_URL}/api/blog/nonexistent-slug-xyz")
    assert r.status_code == 404

# --- Contact Tests ---

def test_contact_submit(session):
    """POST /api/contact saves message"""
    r = session.post(f"{BASE_URL}/api/contact", json={
        "name": "TEST_User",
        "email": "test@example.com",
        "message": "Test message from automated testing",
        "company": "TEST_Corp"
    })
    assert r.status_code == 200
    data = r.json()
    assert "message" in data

# --- Admin Blog CRUD Tests ---

def test_admin_blog_list(auth_session):
    """GET /api/admin/blog returns all posts (auth required)"""
    r = auth_session.get(f"{BASE_URL}/api/admin/blog")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)

def test_admin_blog_list_unauth():
    """GET /api/admin/blog without auth returns 401"""
    s = requests.Session()
    r = s.get(f"{BASE_URL}/api/admin/blog")
    assert r.status_code == 401

def test_admin_create_update_delete(auth_session):
    """Full CRUD: create post, update it, delete it"""
    # CREATE
    payload = {
        "title": "TEST_Article Automation",
        "slug": "test-article-automation-xyz123",
        "content": "<p>Test content</p>",
        "category": "AI per Aziende",
        "published": False
    }
    r = auth_session.post(f"{BASE_URL}/api/admin/blog", json=payload)
    assert r.status_code == 200
    post = r.json()
    assert post["title"] == payload["title"]
    post_id = post["id"]

    # UPDATE
    r2 = auth_session.put(f"{BASE_URL}/api/admin/blog/{post_id}", json={"title": "TEST_Updated Title"})
    assert r2.status_code == 200
    assert r2.json()["title"] == "TEST_Updated Title"

    # DELETE
    r3 = auth_session.delete(f"{BASE_URL}/api/admin/blog/{post_id}")
    assert r3.status_code == 200

def test_admin_create_duplicate_slug(auth_session):
    """POST with duplicate slug returns 400"""
    r = auth_session.post(f"{BASE_URL}/api/admin/blog", json={
        "title": "Duplicate",
        "slug": "ai-trasforma-customer-service",
        "content": "<p>dup</p>",
        "category": "AI per Aziende"
    })
    assert r.status_code == 400

def test_logout(auth_session):
    """POST /api/auth/logout clears cookie"""
    r = auth_session.post(f"{BASE_URL}/api/auth/logout")
    assert r.status_code == 200
