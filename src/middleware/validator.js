const Joi = require('joi')

exports.validateArtist = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(25).required(),
    genre: Joi.string().min(1).max(25).required()
  })

  try {
    await schema.validateAsync(req.body)
    next()
  } catch (err) {
    const errors = err.details.map(detail => detail.message)
    res.status(400).json({ errors })
  }
}