@ECHO OFF
set path=%path%;D:\Users\asheng\Programs\PortableGit\bin
git config pull.rebase true
git config user.email "dev@yskj.local"
git config user.name "yskj"
git config core.safecrlf warn
git config core.autocrlf true
git remote rm origin
git remote add origin https://gitee.com/yunshangkeji1/RuoYi-Vue
ECHO =========git diff============
git diff
ECHO =========git pull ^&^& git commit============
PAUSE
git pull origin master
git commit
ECHO =========git add *============
PAUSE
git add --all
ECHO =========git commit============
PAUSE
git commit
ECHO =========git push origin master============
PAUSE
git push origin master
ECHO =========EXIT============
PAUSE
EXIT
