#!/bin/bash

hugo --minify
rsync -avzP public/ stu:/home/stu/web/rob.stumb.org/public/
