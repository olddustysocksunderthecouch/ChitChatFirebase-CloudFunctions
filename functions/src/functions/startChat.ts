const error = require('./handlers')

export default (functions, admin) => (data, context) => {

	if (!context.auth) {
		return error('Authorization Error', 401)
	}
}