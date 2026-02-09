echo "Compile ANGULAR Dashboard Management Start"
git pull

URLStyle=${1:-"http://old.cwiztech.com/dev/cwiztech/styles.css"}
OUTStyle=${2:-"src/styles.css"}
curl -fL "$URLStyle" -o "$OUTStyle"

URL=${1:-"http://old.cwiztech.com/dev/cwiztech/setting.ts"}
OUT=${2:-"src/app/setting.ts"}
curl -fL "$URL" -o "$OUT"

sed -i 's/APPLICATIONCODE/ANGULARDashboardManagement/' "$OUT"

echo "ng build command start"
ng build --prod --base-href ./

URLStyle=${1:-"http://old.cwiztech.com/dev/cwiztech/styles.css"}
OUTStyle=${2:-"src/styles.css"}
curl -fL "$URLStyle" -o "$OUTStyle"

URL=${1:-"http://old.cwiztech.com/dev/cwiztech/setting.ts"}
OUT=${2:-"src/app/setting.ts"}
curl -fL "$URL" -o "$OUT"

sed -i 's/APPLICATIONCODE/CWIZTECHDashboardManagementDev/' "$OUT"

echo "Update Changes"
git add .
echo "Git Added"
git commit -m "ANGULAR Dashboard Management updated"
echo "Git Commit"
git push
echo "Git Updated"

echo "Directory Changed"
cd ../../COMPANYwebapps
echo "Pull work for Live Server"
git pull

echo "Remove old files of ANGULAR Dashboard Management"
rm -r dashboard/*

echo "Copy new files of ANGULAR Dashboard Management from dashboardmanagement to cwiztechproject/COMPANYwebapps/dashboardmanagement"
cp -r ../projects/productmanagement/dashboard/* dashboard

echo "Push work for Live Server"
git add .
echo "Git Added"
git commit -m "ANGULAR Dashboard Management updated"
echo "Git Commit"
git push
echo "Git Updated"

echo "Live ANGULAR Dashboard Management"
cd /var/www/COMPANYwebapps
git pull