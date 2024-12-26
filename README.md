# **LOCATION API**

## Setup env

- Copy `.env.example` to `.env`
- Fill in the empty values

## Create database

- Create database with name same as `DATABASE_NAME` in `.env`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

### API Endpoint: `/api/v1/locations`

- #### Create first root location - `POST /api/v1/locations`
Request

```bash
$ curl -X POST 'http://{url}/api/v1/locations' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "A",
    "locationNumber": "A"
}
```

Response

```json
{
  "name": "A",
  "locationNumber": "A",
  "area": null,
  "parent": null,
  "id": "{root-id}"
}
```

- #### Create children location - `POST /api/v1/locations`
> Level 1

Request

```bash
$ curl -X POST 'http://{url}/api/v1/locations' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Level 1",
    "locationNumber": "A-01",
    "area": 100920,
    "parentId": "{root-id}"
}
```

Response

```json
{
  "name": "Level 1",
  "locationNumber": "A-01",
  "area": 100920,
  "parent": {
    "id": "{root-id}",
    "name": "A",
    "locationNumber": "A",
    "area": null
  },
  "id": "{level-1-id}"
}
```

> Level 2

Request

```bash
$ curl -X POST 'http://{url}/api/v1/locations' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Master Room",
    "locationNumber": "A-01-01",
    "area": 50110,
    "parentId": "{1st-level-id}"
}
```

Response

```json
{
  "name": "Master Room",
  "locationNumber": "A-01-01",
  "area": 50110,
  "parent": {
    "id": "{1st-level-id}",
    "name": "Level 1",
    "locationNumber": "A-01",
    "area": 100920
  },
  "id": "{2nd-level-id}"
}
```

- #### Get all locations - `GET /api/v1/locations`
Request

```bash
$ curl -X GET 'http://{url}/api/v1/locations'
```

Response

```json
[
  {
    "id": "{1st-level-id}",
    "locationNumber": "A-01",
    "area": 100920,
    "parentId": "{root-id}",
    "rootName": "A",
    "name": "Level 1"
  },
  {
    "id": "{2nd-level-id}",
    "locationNumber": "A-01-01",
    "area": 50110,
    "parentId": "{1st-level-id}",
    "rootName": "A",
    "name": "Master Room"
  }
]
```

- #### Get location by id - `GET /api/v1/locations/{id}`
Request

```bash
$ curl -X GET 'http://{url}/api/v1/locations/{id}'
```

Success Response

```json
{
  "id": "{id}",
  "name": "{location-name}",
  "locationNumber": "{location-number}",
  "area": {location-area},
}
```

Error Response - `404 Not Found`

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

- #### Update location - `PUT /api/v1/locations/{id}`
Request

```bash
$ curl -X PUT 'http://{url}/api/v1/locations/{id}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "{new-location-name}",
    "locationNumber": "{new-location-number}",
    "area": {new-location-area}
}
```

Success Response

```json
{
  "name": "{new-location-name}",
  "locationNumber": "{new-location-number}",
  "area": {new-location-area},
  "parent": {
    "id": "{parent-id}",
    "name": "{parent-name}",
    "locationNumber": "{parent-location-number}",
    "area": {parent-area}
  },
  "id": "{id}"
}
```

Error Response - `404 Not Found`

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Resource not found"
}
```

- #### Remove location - `DELETE /api/v1/locations/{id}`
Request

```bash
$ curl -X DELETE 'http://{url}/api/v1/locations/{id}'
```

SuccessResponse - `200 OK`

```json
{
  "id": "{id}"
}
```

ErrorResponse - `400 Bad Request`

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Cannot delete location with children"
}
```

## Logging

- All requests are logged in `nestjs-logging` format

```
LOG [HTTP] DELETE /api/v1/locations/xxx 200 - 77ms
LOG [HTTP] GET /api/v1/locations 200 - 77ms
...
```

## Error Handling

- All unknown errors from database actions are handled by `DatabaseExceptionFilter` and return `400 Bad Request` response

```json
{
  "statusCode": 400,
  "error": "Action failed",
  "message": "Failed to perform action. Please try again later"
}
```
