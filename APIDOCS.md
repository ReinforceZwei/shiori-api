# Shiori API

API base: `/api`

## Request

All request should include their access token in the header except login route.
| Name | Description |
| - | - |
| `Authorization` | Access token in `bearer <the token>` format |

Post body accept JSON and x-www-form-urlencoded format.

## Response

All response body are in JSON format with the following format
```json
{
    "code": 200,
    "msg": "ok",
    "data": { ... }
}
```
| Name | Type | Description |
| - | - | - |
| `code` | `number` | Same as HTTP response code |
| `msg` | `string` | Short description of the response (most of the time will be "ok") |
| `data` | `object` or `array` | Contain response data. If no data returned, key will be absented |

Special Data Type
| Type | Description |
| - | - |
| `datetime` | Datetime in ISO format (e.g. `2032-04-19T09:10:34.493Z`) |

### GET `/`

```json
{"msg": "shiori API"}
```

## `User`

### POST `/user/login`

Parameters
| Name | Type | Description |
| - | - | - |
| `name` | `string` | Login user name |
| `password` | `string` | Login password |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `token` | `string` | Access token |
| `not_after` | `datetime` | Access token expire time |

Error
| Code | Description |
| - | - |
| `401` | Incorrect name or password |
| `400` | Missing name or password parameters |

### POST `/user/logout`

Return `200`

Error
| Code | Description |
| - | - |
| `401` | Unauthorized |

### POST `/user/create`

Parameters
| Name | Type | Description |
| - | - | - |
| `name` | `string` | User name |
| `password` | `string` | Password |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing name or password parameters, or other error (see `msg`) |

## Bookmark

### GET `/bookmark/{id}`

Get the details of a bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |
| `user_id` | `number` | Owner ID |
| `order_id` | `number` | Order number for sorting |
| `name` | `string` | Bookmark name |
| `url` | `string` | Bookmark URL |
| `add_time` | `datetime` | Add time of the bookmark |

Error
| Code | Description |
| - | - |
| `400` | Missing id parameter |
| `404` | Not found |

### PATCH `/bookmark/{id}`

Update information of a bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |

Parameters (`body`)
| Name | Type | Description |
| - | - | - |
| `name` | `string` | New bookmark name |
| `url` | `string` | New bookmark URL |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### DELETE `/bookmark/{id}`

Delete a bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/bookmark/create`

Create new bookmark

Parameters (`body`)
| Name | Type | Description |
| - | - | - |
| `name` | `string` | Bookmark name |
| `url` | `string` | Bookmark URL |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `bookmark_id` | `number` | ID of the new bookmark |

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |

### GET `/bookmark/list`

List all bookmarks

Return `array` with `200`
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |
| `user_id` | `number` | Owner ID |
| `order_id` | `number` | Order number for sorting |
| `name` | `string` | Bookmark name |
| `url` | `string` | Bookmark URL |
| `add_time` | `datetime` | Add time of the bookmark |

## Collection

### GET `/collection/{id}`

Get the details of a collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |
| `user_id` | `number` | Owner ID |
| `order_id` | `number` | Order number for sorting |
| `name` | `string` | Collection name |

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### PATCH `/collection/{id}`

Update name of the collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### DELETE `/collection/{id}`

Delete the collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/collection/create`

Create new collection

Parameters (`body`)
| Name | Type | Description |
| - | - | - |
| `name` | `string` | Collection name |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `collection_id` | `number` | ID of the new created collection |

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |

### GET `/collection/list`

List all collections

Return `array` with `200`
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |
| `user_id` | `number` | Owner ID |
| `order_id` | `number` | Order number for sorting |
| `name` | `string` | Collection name |

---

### POST `/collection/{id}/add`

Move a bookmark into collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |

Parameters (`body`)
| Name | Type | Description |
| - | - | - |
| `bookmark_id` | `number` | Bookmark ID to be moved |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### GET `/collection/{id}/items`

Get all bookmarks in a collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |

Return `array` with `200`
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |
| `user_id` | `number` | Owner ID |
| `order_id` | `number` | Order number for sorting |
| `name` | `string` | Bookmark name |
| `url` | `string` | Bookmark URL |
| `add_time` | `datetime` | Add time of the bookmark |

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/collection/{id}/remove`

Remove a bookmark from collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |

Parameters (`body`)
| Name | Type | Description |
| - | - | - |
| `bookmark_id` | `number` | Bookmark ID to be removed |

Return `200`

### GET `/collection/none/items`

Get all bookmarks that are not in any collections

Return `array` with `200`
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |
| `user_id` | `number` | Owner ID |
| `order_id` | `number` | Order number for sorting |
| `name` | `string` | Bookmark name |
| `url` | `string` | Bookmark URL |
| `add_time` | `datetime` | Add time of the bookmark |

---

### POST `/collection/{id}/order/{bookmark_id}/after/{after_bookmark}`

Reorder a bookmark in the collection

Changes will be reflected on `order_id` of the bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |
| `bookmark_id` | `number` | Bookmark ID to be moved |
| `after_bookmark` | `number` | Move bookmark to position after this bookmark |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/collection/none/order/{bookmark_id}/after/{after_bookmark}`

Reorder a bookmark that is not in any collections

Changes will be reflected on `order_id` of the bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `bookmark_id` | `number` | Bookmark ID to be moved |
| `after_bookmark` | `number` | Move bookmark to position after this bookmark |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/collection/order/{id}/after/{after_collection}`

Reorder a collection

Changes will be reflected on `order_id` of the collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID to be moved |
| `after_collection` | `number` | Move collection to position after this collection |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

## Other route

### GET `/title`

Get the page title (i.e. the `<title>...</title>` tag) of a URL

Parameters (`query`)
| Name | Type | Description |
| - | - | - |
| `url` | `string` | URL to fetch |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `title` | `string` | Title of the page. Will be an empty string if fail to fetch the title |

### POST `/import`

Upload and import a `NETSCAPE-Bookmark-file-1` format of bookmark file to this application

This route accept `multipart/form-data` body format

If multiple files were uploaded, only the first file will be used

Return `201`

Error
| Code | Description |
| - | - |
| `400` | Missing file |