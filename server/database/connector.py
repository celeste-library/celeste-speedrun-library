from sqlalchemy import create_engine


def db_url(dialect: str, driver: str, datasource: str):
    return f'{dialect}+{driver}://{datasource}'


def in_memory_db_url():
    return db_url('sqlite', 'pysqlite', '/:memory:')


def network_db_url(dialect: str, driver: str, host: str, port: int, username: str, password: str, database: str):
    return db_url(dialect, driver, f'{username}:{password}@{host}:{port}/{database}')


def mariadb_local_url(username: str, password: str, database: str):
    return network_db_url('mariadb', 'mariadbconnector', '127.0.0.1', 3306, username, password, database)


engine = create_engine(db_url('sqlite', 'pysqlite', '/temp.db'))
