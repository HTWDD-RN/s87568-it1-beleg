#!/bin/bash

# Load variables from .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

SERVERADDR="https://idefix.informatik.htw-dresden.de:8888/api"
USERPASS=joshua.heninger@stud.htw-dresden.de:$PASSWORD

# register as new user
# Use the PASSWORD variable from .env
 # curl -i -X POST -H "Content-Type: application/json" -d '{"email":"joshua.heninger@stud.htw-dresden.de", "password": "$PASSWORD" }' https://idefix.informatik.htw-dresden.de:8888/api/register



# [[ GET ALL TASKS ]]
# get all quizzes on page=0
# curl -i --user joshua.heninger@stud.htw-dresden.de:$PASSWORD  -X GET \
#     https://idefix.informatik.htw-dresden.de:8888/api/quizzes?page=$1


# [[ POST new tasks ]]
# send a new question
# curl -i --user joshua.heninger@stud.htw-dresden.de:tafelwerk -X POST \
#      -H "Content-Type: application/json" \
#      -d '{"title":"test" , "text":"this is a test", "options":["a","b","c","d"], "answer": [0]}'\
#      https://idefix.informatik.htw-dresden.de:8888/api/quizzes
# # id: 1973

# curl -i --user joshua.heninger@stud.htw-dresden.de:tafelwerk -X POST \
#      -H "Content-Type: application/json" \
#      -d '{"title":"task2" , "text":"I am task 2", "options":["a","b","c","d"], "answer": [0]}'\
#      https://idefix.informatik.htw-dresden.de:8888/api/quizzes
# # id: 1974



# [[ GET TASKS ]]
# get task with id 2
curl -i --user joshua.heninger@stud.htw-dresden.de:tafelwerk  -X GET \
     https://idefix.informatik.htw-dresden.de:8888/api/quizzes/$1




# [[ Answer Quiz ]]
# answer a quiz 1974
# curl -i --user joshua.heninger@stud.htw-dresden.de:tafelwerk  -X POST \
#     https://idefix.informatik.htw-dresden.de:8888/api/quizzes/1974/solve\
#     -H 'Content-Type: application/json' \
#     -d '[0]'

# response: {"success":true,"feedback":"Congratulations, you're right!"}
#


# [[ Get all completed ]]
# curl -i --user joshua.heninger@stud.htw-dresden.de:tafelwerk -X GET  $SERVERADDR/quizzes/completed


# [[ Delete quiz ]]
# curl --user $USERPASS -X DELETE  $SERVERADDR/quizzes/$1
