from typing import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from .tables import Chapter, Checkpoint, LevelCategory, LevelRoute, Room, Strat


# from generated.openapi_server.models import Chapter


def get_chapters(session: Session) -> Iterable[Chapter]:
    return session.scalars(select(Chapter))


def get_chapter(session: Session, chapter_token: str) -> Chapter:
    return session.scalar(select(Chapter).where(Chapter.token == chapter_token))


def get_checkpoints(session: Session, chapter_token: str) -> Iterable[Checkpoint]:
    return session.scalars(select(Checkpoint).join(Checkpoint.chapter.and_(Chapter.token == chapter_token)))


def get_checkpoint(session: Session, checkpoint_token: str) -> Checkpoint:
    return session.scalar(select(Checkpoint).where(Checkpoint.token == checkpoint_token))


def get_rooms(session: Session, checkpoint_token: str, category: str = None) -> Iterable[Room]:
    if category:
        route_ids = list(session.scalars(
                select(LevelRoute.id)
                .join(LevelRoute.category.and_(LevelCategory.token == category))
                .join(LevelRoute.chapter)
                .join(Chapter.checkpoints.and_(Checkpoint.token == checkpoint_token)))
        )
        if route_ids:
            return session.scalars(
                    select(Room)
                    .where(LevelRoute.rooms.and_(LevelRoute.id.in_(route_ids)))
                    .join(Room.checkpoint.and_(Checkpoint.token == checkpoint_token))
                    .options(selectinload(Room.connected_rooms.and_(Room.id.in_(
                            select(Room.id)
                            .join(LevelRoute.rooms)
                            .where(LevelRoute.id.in_(route_ids))
                    ))))
            ).unique()
    return session.scalars(select(Room).join(Room.checkpoint.and_(Checkpoint.token == checkpoint_token)))


def get_room(session: Session, room_token: str, category: str = None) -> Room:
    if category:
        route_ids = list(session.scalars(
                select(LevelRoute.id)
                .join(LevelRoute.category.and_(LevelCategory.token == category))
                .join(LevelRoute.chapter)
                .join(Chapter.checkpoints)
                .join(Checkpoint.rooms.and_(Room.token == room_token)))
        )
        if route_ids:
            return session.scalar(
                    select(Room)
                    .where(Room.token == room_token)
                    .options(selectinload(Room.connected_rooms.and_(Room.id.in_(
                            select(Room.id)
                            .join(LevelRoute.rooms)
                            .where(LevelRoute.id.in_(route_ids))
                    ))))
            )
    return session.scalar(select(Room).where(Room.token == room_token))


def get_checkpoint_by_room(session: Session, room_token: str) -> Checkpoint:
    return session.scalar(select(Checkpoint).join(Checkpoint.rooms.and_(Room.token == room_token)))


def get_level_categories(session: Session) -> Iterable[LevelCategory]:
    return session.scalars(select(LevelCategory))


def get_strats_for_room(session: Session, room_token: str, category: str) -> Iterable[Strat]:
    query = (select(Strat).join(Strat.rooms.and_(Room.token == room_token)))
    if category is not None:
        query = query.join(Strat.categories.and_(LevelCategory.token == category))
    return session.scalars(query)


def get_strat(session: Session, strat_token: str) -> Strat:
    return session.scalar(select(Strat).where(Strat.token == strat_token))
