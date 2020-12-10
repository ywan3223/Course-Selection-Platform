### users
| column | type | details |
| -- | -- | -- |
| id | Int | 主键 |
| name | varchar(255) | 用户名 |
| email | varchar(255) | 邮箱 |
| salt | varchar(255) | 生成hash的盐 |
| hash | varchar(255) | 根据密码和salt生成的哈希 |
| token | varchar(255) | md5(name + hash) |
| role | enum('visitor', 'user', 'admin') | 角色（游客，用户，管理员） |
| state | enum('activated', 'deactivated') default 'activated' | 状态 |
| timestamp | datetime | 最后一次操作的时间戳 |

### schedules
| column | type | deatails |
| -- | -- | -- |
| id | int | 主键 |
| name | varchar(255) | 课程列表名 |
| user_id | int | 所属的用户 |
| type | enum('private', 'public') | 共有课程还是私有课程 |
| timestamp | datetime | 最后一次操作的时间戳 |

### courses
| column | type | details |
| -- | -- | -- |
| id | int | 主键 |
| schedule_id | int | 所属的课程列表 |
| subject | varchar(255) | 课程所在的院 |
| catalog | varchar(255) | 课程的编号 |
| timestamp | datatime | 最后一次操作的时间戳 |

