# Hydrant API
## Running
1. Install dependencies
```
nvm use 12
npm install
```
Due to errors connected wit sqlite3 package not able to build under Node.js 14, and newer sqlite3 5.0.0 not working at all (resulting in segfault), you have to uuse Node.js 12 for now.

2. Add `node` privileges for starting/stopping BT advertising
```
sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

3. Copy (and adjust) configuration file
```
cp config/config{.sample,}.js
```

4. Run server (development mode – auto restart on changes)
```
npm run start:dev
```
