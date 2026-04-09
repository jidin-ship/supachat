from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
conn = psycopg2.connect(
	host=os.getenv("DB_HOST"),
	database=os.getenv("DB_NAME"),
	user=os.getenv("DB_USER"),
	password=os.getenv("DB_PASSWORD"),
	port=os.getenv("DB_PORT"),
	sslmode="require"
)


# Health check API
@app.get("/health")
def health():
    return {"status": "ok"}


# Query translator function
def translate_query(user_query: str):
    if "top trending topics" in user_query.lower():
        return "SELECT topic, COUNT(*) as views FROM articles GROUP BY topic ORDER BY views DESC LIMIT 5;"

    if "daily views" in user_query.lower():
        return "SELECT date, SUM(views) FROM articles GROUP BY date ORDER BY date;"

    return "SELECT * FROM articles LIMIT 10;"


# Query API
@app.post("/query")
def query_db(user_query: str):
    try:
        sql = translate_query(user_query)
        print("Running SQL:", sql)

        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
        cur.close()

        return {
            "query": sql,
            "data": rows
        }

    except Exception as e:
        return {
            "error": str(e)
        }

