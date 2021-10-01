const someSchema = new mongoose.Schema({})

const UrlSchema = new mongoose.Schema({ 
    urlCode: { 
        require: "urlCode is required", 
        unique: true,
        lowercase: true, 
        trim: true 
    }, 
    longUrl: {
        require: "Long url is required", 
        //valid url
    }, 
    shortUrl: {
        require: "shorturl is required", 
        unique:true
    }
})

module.exports = mongoose.model('Url', UrlSchema, "url")