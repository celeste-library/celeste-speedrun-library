from pathlib import PurePosixPath

from .tables import Chapter, ChapterParent, Checkpoint, Room


def chapter_parent(token: str, chapter_number: int, chapter_name: str) -> ChapterParent:
    return ChapterParent(token=token, number=chapter_number, name=chapter_name)


def chapter(parent: ChapterParent, side_token: str, side_label: str) -> Chapter:
    token = f'{parent.token}-{side_token}'
    path = PurePosixPath(parent.token, side_token)
    return Chapter(token=token, side=side_label, relative_path=str(path), chapter_parent=parent)


def checkpoint(chapter: Chapter, checkpoint_number: int, name: str) -> Checkpoint:
    token = f'{chapter.token}-{str(checkpoint_number)}'
    return Checkpoint(token=token, number=checkpoint_number, name=name, chapter=chapter)


def room(checkpoint: Checkpoint, code: str, nickname: str) -> Room:
    token = f'{checkpoint.chapter.token}-{code}'
    return Room(token=token, code=code, nickname=nickname, checkpoint=checkpoint, chapter=checkpoint.chapter)
