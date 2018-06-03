const mongoose = require('mongoose');
const schema = mongoose.Schema;

const suggestionSchema = new schema({
    isbn:{type:String,required:true},
    title:{type:String,required:true},
    author:{type:String,required:true},
    subject:{type:String,required:true},
    date_added:{type:String},
    student_email:{type:String}
});

const Suggestion = module.exports = mongoose.model("Suggestion",suggestionSchema);

// add a new suggestion
module.exports.saveSuggestion = (newSuggestion,callback)=>{
    newSuggestion.save(callback);
};

// get total reservation count
module.exports.getTotalCount = (callback)=>{
    Suggestion.count({},callback);
};
