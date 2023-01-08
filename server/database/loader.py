import json
from os import PathLike
from pathlib import Path
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import factory
from .tables import Chapter, Difficulty, FullGameCategory, LevelCategory, Room, Strat


def load_metadata(session: Session, file: PathLike):
    with open(file, mode='r') as f:
        metadata = json.load(f)
    for token, name in metadata['level_categories'].items():
        session.add(LevelCategory(token=token, name=name))
    for token, name in metadata['full_game_categories'].items():
        session.add(FullGameCategory(token=token, name=name))
    for difficulty in metadata['difficulties']:
        session.add(Difficulty(label=difficulty))


def load_chapter_tree(session: Session, file: PathLike):
    with open(file, mode='r') as f:
        chapter_tree = json.load(f)

    for chapter_data in chapter_tree['chapters']:
        chapter_parent = factory.chapter_parent(chapter_data['id'], chapter_data.get('chapterNo'), chapter_data['name'])
        session.add(chapter_parent)
        for side_data in chapter_data['sides']:
            chapter = factory.chapter(chapter_parent, side_data['id'], side_data['name'])
            session.add(chapter)
            checkpoint_by_room = {}
            for checkpoint_index, checkpoint_data in enumerate(side_data['checkpoints']):
                checkpoint = factory.checkpoint(chapter, checkpoint_index + 1, checkpoint_data['name'])
                session.add(checkpoint)
                for room_code in checkpoint_data['roomOrder']:
                    checkpoint_by_room[room_code] = checkpoint
            chapter_rooms_links = {}
            assert set(checkpoint_by_room.keys()) == set(side_data['rooms'].keys())
            for room_code in checkpoint_by_room:
                room_data = side_data['rooms'][room_code]
                room = factory.room(checkpoint_by_room[room_code], room_code, room_data['name'])
                session.add(room)
                chapter_rooms_links[room.code] = (room, room_data.get('linked', []))
            for room, links in chapter_rooms_links.values():
                room.connected_rooms = [chapter_rooms_links[room_code][0] for room_code in links]


def get_rooms_in_range(start_room: Room, start_detail: str, end_room: Room, end_detail: str) -> List[Room]:
    if start_room == end_room:
        return [start_room]
    return [start_room]


def load_chapter_strats(session: Session, file: PathLike, chapter: Chapter):
    with open(file) as f:
        strat_list = json.load(f)

    category_map = {category.token: category for category in session.scalars(select(LevelCategory))}

    for strat_data in strat_list:
        def split_safe(to_split):
            split = to_split.split(' ', 1)
            if len(split) == 1:
                return split[0], '*'
            return tuple(split)
        start_room_code, start_detail = split_safe(strat_data['start'])
        end_room_code, end_detail = split_safe(strat_data['end'])
        categories = [category_map[category] for category in strat_data['categories']]
        select_chapter_rooms = select(Room).join(Room.chapter.and_(Chapter.id == chapter.id))
        start_room = session.scalar(select_chapter_rooms.where(Room.code == start_room_code))
        end_room = session.scalar(select_chapter_rooms.where(Room.code == end_room_code))
        strat = Strat(nickname=strat_data['name'],
                      description=strat_data['description'],
                      notes=strat_data.get('notes'),
                      categories=categories,
                      start_room=start_room, start_detail=start_detail, end_room=end_room, end_detail=end_detail)
        strat.rooms = get_rooms_in_range(start_room, start_detail, end_room, end_detail)
        session.add(strat)


def load_all_data(session: Session, metadata_root: Path, speedrun_data_root: Path):
    load_metadata(session, speedrun_data_root.joinpath('metadata.json'))
    load_chapter_tree(session, metadata_root.joinpath('celeste.json'))
    chapters = session.scalars(select(Chapter))
    for chapter in chapters:
        strats_file = speedrun_data_root.joinpath(chapter.relative_path, 'strats.json')
        if strats_file.is_file():
            load_chapter_strats(session, strats_file, chapter)
