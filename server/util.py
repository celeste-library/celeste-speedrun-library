from pathlib import Path

from sqlalchemy.orm import Session

import service
from config import METADATA_DIR, SPEEDRUN_DATA_DIR
from database.connector import engine
from database.loader import load_all_data
from database.tables import Base


def initial_database_setup():
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        load_all_data(session, METADATA_DIR, SPEEDRUN_DATA_DIR)
        session.commit()


if __name__ == '__main__':
    try:
        Path('temp.db').unlink()
    except FileNotFoundError:
        pass
    initial_database_setup()
    print(service.get_chapters())
    print(service.get_checkpoints('city-a'))
    print(service.get_rooms('city-a-1'))
