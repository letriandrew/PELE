# Use the official Python image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code into the /app directory
COPY ./app ./app

# Expose the port your app runs on
EXPOSE 8000

# Command to run your FastAPI app
ENV PYTHONPATH=/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
