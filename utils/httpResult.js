const okResult = (msg) => ({ok: true, msg})
const errResult = (err) => ({ok: false, msg: err})

module.exports = {
    okResult,
    errResult
}