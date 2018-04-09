# Contraloria General de la Republica - Geoportal

## Develop

### Backend

En Eclipse abrir el proyecto `backend` y desplegar en JBoss EAP 6.4.0

### Frontend

Instalar dependencias del proyecto

```bash
$ cd frontend/
$ npm install
```

Correr aplicación

```bash
$ npm start -- --scss
```

Si los servicios no responden asegurarse de que la app esté consumiendo la API correcta (`src/client/app/services/rest/rest.service.ts`)

## Production

```bash
$ cd backend/
$ mvn clean package -P production
```