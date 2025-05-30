# Cocos Challenge - Backend

## Descripción

API REST desarrollada para el Cocos Challenge.

1. Instalar dependencias:

```bash
yarn install
```

2. Configurar variables de entorno:

- Crear un archivo `.env` en la raíz del proyecto
- Copiar el contenido de `.env.example`
- Configurar las variables necesarias

## Ejecución del Proyecto

### Desarrollo

```bash
yarn watch
```

El servidor se iniciará en `http://localhost:3000`

### Producción

```bash
yarn watch
```

## Pruebas

Para ejecutar las pruebas:

```bash
yarn test
```

## Documentación de la API

### Postman

- Importar la colección: `postman/portfolio-api.postman_collection.json`
- Configurar la variable de entorno `baseUrl` en Postman: `http://localhost:3000`

## Estructura del Proyecto

```
src/
  ├── controllers/   # Controladores de la aplicación
  ├── routes/        # Rutas de la API
  ├── services/      # Lógica de negocio
  └── repositories/  # Queries a la BD

```

## Scripts Disponibles

- `yarn watch`: Inicia el servidor en modo desarrollo con hot-reload
- `yarn test`: Ejecuta las pruebas
- `yarn lint:fix`: Ejecuta el linter

## Suposiciones / Decisiones

1. El procesamiento de las ordenes queda fuera del scope
2. Por la suposición anterior, el balance se actualiza al procesar las ordenes, no al agregarlas a la tabla
3. El enunciado es ambiguo al hablar de cancelar ordenes pero no requería un endpoint para hacerlo
4. Opté por no usar un ORM por un tema de simpleza
