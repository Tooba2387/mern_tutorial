const asyncHandler = require('express-async-handler')
const Goal = require('../model/goalModel')
const User = require('../model/userModel')

// @desc GET Goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async(req, res) => { 
    const goals = await Goal.find({user: req.user.id})
    res.status(200).json(goals)
})

// @desc SET Goals
// @route POST /api/goals
// @access Private
const setGoals = asyncHandler( async(req, res) => { 
    if(!req.body.text){ 
        res.status(400)
        throw new Error('please add text')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

// @desc Update Goals
// @route PUT /api/goals/:id
// @access Private
const updateGoals = asyncHandler( async(req, res) => { 
    const goal = await Goal.findById(req.params.id)
    if (!goal) { 
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    if (!user){
        res.status(401)
        throw new Error('user not found')
    }

    if (goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('user not autherized')
    }

    const updateGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })

    res.status(200).json(updateGoal)
})

// @desc Delete Goals
// @route DELETE /api/goals/:id
// @access Private
const deleteGoals = asyncHandler(async(req, res) => { 
    const goal = await Goal.findById(req.params.id)
    if (!goal) { 
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    if (!user){
        res.status(401)
        throw new Error('user not found')
    }

    if (goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('user not autherized')
    }


    const removedGoal = await Goal.findByIdAndRemove(req.params.id);
    res.status(200).json('goal deleted')
}
)

module.exports.getGoals = getGoals;
module.exports.setGoals = setGoals;
module.exports.updateGoals = updateGoals;
module.exports.deleteGoals = deleteGoals;
