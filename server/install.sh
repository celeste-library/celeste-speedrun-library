#!/bin/bash

if [ "$1" == "true" ]; then
  if [ -d venv ]; then
    rm -rf venv
  fi
fi
if [ ! -d venv ]; then
  python3.10 -m venv venv
  venv/bin/pip install wheel
  venv/bin/pip install -r requirements.txt
fi
venv/bin/python util.py --deploy
