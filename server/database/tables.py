from pathlib import PurePosixPath

from sqlalchemy import Column, ForeignKey, Integer, String, Table, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class LevelCategory(Base):
    __tablename__ = 'level_category'
    id = Column(Integer, primary_key=True)
    token = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)


class FullGameCategory(Base):
    __tablename__ = 'fullgame_category'
    id = Column(Integer, primary_key=True)
    token = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    # chapter_parent: LevelCategory = relationship('LevelCategory')


class Difficulty(Base):
    __tablename__ = 'difficulty'
    id = Column(Integer, primary_key=True)
    label = Column(String)


class ChapterParent(Base):
    __tablename__ = 'chapter_parent'
    id = Column(Integer, primary_key=True)
    token = Column(String, nullable=False, unique=True)
    number = Column(Integer)
    name = Column(String, nullable=False)


class Chapter(Base):
    __tablename__ = 'chapter'
    id = Column(Integer, primary_key=True)
    token = Column(String, nullable=False, unique=True)
    parent_id = Column(Integer, ForeignKey('chapter_parent.id'), nullable=False)
    side = Column(String(1))
    UniqueConstraint(parent_id, side)
    relative_path = Column(String, nullable=False, unique=True)
    chapter_parent: ChapterParent = relationship('ChapterParent')
    checkpoints: list['Checkpoint'] = relationship('Checkpoint', back_populates='chapter')

    @property
    def full_name(self) -> str:
        if self.side != 'A':
            return f'{self.chapter_parent.name} {self.side}-Side'
        return self.chapter_parent.name


class Checkpoint(Base):
    __tablename__ = 'checkpoint'
    id = Column(Integer, primary_key=True)
    token = Column(String, nullable=False, unique=True)
    chapter_id = Column(Integer, ForeignKey('chapter.id'), nullable=False)
    number = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    chapter = relationship('Chapter', back_populates='checkpoints')
    rooms = relationship('Room', back_populates='checkpoint')

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
    id = Column(Integer, primary_key=True)
    chapter_id = Column(Integer, ForeignKey('chapter.id'), nullable=False)
    checkpoint_id = Column(Integer, ForeignKey('checkpoint.id'), nullable=False)
    code = Column(String, nullable=False)
    nickname = Column(String)
    checkpoint = relationship('Checkpoint', back_populates='rooms')
    chapter = relationship('Chapter')
    connected_rooms = relationship('Room',
                                   secondary='room_connections',
                                   primaryjoin=id == room_connections.c.room_a_id,
                                   secondaryjoin=id == room_connections.c.room_b_id)
    strats = relationship('Strat', secondary='room_strats', back_populates='rooms')
    UniqueConstraint(code, chapter_id)

    @property
    def image(self) -> PurePosixPath:
        return PurePosixPath(self.chapter.relative_path, self.code).with_suffix('.png')


class Strat(Base):
    __tablename__ = 'strat'
    id = Column(Integer, primary_key=True)
    nickname = Column(String)
    start_room_id = Column(Integer, ForeignKey('room.id'), nullable=False)
    start_detail = Column(String)
    end_room_id = Column(Integer, ForeignKey('room.id'), nullable=False)
    end_detail = Column(String)
    description = Column(String)
    notes = Column(String)
    start_room = relationship('Room', foreign_keys=start_room_id)
    end_room = relationship('Room', foreign_keys=end_room_id)
    rooms = relationship('Room', secondary=room_strats, back_populates='strats')
    categories = relationship('LevelCategory', secondary='strat_categories')


strat_categories = Table('strat_categories', Base.metadata,
                         Column('strat_id', Integer, ForeignKey('strat.id'), primary_key=True),
                         Column('level_category_id', Integer, ForeignKey('level_category.id'), primary_key=True))

# Other tables???
# routes:
#   chapter_id
#   room_id
#   checkpoint_id
#   room_number
