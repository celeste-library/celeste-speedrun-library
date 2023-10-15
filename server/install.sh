#!/bin/bash

if [ "$1" == "true" ]; then
  if [ -d venv ]; then
    rm -rf venv
  fi
  python3.10 -m venv venv
fi
. venv/bin/activate
if [ "$1" == "true" ]; then
  pip install wheel
fi
pip install -r requirements.txt
python util.py --deploy
deactivate
