const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const configSchema = new Schema({
    announcement: {
        text: {
            type: String,
            default: ""
        },
        show: {
            type: Boolean,
            default: false
        }
    }
});

configSchema.statics.getSingleton = async () => {
    const config = await Config.findOne()
        .sort({ updated: -1 })
        .limit(1)

    if (!config) {
        return new Config();
    }

    return config;
}

const Config = mongoose.model('Config', configSchema)

module.exports = Config;