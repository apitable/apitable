# 请修改下方常量
BUILD_DIST="./packages/datasheet/build/"
SERVER_HOST="ec2-161-189-141-24.cn-northwest-1.compute.amazonaws.com.cn"
# 注意，每次部署的版本号需要不一样，第二次运行需要改版本号！
BUILD_VERSION="0.7.0.4"
# 如果不需要拷贝，请注释下面两行
PEM_PATH="~/.ssh/vika_integration.pem"
scp -i $PEM_PATH -r $BUILD_DIST centos@$SERVER_HOST:/data/vikadata/nginx/static/datasheet

htmlContent=$(cat ${BUILD_DIST}index.html)
echo $htmlContent
htmlContentBase64=$(echo $(base64 <<< $htmlContent))
SERVER_URL="http://${SERVER_HOST}"
DEPLOY_URL=$SERVER_URL"/api/v1/client/build"
PUBLISH_URL=$SERVER_URL"/api/v1/client/publish"
git_message="私有化部署"
GITLAB_USER_EMAIL="chenjiabei@vikadata.com"
# 发送入口文件html逻辑判断
response=$(echo `curl -H 'Content-Type:application/json' -X POST -d '{"description":"'"$git_message"'","htmlContent":"'"$htmlContentBase64"'","publishUser":"'"$GITLAB_USER_EMAIL"'","version":"'"$BUILD_VERSION"'"}' ${DEPLOY_URL}`)
echo $response
resonseCode=$(echo ${response} | awk -F 'code":' '{print $2}'| awk -F ',' '{print $1}')
echo $resonseCode
# 如果入口文件写入失败, 不能执行publish
(if [ "$resonseCode" == "200" ];then echo "resonseCode=200";else echo :"resonseCode=error" && apt-get;fi)
# 发布datashseet，feature分支不进行发布
publishResponse=$(echo `curl -H 'Content-Type:application/json' -X POST -d '{"version":"'"$BUILD_VERSION"'"}' ${PUBLISH_URL}`)
echo $publishResponse
