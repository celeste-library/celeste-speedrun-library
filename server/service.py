from pathlib import PurePosixPath

from sqlalchemy.orm import Session

from config import WEB_METADATA_IMAGE_ROOT
from database import repository
from database.connector import engine


def get_api_status():
    return {'success': True}


def get_chapters():
    with Session(engine) as session:
        return [{
            'token': chapter.token,
            'name': chapter.full_name,
            'group': chapter.chapter_parent.name,
            'side': chapter.side,
            'image': str(WEB_METADATA_IMAGE_ROOT.joinpath('chapters', chapter.relative_path, 'icon.png')),
        } for chapter in repository.get_chapters(session)]


def get_checkpoints(chapter):
    with Session(engine) as session:
        return [{
            'token': checkpoint.token,
            'name': checkpoint.name,
            'image': str(PurePosixPath(WEB_METADATA_IMAGE_ROOT, 'room-previews', checkpoint.image)),
        } for checkpoint in repository.get_checkpoints(session, chapter)]


def get_rooms(checkpoint):
    with Session(engine) as session:
        return [{
            'code': room.code,
            'image': str(PurePosixPath(WEB_METADATA_IMAGE_ROOT, 'room-previews', room.image)),
            'connected': [connected.code for connected in room.connected_rooms],
        } for room in repository.get_rooms(session, checkpoint)]


def get_categories():
    with Session(engine) as session:
        return [{
            'token': category.token,
            'name': category.name,
        } for category in repository.get_level_categories(session)]


def get_strats(chapter, room, **kwargs):
    with Session(engine) as session:
        return [{
            'name': strat.nickname,
            'description': strat.description,
            'notes': strat.notes,
            'start': ' '.join((strat.start_room.code, strat.start_detail)),
            'end': ' '.join((strat.end_room.code, strat.end_detail)),
        } for strat in repository.get_strats_for_room(session, chapter, room, kwargs.get('category'))]
