# Hydrant API
## Running
1. Install dependencies
```
npm install
```

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
