DESIGN_PATH='../design'
LOG=$DESIGN_PATH/'log'
ORIGIN_PATH=$DESIGN_PATH/'qietu/vikadata/'
TARGET_PATH='../datasheet/packages/datasheet/src/static/icon/'

function log() {
  if [ -d $LOG ]; then
    date +%Y%m%d%H%M%S >>$LOG/pull.log
  else
    mkdir $LOG && date +%Y%m%d%H%M%S >>$LOG/pull.log
  fi
}

function clone() {
  cp -r -f $ORIGIN_PATH $TARGET_PATH
  if [ $? == '0' ]; then
    log
    echo '文件复制成功'
  else
    echo '文件复制失败'
  fi
}

function deleteDir() {
  rm -rf TARGET_PATH
  if [ $? == '0' ]; then
    echo '源文件夹删除成功'
    clone
  else
    echo '源文件夹删除失败'
  fi
}

function pull() {
  echo 'git 更新中...'
  git pull 2>&1
  if [ $? == '0' ]; then
    echo 'git更新成功'
    deleteDir
  else
    echo 'git更新失败'
  fi
}

if [ -d $DESIGN_PATH ]; then
  cd $DESIGN_PATH
  pull
else
  mkdir $DESIGN_PATH
  echo '请检查design工程文件是否和datasheet文件处于同一级目录'
fi
