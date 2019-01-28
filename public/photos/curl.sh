#!/bin/bash

mkdir female

for i in {1..26}
do
   curl https://uinames.com/api/photos/female/$i.jpg -o female/$i.jpg
done


mkdir male

for i in {1..26}
do
   curl https://uinames.com/api/photos/male/$i.jpg -o male/$i.jpg
done

# https://randomuser.me/api/portraits/men/$i.jpg
# https://randomuser.me/api/portraits/women/$i.jpg