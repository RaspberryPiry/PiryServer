fileName=`ls -lt | grep bmp | awk '{print $9}' | head -1`
node raspapp.js $fileName
