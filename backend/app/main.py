from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router

app = FastAPI(
    title="Customer Management API",
    description="Backend API for Customer Management System",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Customer Management API is running"
    }


app.include_router(auth_router)
