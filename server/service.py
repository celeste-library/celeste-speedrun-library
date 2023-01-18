from sqlalchemy.orm import Session

import api_resource
from database import repository
from database.connector import engine


def get_api_status():
    return {'success': True}


def get_chapters():
    with Session(engine) as session:
        return list(map(api_resource.from_chapter, repository.get_chapters(session)))


def get_checkpoints(chapter):
    with Session(engine) as session:
        return list(map(api_resource.from_checkpoint, repository.get_checkpoints(session, chapter)))


def get_rooms(checkpoint):
    with Session(engine) as session:
        return [api_resource.from_room(room, True) for room in repository.get_rooms(session, checkpoint)]


def get_categories():
    with Session(engine) as session:
        return list(map(api_resource.from_level_category, repository.get_level_categories(session)))


def get_strats(room, **kwargs):
    with Session(engine) as session:
        return list(map(api_resource.from_strat,
                        repository.get_strats_for_room(session, room, kwargs.get('category'))))
