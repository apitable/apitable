#!/bin/bash
set -e

MES=$(git log -1)

if [[ $MES == *"Merge branch 'staging' into 'master'"* ]]
then
  echo "Tag from master branch"
else
  echo "Tag is not from master branch!"
  exit 1
fi