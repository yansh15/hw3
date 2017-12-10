## `YXin`

### `TCP Data Format`

#### `constant`

##### `op`

| op | constant |
| :---: | :---: |
| register | 0 |
| login | 1 |

##### `register status`

| status | constant |
| :---: | :---: |
| success | 0 |
| timeout | 1 |
| username exists | 2 |

##### `login status`

| status | constant |
| :---: | :---: |
| success | 0 |
| timeout | 1 |
| username doesn't exists | 2 |
| password doesn't exists | 3 |

#### `register`

##### `request data`

```
op (1)
uuid (36)
username length (2)
password length (2)
username (username length)
password (password length)
```

##### `response data`

```
op (1)
uuid (36)
status (1)
```
