from sqlalchemy import select
from sqlalchemy.orm import Session

from .tables import Chapter, Checkpoint, Room, Strat, LevelCategory


# from generated.openapi_server.models import Chapter


def get_chapters(session: Session) -> list[Chapter]:
    return session.scalars(select(Chapter))


def get_checkpoints(session: Session, chapter_token: str) -> list[Checkpoint]:
    return session.scalars(select(Checkpoint).join(Checkpoint.chapter.and_(Chapter.token == chapter_token)))


def get_rooms(session: Session, checkpoint_token: str) -> list[Room]:
    return session.scalars(select(Room).join(Room.checkpoint.and_(Checkpoint.token == checkpoint_token)))


def get_level_categories(session: Session) -> list[LevelCategory]:
    return session.scalars(select(LevelCategory))


def get_strats_for_room(session: Session, room_token: str, category: str) -> list[Strat]:
    query = (select(Strat).join(Strat.rooms.and_(Room.token == room_token)))
    if category is not None:
        query = query.join(Strat.categories.and_(LevelCategory.token == category))
    return session.scalars(query)
