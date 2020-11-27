### users
| column | type | details |
| -- | -- | -- |
| id | Int | 主键 |
| name | varchar(255) | 用户名 |
| email | varchar(255) | 邮箱 |
| salt | varchar(255) | 生成hash的盐 |
| hash | varchar(255) | 根据密码和salt生成的哈希 |
| token | varchar(255) | md5(email + hash) |
| role | enum('visitor', 'user', 'admin') | 角色（游客，用户，管理员） |
| timestamp | datetime | 最后一次操作的时间戳 |