# Postgres Music Library

An postgres version of the music library. Intended for deployment on render.com

## Running a Postgres container

```bash
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres

```

## Running a PgAdmin4 container

```bash
run -p 5050:80 --name pg-admin -e 'PGADMIN_DEFAULT_EMAIL=admin@email.com' -e 'PGADMIN_DEFAULT_PASSWORD=password' -d dpage/pgadmin4
```

## Get ip address for postgres container

```bash
docker inspect postgres | grep IPAddress
```
