FROM python:3.12

WORKDIR /app

COPY . .

RUN pip install fastapi uvicorn psycopg2-binary python-dotenv

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
