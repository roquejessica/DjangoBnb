FROM python:3.12-slim

WORKDIR /usr/src/djangobnb_backend

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y netcat-openbsd

RUN pip install --upgrade pip

# this is to copy the requirements.txt file to the container
COPY ./requirements.txt ./
RUN pip install -r requirements.txt

COPY  ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/djangobnb_backend/entrypoint.sh
RUN chmod +x /usr/src/djangobnb_backend/entrypoint.sh

# this is to copy the rest of the files to the container
COPY . .

ENTRYPOINT ["/usr/src/djangobnb_backend/entrypoint.sh"]