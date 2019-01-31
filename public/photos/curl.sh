#!/bin/bash

mkdir female

for i in {1..100}
do
   rename=`expr $i + 26`
   curl https://randomuser.me/api/portraits/women/$i.jpg -o female/$rename.jpg
done


mkdir male

for i in {1..100}
do
   rename=`expr $i + 26`
   curl https://randomuser.me/api/portraits/men/$i.jpg -o male/$rename.jpg
done


# https://uinames.com/api/photos/male/$i.jpg
# https://uinames.com/api/photos/female/$i.jpg
# https://randomuser.me/api/portraits/men/$i.jpg
# https://randomuser.me/api/portraits/women/$i.jpg