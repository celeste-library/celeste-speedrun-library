#!/bin/bash

if [ "$1" == "true" ]; then
  if [ -d venv ]; then
    rm -rf venv
  fi
fi
if [ ! -d venv ]; then
  python3.10 -m venv venv
fi
if [ "$1" == "true" ]; then
  venv/bin/pip install wheel
fi
venv/bin/pip install -r requirements.txt
venv/bin/python util.py --deploy
