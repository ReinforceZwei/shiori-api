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
| `favicon` | `string` or `null` | Base64 encoded favicon |
| `collection_id` | `number` or `null` | Which collection this bookmark is in. `null` mean not in any collection |

Error
| Code | Description |
| - | - |
| `400` | Missing id parameter |
| `404` | Not found |

### PATCH `/bookmark/{id}`

Update information of a bookmark. Will update values that are given in the body only

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Bookmark ID |

Parameters (`body`)
| Name | Type | Description |
| - | - | - |
| `name` | `string` | (Optional) New bookmark name |
| `url` | `string` | (Optional) New bookmark URL |
| `favicon` | `string` | (Optional) New base64 encoded favicon. Use `null` to remove icon |
| `collection_id` | `number` | (Optional) Move to new collection. Use `null` to remove from any collection |

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
| `favicon` | `string` | (Optional) Base64 encoded favicon |
| `collection_id` | `number` | (Optional) Which collection the bookmark should be added to. Default is not in any collection |

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
| `favicon` | `string` or `null` | Base64 encoded favicon |
| `collection_id` | `number` or `null` | Which collection this bookmark is in. `null` mean not in any collection |

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

### POST `/collection/{id}/order/{bookmark_id}/{position}/{target_pos_id}`

Reorder a bookmark in the collection

Changes will be reflected on `order_id` of the bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID |
| `bookmark_id` | `number` | Bookmark ID to be moved |
| `position` | `string` | Where to put the moving bookmark. Must be `before` or `after` |
| `target_pos_id` | `number` | Move bookmark to position before/after this bookmark ID |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/collection/none/order/{bookmark_id}/{position}/{target_pos_id}`

Reorder a bookmark that is not in any collections

Changes will be reflected on `order_id` of the bookmark

Parameters
| Name | Type | Description |
| - | - | - |
| `bookmark_id` | `number` | Bookmark ID to be moved |
| `position` | `string` | Where to put the moving bookmark. Must be `before` or `after` |
| `target_pos_id` | `number` | Move bookmark to position before/after this bookmark ID |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

### POST `/collection/order/{id}/{position}/{target_pos_id}`

Reorder a collection

Changes will be reflected on `order_id` of the collection

Parameters
| Name | Type | Description |
| - | - | - |
| `id` | `number` | Collection ID to be moved |
| `position` | `string` | Where to put the moving bookmark. Must be `before` or `after` |
| `target_pos_id` | `number` | Move collection to position before/after this coolection ID |

Return `200`

Error
| Code | Description |
| - | - |
| `400` | Missing parameters |
| `404` | Not found |

## Utils routes

### GET `/title`

Get the page title (i.e. the `<title>...</title>` tag) of a URL. You may use this endpoint to auto-fill bookmark name for user

Parameters (`query`)
| Name | Type | Description |
| - | - | - |
| `url` | `string` | URL to fetch |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `title` | `string` | Title of the page. Will be an empty string if fail to fetch the title |

### GET `/favicon`

Get the page icon of a URL. You may use this endpoint to auto-fill bookmark icon for user

Parameters (`query`)
| Name | Type | Description |
| - | - | - |
| `url` | `string` | URL to fetch |

Return `object` with `200`
| Name | Type | Description |
| - | - | - |
| `favicon` | `string` | Base64 encoded icon. Will be null if fail to fetch the icon |

### POST `/import`

Upload and import a `NETSCAPE-Bookmark-file-1` format of bookmark file to this application

This route accept `multipart/form-data` body format

If multiple files were uploaded, only the first file will be used

Return `201`

Error
| Code | Description |
| - | - |
| `400` | Missing file |