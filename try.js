// migrate.js
const mongoose = require('mongoose');

async function migrate() {
  // 連到本機 MongoDB
  const local = await mongoose.createConnection('mongodb://localhost:27017/your_db').asPromise();
  const LocalModel = local.model('YourModel', new mongoose.Schema({}, { strict: false }));

  // 連到 Atlas MongoDB
  const atlas = await mongoose.createConnection('mongodb+srv://bruce70345:9BWv_G._zATP34w@bruce.99xbbdk.mongodb.net/}').asPromise();
  const AtlasModel = atlas.model('YourModel', new mongoose.Schema({}, { strict: false }));

  const data = await LocalModel.find({});
  await AtlasModel.insertMany(data);
  console.log('✅ 資料成功搬過去了！');

  await local.close();
  await atlas.close();
}

migrate();