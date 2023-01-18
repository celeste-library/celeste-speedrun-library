from pathlib import PurePosixPath

from config import WEB_METADATA_IMAGE_ROOT
from database import tables


def from_chapter(chapter: tables.Chapter):
    return {
        'token': chapter.token,
        'name': chapter.full_name,
        'group': chapter.chapter_parent.name,
        'side': chapter.side,
        'image': str(WEB_METADATA_IMAGE_ROOT.joinpath('chapters', chapter.relative_path, 'icon.png')),
    }


def from_checkpoint(checkpoint: tables.Checkpoint):
    return {
        'token': checkpoint.token,
        'name': checkpoint.name,
        'image': str(PurePosixPath(WEB_METADATA_IMAGE_ROOT, 'room-previews', checkpoint.image)),
    }


def from_room(room: tables.Room, with_connected=False):
    connections = {
        'connected': [from_room(connected) for connected in room.connected_rooms],
    } if with_connected else {}
    return {
        'token': room.token,
        'code': room.code,
        'image': str(PurePosixPath(WEB_METADATA_IMAGE_ROOT, 'room-previews', room.image)),
        **connections,
    }


def from_level_category(category: tables.LevelCategory):
    return {
        'token': category.token,
        'name': category.name,
    }


def from_strat(strat: tables.Strat):
    return {
        'name': strat.nickname,
        'description': strat.description,
        'notes': strat.notes,
        'start': ' '.join((strat.start_room.code, strat.start_detail)),
        'end': ' '.join((strat.end_room.code, strat.end_detail)),
    }