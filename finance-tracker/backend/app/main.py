from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.routers import auth, category, transaction, ai

app = FastAPI(
    title="Finance Tracker API",
    description="AI-Powered Personal Finance Tracker",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:3000",
    "https://finance-tracker-ashy-iota.vercel.app",
    "https://finance-tracker-git-main-udieshs-projects.vercel.app",
    "https://finance-tracker-qnw24rom7-udieshs-projects.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, )
app.include_router(category.router)
app.include_router(transaction.router)
app.include_router(ai.router)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Finance Tracker API",
        version="1.0.0",
        description="AI-Powered Personal Finance Tracker",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return openapi_schema


app.openapi = custom_openapi


@app.get("/")
def root():
    return {"message": "Finance Tracker API is running 🚀"}