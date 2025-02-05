const {Schema,model,Types}= require('mongoose')
const schema=Schema ({
    question:{ type:Types.ObjectId, ref: 'Question', required: true },
    employee:{ type:Types.ObjectId, ref: 'Employee', required: true },
    answer:{ type: String, required: true }, // الإجابة المقدمة
    createdAt:{ type: Date, default: Date.now }

})


module.exports=model('answer',schema)
