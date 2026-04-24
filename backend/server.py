from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, Request, HTTPException, Depends, Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os, bcrypt, logging
import jwt as pyjwt

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# CORS
_origins = [o.strip() for o in os.environ.get("FRONTEND_URL", "http://localhost:3000").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return pyjwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non autenticato")
    try:
        payload = pyjwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token non valido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Utente non trovato")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token scaduto")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token non valido")

def fmt(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc

# ---------- Models ----------

class LoginRequest(BaseModel):
    email: str
    password: str

class BlogPostCreate(BaseModel):
    title: str
    title_en: Optional[str] = None
    slug: str
    content: str
    content_en: Optional[str] = None
    excerpt: Optional[str] = ""
    excerpt_en: Optional[str] = None
    category: str
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    published: bool = False
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = []

class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    title_en: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    content_en: Optional[str] = None
    excerpt: Optional[str] = None
    excerpt_en: Optional[str] = None
    category: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    published: Optional[bool] = None
    cover_image: Optional[str] = None
    tags: Optional[List[str]] = None

class ContactRequest(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    message: str
    service: Optional[str] = None

# ---------- Auth Routes ----------

@api_router.post("/auth/login")
async def login(body: LoginRequest, response: Response):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email o password non corretti")
    user_id = str(user["_id"])
    token = create_access_token(user_id, email)
    response.set_cookie(key="access_token", value=token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    return {"id": user_id, "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logout effettuato"}

@api_router.get("/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user

# ---------- Blog Public Routes ----------

@api_router.get("/blog")
async def get_posts(category: Optional[str] = None, limit: int = 10, skip: int = 0):
    q = {"published": True}
    if category and category != "all":
        q["category"] = category
    posts = await db.blog_posts.find(q, {"content": 0, "content_en": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.blog_posts.count_documents(q)
    return {"posts": [fmt(p) for p in posts], "total": total, "has_more": (skip + limit) < total}

@api_router.get("/blog/{slug}")
async def get_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "published": True})
    if not post:
        raise HTTPException(status_code=404, detail="Articolo non trovato")
    return fmt(post)

# ---------- Admin Blog Routes ----------

@api_router.get("/admin/blog")
async def admin_list(current_user: dict = Depends(get_current_user)):
    posts = await db.blog_posts.find({}).sort("created_at", -1).to_list(200)
    return [fmt(p) for p in posts]

@api_router.post("/admin/blog")
async def admin_create(body: BlogPostCreate, current_user: dict = Depends(get_current_user)):
    if await db.blog_posts.find_one({"slug": body.slug}):
        raise HTTPException(status_code=400, detail="Slug già in uso")
    doc = body.model_dump()
    now = datetime.now(timezone.utc).isoformat()
    doc["created_at"] = now
    doc["updated_at"] = now
    res = await db.blog_posts.insert_one(doc)
    created = await db.blog_posts.find_one({"_id": res.inserted_id})
    return fmt(created)

@api_router.put("/admin/blog/{post_id}")
async def admin_update(post_id: str, body: BlogPostUpdate, current_user: dict = Depends(get_current_user)):
    upd = {k: v for k, v in body.model_dump().items() if v is not None}
    upd["updated_at"] = datetime.now(timezone.utc).isoformat()
    r = await db.blog_posts.update_one({"_id": ObjectId(post_id)}, {"$set": upd})
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post non trovato")
    return fmt(await db.blog_posts.find_one({"_id": ObjectId(post_id)}))

@api_router.delete("/admin/blog/{post_id}")
async def admin_delete(post_id: str, current_user: dict = Depends(get_current_user)):
    r = await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post non trovato")
    return {"message": "Eliminato"}

@api_router.get("/admin/contacts")
async def admin_contacts(current_user: dict = Depends(get_current_user)):
    contacts = await db.contacts.find({}).sort("created_at", -1).to_list(100)
    return [fmt(c) for c in contacts]

# ---------- Contact ----------

@api_router.post("/contact")
async def contact(body: ContactRequest):
    doc = body.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    await db.contacts.insert_one(doc)
    return {"message": "Messaggio inviato! Ti risponderemo entro 24 ore."}

@api_router.get("/")
async def root():
    return {"message": "Matar.AI API v1.0"}

app.include_router(api_router)

# ---------- Startup ----------

@app.on_event("startup")
async def startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.blog_posts.create_index("slug", unique=True)
    except Exception as e:
        logger.warning(f"Index: {e}")

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@matarai.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "MataRAI2024!")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email, "password_hash": hash_password(admin_password),
            "name": "Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin created: {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password synced")

    if await db.blog_posts.count_documents({}) == 0:
        now = datetime.now(timezone.utc).isoformat()
        sample = [
            {"title": "Come l'AI trasforma il customer service aziendale", "title_en": "How AI Transforms Business Customer Service",
             "slug": "ai-trasforma-customer-service",
             "content": "<h2>Il problema del customer service tradizionale</h2><p>Le aziende spendono milioni ogni anno in team di supporto clienti che gestiscono le stesse domande ripetitive. Il risultato? Costi elevati, tempi di risposta lenti e clienti insoddisfatti.</p><h2>La soluzione: Agenti AI personalizzati</h2><p>Un agente AI ben addestrato può gestire fino al 70% delle richieste in entrata, rispondere 24/7 in qualsiasi lingua e scalare senza costi aggiuntivi.</p><h2>Risultati reali dopo 3 mesi</h2><ul><li>70% riduzione dei ticket manuali</li><li>Tempo di risposta da 4 ore a 30 secondi</li><li>Soddisfazione clienti aumentata del 35%</li><li>Risparmio annuo stimato: 120.000€</li></ul><h2>Come iniziare</h2><p>Non serve una grande infrastruttura IT. Bastano 3 settimane per analisi, configurazione e go-live del tuo agente AI personalizzato.</p>",
             "excerpt": "Scopri come un agente AI può ridurre del 70% i ticket di supporto e rispondere ai clienti in 30 secondi, 24/7.",
             "category": "AI per Aziende", "seo_title": "AI nel Customer Service: Come Ridurre Costi e Migliorare la Soddisfazione",
             "seo_description": "Guida pratica su come implementare un agente AI per il customer service aziendale.",
             "published": True, "cover_image": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop",
             "tags": ["AI", "Customer Service", "Automazione"], "created_at": now, "updated_at": now},
            {"title": "Formazione AI in azienda: perché il 90% dei training fallisce", "title_en": "AI Training in Business: Why 90% of Programs Fail",
             "slug": "formazione-ai-azienda-errori",
             "content": "<h2>Il problema della formazione AI generica</h2><p>La maggior parte dei corsi AI si concentra su concetti teorici. Ma i dipendenti hanno bisogno di usare l'AI nel loro lavoro quotidiano.</p><h2>I 3 errori più comuni</h2><ol><li><strong>Training teorico senza applicazione pratica</strong></li><li><strong>One-size-fits-all invece di formazione per ruolo</strong></li><li><strong>Nessun follow-up dopo il corso</strong></li></ol><h2>Il metodo che funziona</h2><p>La formazione Matar.AI è 100% pratica, divisa per ruolo e include sessioni di follow-up mensili.</p>",
             "excerpt": "Il 90% della formazione AI aziendale fallisce perché è teorica e generica. Scopri il metodo pratico che funziona.",
             "category": "Formazione AI", "seo_title": "Formazione AI per Aziende: Errori Comuni e Come Evitarli",
             "seo_description": "Come evitare i 3 errori più comuni nella formazione AI e garantire l'adozione reale.",
             "published": True, "cover_image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
             "tags": ["Formazione", "AI", "Team"], "created_at": now, "updated_at": now},
            {"title": "AR e VR nel marketing B2B: dati e casi d'uso concreti", "title_en": "AR and VR in B2B Marketing: Data and Use Cases",
             "slug": "ar-vr-marketing-b2b",
             "content": "<h2>Perché le esperienze immersive funzionano nel B2B</h2><p>Le esperienze AR/VR tagliano il ciclo di vendita del 30-40% perché permettono ai decision maker di 'vivere' il prodotto prima di acquistarlo.</p><h2>Use case reali</h2><ul><li><strong>Showroom virtuale</strong>: +200% demo completate, -45% costi di vendita</li><li><strong>Configuratore AR</strong>: visualizzazione prodotto in tempo reale</li><li><strong>Training immersivo</strong>: -60% costi di formazione</li></ul>",
             "excerpt": "Come AR e VR rivoluzionano il marketing B2B con cicli di vendita più corti e conversioni superiori.",
             "category": "Trend AI", "seo_title": "AR e VR nel Marketing B2B: Use Case e ROI Concreti",
             "seo_description": "Casi d'uso reali di AR e VR nel marketing B2B.",
             "published": True, "cover_image": "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&auto=format&fit=crop",
             "tags": ["AR", "VR", "Marketing B2B"], "created_at": now, "updated_at": now},
        ]
        try:
            await db.blog_posts.insert_many(sample)
            logger.info("Sample posts seeded")
        except Exception as e:
            logger.warning(f"Seed: {e}")

    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write(f"""# Test Credentials - Matar.AI\n\n## Admin Account\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n- Login URL: /admin/login\n\n## API Endpoints\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n- GET /api/blog\n- GET /api/blog/:slug\n- GET /api/admin/blog (auth required)\n- POST /api/admin/blog (auth required)\n- PUT /api/admin/blog/:id (auth required)\n- DELETE /api/admin/blog/:id (auth required)\n- POST /api/contact\n""")

@app.on_event("shutdown")
async def shutdown():
    client.close()
