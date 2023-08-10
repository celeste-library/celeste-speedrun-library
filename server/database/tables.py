from pathlib import PurePosixPath
from typing import Optional

from sqlalchemy import Column, ForeignKey, Integer, JSON, String, Table, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    type_annotation_map = {
        dict: JSON
    }


class LevelCategory(Base):
    __tablename__ = 'level_category'
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]


class FullGameCategory(Base):
    __tablename__ = 'fullgame_category'
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]
    # chapter_parent: LevelCategory = relationship('LevelCategory')


class Difficulty(Base):
    __tablename__ = 'difficulty'
    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[Optional[str]]


class ChapterParent(Base):
    __tablename__ = 'chapter_parent'
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    number: Mapped[Optional[int]]
    name: Mapped[str]


class Chapter(Base):
    __tablename__ = 'chapter'
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    parent_id: Mapped[int] = mapped_column(ForeignKey('chapter_parent.id'))
    side: Mapped[Optional[str]] = mapped_column(String(1))
    UniqueConstraint(parent_id, side)
    relative_path: Mapped[str] = mapped_column(unique=True)
    chapter_parent: Mapped[ChapterParent] = relationship()
    checkpoints: Mapped[list['Checkpoint']] = relationship(back_populates='chapter')

    @property
    def full_name(self) -> str:
        if self.side != 'A':
            return f'{self.chapter_parent.name} {self.side}-Side'
        return self.chapter_parent.name


class Checkpoint(Base):
    __tablename__ = 'checkpoint'
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    chapter_id: Mapped[int] = mapped_column(ForeignKey('chapter.id'))
    number: Mapped[int]
    name: Mapped[str]
    chapter: Mapped[Chapter] = relationship(back_populates='checkpoints')
    rooms: Mapped[list['Room']] = relationship(back_populates='checkpoint')

    @property
    def image(self) -> PurePosixPath:
        return self.rooms[0].image


room_connections = Table('room_connections', Base.metadata,
                         Column('room_a_id', Integer, ForeignKey('room.id'), primary_key=True),
                         Column('room_b_id', Integer, ForeignKey('room.id'), primary_key=True))

room_strats = Table('room_strats', Base.metadata,
                    Column('room_id', Integer, ForeignKey('room.id'), primary_key=True),
                    Column('strat_id', Integer, ForeignKey('strat.id'), primary_key=True))


class Room(Base):
    __tablename__ = 'room'
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(unique=True)
    chapter_id: Mapped[int] = mapped_column(ForeignKey('chapter.id'))
    checkpoint_id: Mapped[int] = mapped_column(ForeignKey('checkpoint.id'))
    code: Mapped[str]
    nickname: Mapped[Optional[str]]
    checkpoint: Mapped[Checkpoint] = relationship(back_populates='rooms')
    chapter: Mapped[Chapter] = relationship()
    connected_rooms: Mapped[list['Room']] = relationship(secondary='room_connections',
                                                         primaryjoin=id == room_connections.c.room_a_id,
                                                         secondaryjoin=id == room_connections.c.room_b_id)
    strats: Mapped[list['Strat']] = relationship(secondary='room_strats', back_populates='rooms')
    UniqueConstraint('code', chapter_id)

    @property
    def image(self) -> PurePosixPath:
        return PurePosixPath(self.chapter.relative_path, self.code).with_suffix('.png')


class LevelRoute(Base):
    __tablename__ = 'level_route'
    id: Mapped[int] = mapped_column(primary_key=True)
    chapter_id: Mapped[int] = mapped_column(ForeignKey('chapter.id'))
    category_id: Mapped[int] = mapped_column(ForeignKey('level_category.id'))
    chapter: Mapped[Chapter] = relationship('Chapter')
    category: Mapped[LevelCategory] = relationship('LevelCategory')
    rooms: Mapped[list[Room]] = relationship('Room', secondary='route_rooms')


route_rooms = Table('route_rooms', Base.metadata,
                    Column('level_route_id', Integer, ForeignKey('level_route.id'), primary_key=True),
                    Column('room_id', Integer, ForeignKey('room.id'), primary_key=True))


class Strat(Base):
    __tablename__ = 'strat'
    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[Optional[str]]
    start_room_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('room.id'))
    start_detail: Mapped[Optional[str]]
    end_room_id: Mapped[Optional[int]] = mapped_column(ForeignKey('room.id'))
    end_detail: Mapped[Optional[str]]
    description: Mapped[Optional[str]]
    notes: Mapped[Optional[str]]
    media: Mapped[Optional[dict]]
    start_room: Mapped[Optional[Room]] = relationship(foreign_keys=start_room_id)
    end_room: Mapped[Optional[Room]] = relationship(foreign_keys=end_room_id)
    rooms: Mapped[list[Room]] = relationship(secondary=room_strats, back_populates='strats')
    categories: Mapped[list[LevelCategory]] = relationship('LevelCategory', secondary='strat_categories')


strat_categories = Table('strat_categories', Base.metadata,
                         Column('strat_id', Integer, ForeignKey('strat.id'), primary_key=True),
                         Column('level_category_id', Integer, ForeignKey('level_category.id'), primary_key=True))
