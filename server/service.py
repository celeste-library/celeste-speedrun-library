from sqlalchemy.orm import Session

import api_resource
from database import repository
from database.connector import engine


def get_api_status():
    return {'success': True}


def get_chapters():
    with Session(engine) as session:
        return list(map(api_resource.from_chapter, repository.get_chapters(session)))


def show_chapter(chapter):
    with Session(engine) as session:
        return api_resource.from_chapter(repository.get_chapter(session, chapter))


def get_checkpoints(chapter):
    with Session(engine) as session:
        return list(map(api_resource.from_checkpoint, repository.get_checkpoints(session, chapter)))


def show_checkpoint(checkpoint):
    with Session(engine) as session:
        return api_resource.from_checkpoint(repository.get_checkpoint(session, checkpoint))


def get_rooms(checkpoint, **kwargs):
    with Session(engine) as session:
        return [api_resource.from_room(room, True)
                for room in repository.get_rooms(session, checkpoint, kwargs.get('category'))]


def show_room(room, **kwargs):
    with Session(engine) as session:
        return api_resource.from_room(repository.get_room(session, room, kwargs.get('category')), True)


def get_checkpoint_by_room(room):
    with Session(engine) as session:
        return api_resource.from_checkpoint(repository.get_checkpoint_by_room(session, room))


def get_categories():
    with Session(engine) as session:
        return list(map(api_resource.from_level_category, repository.get_level_categories(session)))


def get_strats(room, **kwargs):
    with Session(engine) as session:
        return list(map(api_resource.from_strat,
                        repository.get_strats_for_room(session, room, kwargs.get('category'))))


def show_strat(strat):
    with Session(engine) as session:
        return api_resource.from_strat(repository.get_strat(session, strat))
