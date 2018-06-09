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

// fetch all the reservations
module.exports.getFilteredSuggestions = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    Suggestion.find({$or:[{title: new RegExp(searchText, "i")},
            {isbn: new RegExp(searchText, "i")},
            {author: new RegExp(searchText, "i")},
            {subject: new RegExp(searchText, "i")},
            {student_email: new RegExp(searchText, "i")},
        ]}, callback).sort({ title: 1 });
};

// delete a suggestion
module.exports.deleteSuggestion = (book,callback)=>{
    Suggestion.findOneAndDelete({_id:book._id},callback);
};
