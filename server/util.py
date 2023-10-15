import argparse
from pathlib import Path

from sqlalchemy.orm import Session

import service
import config
from database.connector import engine
from database.loader import load_all_data
from database.tables import Base


def initial_database_setup(env):
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        load_all_data(session, env.METADATA_DIR, env.SPEEDRUN_DATA_DIR)
        session.commit()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--deploy", action='store_true')
    args = parser.parse_args()
    try:
        Path('temp.db').unlink()
    except FileNotFoundError:
        pass
    initial_database_setup(config.prod if args.deploy else config.dev)
    print('Data reloaded')
