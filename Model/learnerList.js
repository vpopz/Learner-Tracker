const mongoose = require('mongoose')

const learnerSchema = new mongoose.Schema(
    {
        learner_id: { type: String, required: true },
        name: { type: String, required: true },
        course: { type: String, enum: ['FSD', 'DSA', 'ML-AI', 'RPA', 'ST', 'CSA'], required: true },
        project: { type: String, enum: ['ICTAK', 'KKEM', 'NORKA', 'ABCD', 'KDISC'], required: true },
        batch: { type: String, enum: ['MAY_22', 'JUN_22', 'Jul_22', 'AUG_22', 'DEC_22', 'MAR_23'], required: true },
        course_status: { type: String, enum: ['Qualified', 'Incompetent'], required: true },
        placement_status: { type: String, enum: ['Placed', 'Job Seeking', 'Not Interested'], required: true }
    }
)

const learnerModel = mongoose.model(
    "learner", learnerSchema
)

module.exports = {learnerModel}