@ECHO OFF
set path=%path%;D:\Users\asheng\Programs\PortableGit\bin
ECHO =========git push github master============
git remote add github https://github.com/yunshangkeji/RuoYi-Vue
git pull github master
git push github master
PAUSE
